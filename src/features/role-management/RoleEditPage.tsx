import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import { Icon } from "@iconify/react";
import { useGetRole, useGetPermissions, useGetRoles, useUpdateRole, useCreateRole } from "@/app/api/role/useRoleApi";
import { Button } from "@/shared/components/agrofy-ui/ui/button";
import { Input } from "@/shared/components/agrofy-ui/ui/input";
import { useToast } from "@/shared/hooks";
import { useAuth } from "@/app/auth";
import { apiService } from "@/app/services/apiService";
import type { PermissionItem, RoleItem } from "@/app/api/role/type";
import type { MenuItem } from "@/app/router/SidebarItems";
import SuperAdminSidebarContent from "@/app/router/SuperAdminSidebarItems";
import AdminSidebarContent from "@/app/router/AdminSidebarItems";
import DoctorSidebarContent from "@/app/router/DoctorSidebarItems";
import StuntingParentSidebarContent from "@/app/router/StuntingParentSidebarItems";

const ROLE_NAME_ALIASES: Record<string, string> = {
  super_admin: "superadmin",
  orangtua: "orang_tua",
};

const ROLE_ICON_MAP: Record<string, string> = {
  superadmin: "solar:shield-user-outline",
  admin: "solar:user-check-rounded-outline",
  dokter: "solar:stethoscope-outline",
  healthworker: "solar:stethoscope-outline",
  user: "solar:users-group-rounded-outline",
  orang_tua: "solar:users-group-rounded-outline",
};

const ROLE_SORT_ORDER = ["superadmin", "admin", "dokter", "healthworker", "user", "orang_tua"];

const MODULE_LABEL_ALIASES: Record<string, string> = {
  children: "Pasien / Data Anak",
  consultations: "Konsultasi",
  foods: "Makanan",
  stunting: "Deteksi Stunting",
  users: "Manajemen Pengguna",
  roles: "Role & Permission",
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

interface ExclusiveRoleOption {
  key: string;
  label: string;
  description: string;
  icon: string;
}

const toTitleCase = (value: string): string =>
  value
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const getRoleIcon = (roleName: string): string => {
  const normalized = roleName.toLowerCase().replace(/[^a-z0-9_]+/g, "");
  return ROLE_ICON_MAP[normalized] ?? "solar:shield-check-outline";
};

const extractModuleLabel = (permission: PermissionItem, fallbackModule: string): string => {
  if (MODULE_LABEL_ALIASES[fallbackModule]) {
    return MODULE_LABEL_ALIASES[fallbackModule];
  }

  const raw = permission.display_name?.trim();
  if (!raw) {
    return toTitleCase(fallbackModule);
  }

  const actionPrefixPattern = /^(select|create|read|update|delete|restore|pilih|buat|baca|ubah|hapus|kembalikan)\s+/i;
  const cleaned = raw.replace(actionPrefixPattern, "").trim();

  return cleaned || toTitleCase(fallbackModule);
};

const extractModuleFromPermissionName = (permissionName: string): string | null => {
  const dashIdx = permissionName.lastIndexOf("-");
  const dotIdx = permissionName.lastIndexOf(".");

  for (const idx of [dashIdx, dotIdx]) {
    if (idx === -1) continue;
    const action = permissionName.slice(idx + 1);
    if (ACTIONS.includes(action)) {
      return permissionName.slice(0, idx);
    }
  }

  return null;
};

const collectModulesFromSidebar = (sidebarContent: MenuItem[]): Set<string> => {
  const modules = new Set<string>();

  sidebarContent.forEach((section) => {
    section.items?.forEach((item) => {
      item.children?.forEach((child) => {
        if (!child.permission) return;
        const moduleName = extractModuleFromPermissionName(child.permission);
        if (moduleName) {
          modules.add(moduleName);
        }
      });
    });
  });

  return modules;
};

/**
 * Supports both formats:
 *   "articles-create"  (laratrust default, dash separator)
 *   "articles.create"  (dot separator)
 */
function groupPermissions(permissions: PermissionItem[]): PermissionGroup[] {
  const groups: Record<string, Record<string, string>> = {};
  const labels: Record<string, string> = {};

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

    if (!labels[module]) {
      labels[module] = extractModuleLabel(p, module);
    }
  });

  return Object.entries(groups)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([module, perms]) => ({
      module,
      label: labels[module] ?? toTitleCase(module),
      row: Object.fromEntries(ACTIONS.map((a) => [a, perms[a] ?? null])),
    }));
}

