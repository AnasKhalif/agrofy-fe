import { useState } from "react";
import { useNavigate } from "react-router";
import { Icon } from "@iconify/react";
import { useGetRoles, useDeleteRole } from "@/app/api/role/useRoleApi";
import { Button } from "@/shared/components/agrofy-ui/ui/button";
import { Input } from "@/shared/components/agrofy-ui/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/agrofy-ui/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/agrofy-ui/ui/alert-dialog";
import { useToast } from "@/shared/hooks";
import type { RoleItem } from "@/app/api/role/type";

const ROLE_COLORS: Record<string, { badge: string; icon: string }> = {
  superadmin: { badge: "text-purple-600 bg-purple-50 border border-purple-200", icon: "text-purple-600 bg-purple-50" },
  admin:      { badge: "text-blue-600 bg-blue-50 border border-blue-200",       icon: "text-blue-600 bg-blue-50"   },
  dokter:     { badge: "text-green-600 bg-green-50 border border-green-200",    icon: "text-green-600 bg-green-50" },
  user:       { badge: "text-orange-600 bg-orange-50 border border-orange-200", icon: "text-orange-600 bg-orange-50" },
  orang_tua:  { badge: "text-orange-600 bg-orange-50 border border-orange-200", icon: "text-orange-600 bg-orange-50" },
};

const ITEMS_PER_PAGE = 10;

const RoleManagementPage = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, refetch } = useGetRoles();
  const roles: RoleItem[] = data?.data?.data ?? [];

  const deleteMutation = useDeleteRole({
    onSuccess: () => { toast.success("Role berhasil dihapus"); setDeleteId(null); refetch(); },
    onError: () => toast.error("Gagal menghapus role"),
  });

  const filtered = roles.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    (r.display_name ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const paged = filtered.slice(startIndex, endIndex);

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Daftar Role</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Kelola hak akses setiap role dalam sistem</p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative w-64">
          <Icon icon="solar:magnifer-outline" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width={15} />
          <Input
            placeholder="Cari role..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="pl-9 h-9 text-sm"
          />
        </div>
        <Button
          onClick={() => navigate("/roles/create")}
          className="bg-[#0152EA] hover:bg-blue-700 text-white gap-2 h-9 text-sm"
        >
          <Icon icon="solar:add-circle-outline" width={16} />
          Buat Role
        </Button>
      </div>

      {/* Table Card */}
      <div className="bg-white dark:bg-darkgray rounded-[12px] border border-gray-200 dark:border-darkborder overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 dark:bg-darkminisidebar border-b border-gray-200 dark:border-darkborder">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[120px]">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[180px]">Permissions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[140px]">Created</th>
                <th className="px-6 py-3 w-[50px]"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-darkborder bg-white dark:bg-darkgray">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 bg-gray-100 dark:bg-darkminisidebar rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : paged.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-gray-400">
                    <Icon icon="solar:shield-check-outline" width={40} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Tidak ada role ditemukan</p>
                  </td>
                </tr>
              ) : (
                paged.map((role) => {
                  const colors = ROLE_COLORS[role.name];
                  const perms = role.permissions ?? [];

                  return (
                    <tr key={role.id} className="hover:bg-gray-50 dark:hover:bg-darkminisidebar">
                      {/* Role Name + Deskripsi */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${colors?.icon ?? "text-gray-600 bg-gray-100"}`}>
                            <Icon icon="solar:shield-user-outline" width={17} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                              {role.display_name || role.name}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {role.description || role.name}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                          Active
                        </span>
                      </td>

                      {/* Permissions */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                          <Icon icon="solar:users-group-rounded-outline" width={15} className="text-gray-400" />
                          {perms.length} permissions
                        </div>
                      </td>

                      {/* Created */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {role.created_at
                          ? new Date(role.created_at).toLocaleDateString("id-ID")
                          : "-"}
                      </td>

                      {/* Titik 3 */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-gray-400 hover:text-gray-700">
                              <Icon icon="solar:menu-dots-bold" width={15} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-32">
                            <DropdownMenuItem onClick={() => navigate(`/roles/edit/${role.id}`)}>
                              <Icon icon="solar:pen-outline" className="mr-2" width={14} />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onClick={() => setDeleteId(role.id)}
                            >
                              <Icon icon="solar:trash-bin-trash-outline" className="mr-2" width={14} />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalItems > 0 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 dark:border-darkborder">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Menampilkan {startIndex + 1} sampai {endIndex} dari {totalItems} entri
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-full text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-darkminisidebar disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Icon icon="solar:arrow-left-outline" width={14} />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${
                      currentPage === page
                        ? "bg-[#0152EA] text-white"
                        : "text-gray-500 hover:bg-gray-100 dark:hover:bg-darkminisidebar"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-full text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-darkminisidebar disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Icon icon="solar:arrow-right-outline" width={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Role?</AlertDialogTitle>
            <AlertDialogDescription>
              Role ini akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RoleManagementPage;
