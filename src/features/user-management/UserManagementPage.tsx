import { useState } from "react";
import { useNavigate } from "react-router";
import { Icon } from "@iconify/react";
import { useGetUsers, useDeleteUser } from "@/app/api/user/useUserApi";
import { Button } from "@/shared/components/agrofy-ui/ui/button";
import { Input } from "@/shared/components/agrofy-ui/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/agrofy-ui/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/agrofy-ui/ui/select";
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
import type { UserItem } from "@/app/api/user/type";

const getRoleName = (role: UserItem["role"]): string => {
  if (!role) return "-";
  if (typeof role === "string") return role;
  return role.display_name || role.name;
};

const getRoleKey = (role: UserItem["role"]): string => {
  if (!role) return "";
  if (typeof role === "string") return role;
  return role.name;
};

const ROLE_COLORS: Record<string, string> = {
  superadmin: "text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400",
  admin: "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400",
  dokter: "text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400",
};

const HIDDEN_ROLES = ["user", "orang_tua"];

const ITEMS_PER_PAGE = 10;

const UserManagementPage = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, refetch } = useGetUsers({
    search: search || undefined,
    role: roleFilter !== "all" ? roleFilter : undefined,
  });
  const allUsers = data?.data?.data ?? [];
  const users = allUsers.filter((u) => !HIDDEN_ROLES.includes(getRoleKey(u.role)));

  const totalItems = users.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const pagedUsers = users.slice(startIndex, endIndex);

  const deleteMutation = useDeleteUser({
    onSuccess: () => {
      toast.success("Pengguna berhasil dihapus");
      setDeleteId(null);
      refetch();
    },
    onError: () => toast.error("Gagal menghapus pengguna"),
  });

  const handleSearch = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const handleRoleFilter = (val: string) => {
    setRoleFilter(val);
    setCurrentPage(1);
  };

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Daftar Pengguna</h1>
      </div>

      {/* Toolbar — outside table card */}
      <div className="flex items-center justify-between gap-3">
        {/* Left: Export */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-9 text-sm gap-2 text-gray-600 dark:text-gray-300">
              <Icon icon="solar:file-download-outline" width={16} />
              Export File
              <Icon icon="solar:alt-arrow-down-outline" width={14} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-36">
            <DropdownMenuItem>Export CSV</DropdownMenuItem>
            <DropdownMenuItem>Export Excel</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Right: Search + Role Filter + Tambah */}
        <div className="flex items-center gap-3">
          <div className="relative w-56">
            <Icon icon="solar:magnifer-outline" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width={15} />
            <Input
              placeholder="Cari pengguna..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
          </div>
          <Select value={roleFilter} onValueChange={handleRoleFilter}>
            <SelectTrigger className="w-[140px] h-9 text-sm">
              <SelectValue placeholder="Semua Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Role</SelectItem>
              <SelectItem value="superadmin">Super Admin</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="dokter">Dokter</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => navigate("/users/create")} className="bg-[#0152EA] hover:bg-blue-700 text-white gap-2 h-9 text-sm">
            <Icon icon="solar:user-plus-rounded-outline" width={16} />
            Tambah Pengguna
          </Button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white dark:bg-darkgray rounded-[12px] border border-gray-200 dark:border-darkborder overflow-hidden">

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-fixed">
            <thead className="bg-gray-50 dark:bg-darkminisidebar border-b border-gray-200 dark:border-darkborder">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[260px]">Nama</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[260px]">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[150px]">No. Telepon</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[140px]">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[60px]"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-darkborder bg-white dark:bg-darkgray">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 bg-gray-100 dark:bg-darkminisidebar rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : pagedUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-gray-400">
                    <Icon icon="solar:users-group-rounded-outline" width={40} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Tidak ada pengguna ditemukan</p>
                  </td>
                </tr>
              ) : (
                pagedUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-darkminisidebar">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#0152EA] flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                          {u.name[0]?.toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white text-sm">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {u.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {u.phone_number || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ROLE_COLORS[getRoleKey(u.role)] ?? "text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400"}`}>
                        {getRoleName(u.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-gray-400 hover:text-gray-700">
                            <Icon icon="solar:menu-dots-bold" width={15} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-36">
                          <DropdownMenuItem onClick={() => navigate(`/users/edit/${u.id}`)}>
                            <Icon icon="solar:pen-outline" className="mr-2" width={14} />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={() => setDeleteId(u.id)}
                          >
                            <Icon icon="solar:trash-bin-trash-outline" className="mr-2" width={14} />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
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

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Pengguna?</AlertDialogTitle>
            <AlertDialogDescription>
              Pengguna ini akan dihapus permanen beserta semua datanya.
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

export default UserManagementPage;