// ─── Component ───────────────────────────────────────────────────────────────

const RoleEditPage = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { refreshUser, user } = useAuth();
  const isEdit = !!id;

  const [displayName, setDisplayName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [selectedExclusiveRoles, setSelectedExclusiveRoles] = useState<Set<string>>(new Set());

  const { data: roleData, isLoading: roleLoading } = useGetRole(parseInt(id ?? "0"), {
    enabled: isEdit,
  });
  const { data: permsData, isLoading: permsLoading } = useGetPermissions();
  const { data: rolesData, isLoading: rolesLoading } = useGetRoles();

  const role = roleData?.data?.data;
  const allPermissions: PermissionItem[] = permsData?.data?.data ?? [];
  const allRoles: RoleItem[] = rolesData?.data?.data ?? [];
  const groups = groupPermissions(allPermissions);

  function normalizeRoleName(rawName: string): string {
    const normalized = rawName.toLowerCase().trim().replace(/\s+/g, "_");
    return ROLE_NAME_ALIASES[normalized] ?? normalized;
  }

  const roleByName = useMemo(() => {
    return new Map(allRoles.map((item) => [item.name, item]));
  }, [allRoles]);

  const rolePermissionsByNormalized = useMemo(() => {
    const map = new Map<string, Set<string>>();

    allRoles.forEach((item) => {
      const normalized = normalizeRoleName(item.name);

      if (!map.has(normalized)) {
        map.set(normalized, new Set<string>());
      }

      (item.permissions ?? []).forEach((permissionName) => {
        map.get(normalized)?.add(permissionName);
      });
    });

    return map;
  }, [allRoles]);

  const canonicalRoleKeyByNormalized = useMemo(() => {
    const map = new Map<string, string>();

    allRoles.forEach((item) => {
      const normalized = normalizeRoleName(item.name);
      if (!map.has(normalized)) {
        map.set(normalized, item.name);
      }
    });

    return map;
  }, [allRoles]);

  const roleMenuModules = useMemo(() => {
    return new Map<string, Set<string>>([
      ["superadmin", collectModulesFromSidebar(SuperAdminSidebarContent)],
      ["admin", collectModulesFromSidebar(AdminSidebarContent)],
      ["dokter", collectModulesFromSidebar(DoctorSidebarContent)],
      ["healthworker", collectModulesFromSidebar(DoctorSidebarContent)],
      ["user", collectModulesFromSidebar(StuntingParentSidebarContent)],
      ["orang_tua", collectModulesFromSidebar(StuntingParentSidebarContent)],
      ["orangtua", collectModulesFromSidebar(StuntingParentSidebarContent)],
      ["parent", collectModulesFromSidebar(StuntingParentSidebarContent)],
    ]);
  }, []);

  const exclusiveRoleOptions: ExclusiveRoleOption[] = useMemo(() => {
    const options = allRoles
      .filter((item) => (item.permissions ?? []).length > 0)
      .map((item) => {
        const normalized = normalizeRoleName(item.name);
        return {
          key: item.name,
          label: item.display_name?.trim() || toTitleCase(item.name),
          description: item.description?.trim() || `Template permission untuk role ${toTitleCase(item.name)}`,
          icon: getRoleIcon(normalized),
        };
      });

    return options.sort((a, b) => {
      const indexA = ROLE_SORT_ORDER.indexOf(normalizeRoleName(a.key));
      const indexB = ROLE_SORT_ORDER.indexOf(normalizeRoleName(b.key));

      if (indexA === -1 && indexB === -1) return a.label.localeCompare(b.label);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  }, [allRoles]);

  const getTemplatePermissions = (templateKey: string | null): string[] => {
    if (!templateKey) return [];

    const template = roleByName.get(templateKey)?.permissions ?? [];

    const availableNames = new Set(allPermissions.map((permission) => permission.name));
    return template.filter((permissionName) => availableNames.has(permissionName));
  };

  const visibleModuleNames = useMemo<Set<string> | null>(() => {
    if (selectedExclusiveRoles.size === 0) {
      return null;
    }

    const modules = new Set<string>();

    const baselineRole = role?.name ? normalizeRoleName(role.name) : null;
    if (baselineRole) {
      roleMenuModules.get(baselineRole)?.forEach((moduleName) => modules.add(moduleName));
    }

    Array.from(selectedExclusiveRoles).forEach((roleKey) => {
      const normalizedRoleKey = normalizeRoleName(roleKey);
      roleMenuModules.get(normalizedRoleKey)?.forEach((moduleName) => modules.add(moduleName));
    });

    selected.forEach((permissionName) => {
      const moduleName = extractModuleFromPermissionName(permissionName);
      if (moduleName) {
        modules.add(moduleName);
      }
    });

    return modules;
  }, [selectedExclusiveRoles, selected, role?.name, roleMenuModules]);

  const visibleGroups = useMemo(() => {
    if (!visibleModuleNames) {
      return groups;
    }

    return groups.filter((group) => visibleModuleNames.has(group.module));
  }, [groups, visibleModuleNames]);

  const selectablePermissionNames = useMemo(() => {
    if (!visibleModuleNames) {
      return allPermissions.map((permission) => permission.name);
    }

    return visibleGroups.flatMap((group) =>
      ACTIONS
        .map((action) => group.row[action])
        .filter((permissionName): permissionName is string => !!permissionName)
    );
  }, [allPermissions, visibleModuleNames, visibleGroups]);

  useEffect(() => {
    if (!role) return;

    setDisplayName(role.display_name ?? "");
    setDescription(role.description ?? "");

    const rolePermissions = new Set(role.permissions ?? []);
    setSelected(new Set(role.permissions ?? []));

    const inferredExclusive = new Set<string>();
    const roleName = normalizeRoleName(role.name ?? "");

    if (roleName === "superadmin") {
      const accountRoles = Array.isArray(user?.roles) ? user.roles : [];
      const normalizedAccountRoles = new Set(accountRoles.map((name) => normalizeRoleName(name)));

      if (normalizedAccountRoles.has("superadmin") && roleByName.has("superadmin")) {
        inferredExclusive.add("superadmin");
      }
      if (normalizedAccountRoles.has("admin") && roleByName.has("admin")) {
        inferredExclusive.add("admin");
      }
      if (
        (normalizedAccountRoles.has("dokter") && roleByName.has("dokter"))
        || (normalizedAccountRoles.has("healthworker") && roleByName.has("healthworker"))
      ) {
        inferredExclusive.add("dokter");
      }
      if (
        (normalizedAccountRoles.has("user") && roleByName.has("user"))
        || normalizedAccountRoles.has("orangtua")
        || normalizedAccountRoles.has("parent")
      ) {
        inferredExclusive.add("user");
      }

      if (inferredExclusive.size > 0) {
        setSelectedExclusiveRoles(inferredExclusive);
        return;
      }
    }

    if (roleByName.has(role.name)) {
      inferredExclusive.add(role.name);
      setSelectedExclusiveRoles(inferredExclusive);
      return;
    }

    exclusiveRoleOptions.forEach((option) => {
      const template = roleByName.get(option.key)?.permissions ?? [];

      const requiredPermissions = template.filter((permissionName) =>
        allPermissions.some((permission) => permission.name === permissionName)
      );

      if (requiredPermissions.length === 0) {
        return;
      }

      const allRequiredPresent = requiredPermissions.every((permissionName) =>
        rolePermissions.has(permissionName)
      );

      const noUnexpectedPermissions = Array.from(rolePermissions).every((permissionName) =>
        requiredPermissions.includes(permissionName)
      );

      if (allRequiredPresent && noUnexpectedPermissions) {
        inferredExclusive.add(option.key);
      }
    });

    setSelectedExclusiveRoles(inferredExclusive);
  }, [role, allPermissions, roleByName, exclusiveRoleOptions, user?.roles]);

  const updateMutation = useUpdateRole({
    onSuccess: async () => {
      const editedRoleName = normalizeRoleName(role?.name ?? displayName);

      if (editedRoleName === "superadmin") {
        try {
          const currentRoleName = user?.role
            ? (typeof user.role === "string" ? user.role : user.role.name)
            : "";

          if (normalizeRoleName(currentRoleName) === "superadmin") {
            const selectedKeys = new Set(selectedExclusiveRoles);
            selectedKeys.add("superadmin");

            const dbRoles = Array.from(selectedKeys).filter(Boolean);

            await apiService.post("/api/v1/profile/sync-roles", {
              roles: dbRoles,
            });
          }
        } catch {
          toast.error("Role diperbarui, tetapi sinkronisasi role akun gagal");
        }
      }

      await refreshUser();
      toast.success("Role berhasil diperbarui");
      navigate("/roles");
    },
    onError: () => toast.error("Gagal memperbarui role"),
  });

  const createMutation = useCreateRole({
    onSuccess: async () => {
      await refreshUser();
      toast.success("Role berhasil dibuat");
      navigate("/roles");
    },
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
    const areAllSelectableChecked = selectablePermissionNames.length > 0
      && selectablePermissionNames.every((permissionName) => selected.has(permissionName));

    if (areAllSelectableChecked) {
      setSelected((prevSelected) => {
        const nextSelected = new Set(prevSelected);
        selectablePermissionNames.forEach((permissionName) => nextSelected.delete(permissionName));
        return nextSelected;
      });
      return;
    }

    setSelected((prevSelected) => new Set([...prevSelected, ...selectablePermissionNames]));
  };

  const handleSubmit = () => {
    if (!displayName.trim()) { toast.error("Nama role tidak boleh kosong"); return; }

    const normalizedName = normalizeRoleName(displayName);
    const roleName = isEdit ? (role?.name ?? normalizedName) : normalizedName;

    const normalizedRoleName = normalizeRoleName(roleName);

    let effectiveExclusiveRoles = Array.from(selectedExclusiveRoles);

    if (normalizedRoleName === "superadmin") {
      const selectedRoleSet = new Set(
        effectiveExclusiveRoles.map((item) => normalizeRoleName(item))
      );
      selectedRoleSet.add("superadmin");

      const priorityRoles = ["admin", "dokter", "user"];

      Array.from(selected).forEach((permissionName) => {
        const alreadyCovered = Array.from(selectedRoleSet).some((roleKey) =>
          rolePermissionsByNormalized.get(roleKey)?.has(permissionName)
        );

        if (alreadyCovered) {
          return;
        }

        const inferredRole = priorityRoles.find((roleKey) =>
          rolePermissionsByNormalized.get(roleKey)?.has(permissionName)
        );

        if (inferredRole) {
          selectedRoleSet.add(inferredRole);
        }
      });

      effectiveExclusiveRoles = Array.from(selectedRoleSet)
        .map((roleKey) => canonicalRoleKeyByNormalized.get(roleKey) ?? roleKey)
        .filter((roleKey) => roleByName.has(roleKey));
    }

    const payload = {
      display_name: displayName,
      name: roleName,
      description,
      permissions: Array.from(selected),
      exclusive_roles: effectiveExclusiveRoles,
    };
    if (isEdit) updateMutation.mutate({ id: parseInt(id!), data: payload });
    else createMutation.mutate(payload);
  };

  const handleSelectExclusive = (templateKey: string) => {
    const isChecked = selectedExclusiveRoles.has(templateKey);

    setSelectedExclusiveRoles((prev) => {
      const next = new Set(prev);

      if (isChecked) {
        next.delete(templateKey);

        const removedTemplatePermissions = new Set(getTemplatePermissions(templateKey));
        const retainedTemplatePermissions = new Set(
          Array.from(next).flatMap((key) => getTemplatePermissions(key))
        );

        setSelected((prevSelected) => {
          const nextSelected = new Set(prevSelected);
          removedTemplatePermissions.forEach((permissionName) => {
            if (!retainedTemplatePermissions.has(permissionName)) {
              nextSelected.delete(permissionName);
            }
          });
          return nextSelected;
        });
      } else {
        next.add(templateKey);
        const templatePermissions = getTemplatePermissions(templateKey);
        setSelected((prevSelected) => new Set([...prevSelected, ...templatePermissions]));
      }

      return next;
    });
  };

  const handleSelectAllExclusive = () => {
    const allSelected = selectedExclusiveRoles.size === exclusiveRoleOptions.length;

    if (allSelected) {
      setSelectedExclusiveRoles(new Set());
      const allTemplatePermissions = new Set(
        exclusiveRoleOptions.flatMap((item) => getTemplatePermissions(item.key))
      );
      setSelected((prevSelected) => {
        const nextSelected = new Set(prevSelected);
        allTemplatePermissions.forEach((permissionName) => nextSelected.delete(permissionName));
        return nextSelected;
      });
      return;
    }

    const allKeys = exclusiveRoleOptions.map((item) => item.key);
    setSelectedExclusiveRoles(new Set(allKeys));

    const mergedTemplatePermissions = allKeys.flatMap((key) => getTemplatePermissions(key));
    setSelected((prev) => new Set([...prev, ...mergedTemplatePermissions]));
  };

  const isLoading = (isEdit && roleLoading) || permsLoading || rolesLoading;

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
                  {selectablePermissionNames.length > 0 && selectablePermissionNames.every((permissionName) => selected.has(permissionName))
                    ? "Hapus Semua"
                    : "Pilih Semua"}
                </button>
              </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-darkminisidebar rounded-xl border border-gray-200 dark:border-darkborder space-y-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-[#0152EA]">Hak Akses Khusus (Exclusive Role)</p>
                <button
                  type="button"
                  onClick={handleSelectAllExclusive}
                  className="text-xs text-[#0152EA] hover:underline font-medium"
                >
                  {selectedExclusiveRoles.size === exclusiveRoleOptions.length ? "Hapus Semua Role" : "Pilih Semua Role"}
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Centang satu atau lebih role untuk auto-terapkan permission bawaan role tersebut.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {exclusiveRoleOptions.map((item) => {
                  const active = selectedExclusiveRoles.has(item.key);
                  return (
                    <div
                      key={item.key}
                      onClick={() => handleSelectExclusive(item.key)}
                      className={`text-left p-3 rounded-xl border transition-all cursor-pointer ${
                        active
                          ? "border-[#0152EA] bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-200 dark:border-darkborder bg-white dark:bg-darkgray hover:border-blue-300"
                      }`}
                    >
                      <div className="flex items-start gap-2 mb-1">
                        <input
                          type="checkbox"
                          checked={active}
                          onChange={() => handleSelectExclusive(item.key)}
                          className="mt-0.5 w-4 h-4 rounded accent-[#0152EA]"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <Icon icon={item.icon} width={16} className={active ? "text-[#0152EA]" : "text-gray-500"} />
                        <span className={`text-sm font-semibold ${active ? "text-[#0152EA]" : "text-gray-700 dark:text-gray-300"}`}>
                          {item.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug">{item.description}</p>
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
                    {visibleGroups.map((group) => (
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
