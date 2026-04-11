import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useGetRole, useGetPermissions, useUpdateRole, useCreateRole } from "@/app/api/role/useRoleApi";
import { Button } from "@/shared/components/agrofy-ui/ui/button";
import { Input } from "@/shared/components/agrofy-ui/ui/input";
import { useToast } from "@/shared/hooks";
import type { PermissionItem } from "@/app/api/role/type";

// ─── Exclusive Permissions ────────────────────────────────────────────────────

const EXCLUSIVE_PERMISSIONS = [
  {
    name: "role-dokter",
    label: "Dokter",
    description: "Akses khusus untuk tenaga medis yang menangani konsultasi",
    icon: "solar:stethoscope-outline",
  },
  {
    name: "role-admin",
    label: "Admin",
    description: "Akses khusus untuk admin pengelola konten dan data",
    icon: "solar:user-check-rounded-outline",
  },
  {
    name: "role-superadmin",
    label: "Super Admin",
    description: "Akses penuh ke seluruh fitur dan konfigurasi sistem",
    icon: "solar:shield-user-outline",
  },
  {
    name: "role-orang_tua",
    label: "Orang Tua",
    description: "Akses untuk memantau tumbuh kembang dan deteksi stunting anak",
    icon: "solar:users-group-rounded-outline",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const MODULE_LABELS: Record<string, string> = {
  articles: "Artikel",
  dashboard: "Dashboard",
  users: "Manajemen Pengguna",
  roles: "Role & Permission",
  children: "Data Anak",
  stunting: "Deteksi Stunting",
  consultation: "Konsultasi",
  monitoring: "Monitoring",
  recommendation: "Rekomendasi",
};

const ACTIONS = ["select", "create", "read", "update", "delete", "restore"];
const ACTION_LABELS: Record<string, string> = {
  select: "Select", create: "Create", read: "Read",
  update: "Update", delete: "Delete", restore: "Restore",
};

interface PermissionGroup {
  module: string;
  label: string;
  row: Record<string, string | null>; // action → permName | null
}

/**
 * Supports both formats:
 *   "articles-create"  (laratrust default, dash separator)
 *   "articles.create"  (dot separator)
 */
function groupPermissions(permissions: PermissionItem[]): PermissionGroup[] {
  const groups: Record<string, Record<string, string>> = {};

  permissions.forEach((p) => {
    const dashIdx = p.name.lastIndexOf("-");
    const dotIdx  = p.name.lastIndexOf(".");

    // Pick the separator that gives a known action at the end
    let module = p.name;
    let action = "read";

    for (const idx of [dashIdx, dotIdx]) {
      if (idx === -1) continue;
      const candidate = p.name.slice(idx + 1);
      if (ACTIONS.includes(candidate)) {
        module = p.name.slice(0, idx);
        action = candidate;
        break;
      }
    }

    if (!groups[module]) groups[module] = {};
    groups[module][action] = p.name;
  });

  return Object.entries(groups)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([module, perms]) => ({
      module,
      label: MODULE_LABELS[module]
        ?? module.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      row: Object.fromEntries(ACTIONS.map((a) => [a, perms[a] ?? null])),
    }));
}

// ─── Component ───────────────────────────────────────────────────────────────

const RoleEditPage = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const isEdit = !!id;

  const [displayName, setDisplayName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  // Exclusive permissions: UI-only, persisted in localStorage per role
  const exclusiveKey = `exclusive_perms_${id ?? "new"}`;
  const [selectedExclusive, setSelectedExclusive] = useState<Set<string>>(
    () => new Set(JSON.parse(localStorage.getItem(exclusiveKey) ?? "[]"))
  );

  const { data: roleData, isLoading: roleLoading } = useGetRole(parseInt(id ?? "0"), {
    enabled: isEdit,
  });
  const { data: permsData, isLoading: permsLoading } = useGetPermissions();

  const role = roleData?.data?.data;
  const allPermissions: PermissionItem[] = permsData?.data?.data ?? [];
  const groups = groupPermissions(allPermissions);

  useEffect(() => {
    if (role) {
      setDisplayName(role.display_name ?? "");
      setDescription(role.description ?? "");
      setSelected(new Set(role.permissions ?? []));
    }
  }, [role]);

  // Persist exclusive selection to localStorage
  useEffect(() => {
    localStorage.setItem(exclusiveKey, JSON.stringify(Array.from(selectedExclusive)));
  }, [selectedExclusive, exclusiveKey]);

  const updateMutation = useUpdateRole({
    onSuccess: () => { toast.success("Role berhasil diperbarui"); navigate("/roles"); },
    onError: () => toast.error("Gagal memperbarui role"),
  });

  const createMutation = useCreateRole({
    onSuccess: () => { toast.success("Role berhasil dibuat"); navigate("/roles"); },
    onError: () => toast.error("Gagal membuat role"),
  });

  const isPending = updateMutation.isPending || createMutation.isPending;

  const togglePermission = (permName: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(permName) ? next.delete(permName) : next.add(permName);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === allPermissions.length) setSelected(new Set());
    else setSelected(new Set(allPermissions.map((p) => p.name)));
  };

  const handleSubmit = () => {
    if (!displayName.trim()) { toast.error("Nama role tidak boleh kosong"); return; }
    const payload = {
      display_name: displayName,
      name: displayName.toLowerCase().replace(/\s+/g, "_"),
      description,
      permissions: Array.from(selected),
    };
    if (isEdit) updateMutation.mutate({ id: parseInt(id!), data: payload });
    else createMutation.mutate(payload);
  };

  const isLoading = (isEdit && roleLoading) || permsLoading;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/roles")}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-darkminisidebar text-gray-500"
        >
          <Icon icon="solar:arrow-left-outline" width={18} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isEdit ? "Update Data Role" : "Buat Role Baru"}
        </h1>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24 text-gray-400">
          <Icon icon="solar:refresh-line-duotone" className="animate-spin mr-2" width={20} />
          Memuat data...
        </div>
      ) : (
        <>
          {/* Informasi Role */}
          <div className="bg-white dark:bg-darkgray rounded-[12px] border border-gray-200 dark:border-darkborder p-6 space-y-4">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Informasi Role</h2>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Nama Role <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Contoh: Super Admin"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="h-10"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Deskripsi <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Masukkan deskripsi role"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-darkborder rounded-lg bg-white dark:bg-darkgray text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0152EA] resize-none"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded accent-[#0152EA]"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Active</span>
            </label>
          </div>

          {/* Permissions */}
          <div className="bg-white dark:bg-darkgray rounded-[12px] border border-gray-200 dark:border-darkborder p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">Permissions</h2>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-gray-500">{selected.size} / {allPermissions.length} dipilih</span>
                <button onClick={toggleAll} className="text-[#0152EA] hover:underline font-medium">
                  {selected.size === allPermissions.length ? "Hapus Semua" : "Pilih Semua"}
                </button>
              </div>
            </div>

            {/* Exclusive Permissions Cards — UI only, tidak dikirim ke backend */}
            <div className="p-4 bg-gray-50 dark:bg-darkminisidebar rounded-xl border border-gray-200 dark:border-darkborder space-y-3">
              <p className="text-sm font-semibold text-[#0152EA]">Hak Akses Khusus (Exclusive Permissions)</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {EXCLUSIVE_PERMISSIONS.map((ep) => {
                  const isChecked = selectedExclusive.has(ep.name);
                  const toggle = () => setSelectedExclusive((prev) => {
                    const next = new Set(prev);
                    next.has(ep.name) ? next.delete(ep.name) : next.add(ep.name);
                    return next;
                  });
                  return (
                    <div
                      key={ep.name}
                      onClick={toggle}
                      className={`p-3 bg-white dark:bg-darkgray rounded-xl cursor-pointer transition-all border-2 ${
                        isChecked
                          ? "border-[#0152EA] shadow-sm shadow-blue-100"
                          : "border-gray-200 dark:border-darkborder hover:border-blue-300"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={toggle}
                          className="mt-0.5 w-4 h-4 rounded accent-[#0152EA] flex-shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div>
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <Icon
                              icon={ep.icon}
                              width={16}
                              className={isChecked ? "text-[#0152EA]" : "text-gray-500"}
                            />
                            <span className={`text-sm font-semibold ${isChecked ? "text-[#0152EA]" : "text-gray-700 dark:text-gray-300"}`}>
                              {ep.label}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 leading-snug">{ep.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {allPermissions.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Icon icon="solar:lock-keyhole-outline" width={36} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">Belum ada permission tersedia di database</p>
              </div>
            ) : (
              <div className="overflow-x-auto border border-gray-200 dark:border-darkborder rounded-lg">
                <table className="min-w-full">
                  <thead className="bg-white dark:bg-darkgray border-b border-gray-200 dark:border-darkborder">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 min-w-[200px]">
                        Module / Feature
                      </th>
                      {ACTIONS.map((action) => (
                        <th key={action} className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300 min-w-[90px]">
                          {ACTION_LABELS[action]}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {groups.map((group) => (
                      <tr
                        key={group.module}
                        className="border-t border-gray-100 dark:border-darkborder"
                        style={{ background: "rgba(1, 82, 234, 0.04)" }}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Icon icon="solar:shield-check-outline" width={15} className="text-[#0152EA]" />
                            <span className="text-sm font-semibold text-[#0152EA]">{group.label}</span>
                          </div>
                        </td>
                        {ACTIONS.map((action) => {
                          const permName = group.row[action];
                          const checked = permName ? selected.has(permName) : false;
                          return (
                            <td key={action} className="px-4 py-3 text-center">
                              <input
                                type="checkbox"
                                checked={checked}
                                disabled={!permName}
                                onChange={() => permName && togglePermission(permName)}
                                className={`w-4 h-4 rounded accent-[#0152EA] ${
                                  !permName ? "opacity-20 cursor-not-allowed" : "cursor-pointer"
                                }`}
                              />
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => navigate("/roles")} disabled={isPending} className="h-10 px-6">
              Batalkan
            </Button>
            <Button onClick={handleSubmit} disabled={isPending} className="bg-[#0152EA] hover:bg-blue-700 text-white h-10 px-6 gap-2">
              {isPending && <Icon icon="solar:refresh-line-duotone" className="animate-spin" width={14} />}
              Simpan
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default RoleEditPage;
