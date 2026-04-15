import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useGetChildren, useDeleteChild } from "@/app/api/child/useChildApi";
import { Button } from "@/shared/components/agrofy-ui/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/shared/components/agrofy-ui/ui/alert-dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/shared/components/agrofy-ui/ui/dropdown-menu";
import { useToast } from "@/shared/hooks";
import type { ChildItem } from "@/app/api/child/type";

const genderIcon = { 'laki-laki': 'solar:mars-outline', 'perempuan': 'solar:venus-outline' };
const genderColor = { 'laki-laki': 'text-blue-600 bg-blue-50', 'perempuan': 'text-pink-600 bg-pink-50' };
const genderAvatar = { 'laki-laki': 'bg-blue-100 text-blue-600', 'perempuan': 'bg-pink-100 text-pink-600' };

const ChildrenPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [deleteUuid, setDeleteUuid] = useState<string | null>(null);

  const { data, isLoading, refetch } = useGetChildren();
  const children: ChildItem[] = data?.data?.data ?? [];

  const deleteMutation = useDeleteChild({
    onSuccess: () => { toast.success("Data anak berhasil dihapus"); setDeleteUuid(null); refetch(); },
    onError: () => toast.error("Gagal menghapus data anak"),
  });

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Data Anak</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Kelola data anak yang terdaftar</p>
        </div>
        <Button onClick={() => navigate("/children/create")} className="bg-[#0152EA] hover:bg-blue-700 text-white gap-2 h-9 text-sm">
          <Icon icon="solar:user-plus-rounded-outline" width={16} />
          Tambah Anak
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-darkgray rounded-xl border border-gray-200 dark:border-darkborder p-5 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-darkminisidebar" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-100 dark:bg-darkminisidebar rounded w-2/3" />
                  <div className="h-3 bg-gray-100 dark:bg-darkminisidebar rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : children.length === 0 ? (
        <div className="bg-white dark:bg-darkgray rounded-xl border border-gray-200 dark:border-darkborder py-20 text-center">
          <Icon icon="solar:user-rounded-outline" width={56} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">Belum ada data anak</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1 mb-4">Tambahkan data anak untuk mulai memantau pertumbuhan</p>
          <Button onClick={() => navigate("/children/create")} className="bg-[#0152EA] hover:bg-blue-700 text-white gap-2">
            <Icon icon="solar:user-plus-rounded-outline" width={16} />
            Tambah Anak Pertama
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {children.map((child) => (
            <div key={child.id} className="bg-white dark:bg-darkgray rounded-xl border border-gray-200 dark:border-darkborder p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold ${genderAvatar[child.gender]}`}>
                    {child.name[0]?.toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{child.name}</h3>
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium mt-1 ${genderColor[child.gender]}`}>
                      <Icon icon={genderIcon[child.gender]} width={11} />
                      {child.gender === 'laki-laki' ? 'Laki-laki' : 'Perempuan'}
                    </span>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-gray-400 hover:text-gray-700">
                      <Icon icon="solar:menu-dots-bold" width={15} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={() => navigate(`/children/${child.uuid}/edit`)}>
                      <Icon icon="solar:pen-outline" className="mr-2" width={14} /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate(`/stunting-detection?child_id=${child.id}`)}>
                      <Icon icon="solar:medical-kit-outline" className="mr-2" width={14} /> Deteksi Stunting
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => setDeleteUuid(child.uuid)}>
                      <Icon icon="solar:trash-bin-trash-outline" className="mr-2" width={14} /> Hapus
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="bg-gray-50 dark:bg-darkminisidebar rounded-lg p-3">
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Usia</p>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">
                    {child.age_in_months >= 12
                      ? `${Math.floor(child.age_in_months / 12)} thn ${child.age_in_months % 12} bln`
                      : `${child.age_in_months} bulan`}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-darkminisidebar rounded-lg p-3">
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Tgl Lahir</p>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">
                    {new Date(child.date_of_birth).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                {child.birth_weight && (
                  <div className="bg-gray-50 dark:bg-darkminisidebar rounded-lg p-3">
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">BB Lahir</p>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{child.birth_weight} kg</p>
                  </div>
                )}
                {child.birth_height && (
                  <div className="bg-gray-50 dark:bg-darkminisidebar rounded-lg p-3">
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">TB Lahir</p>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{child.birth_height} cm</p>
                  </div>
                )}
              </div>

              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => navigate(`/monitoring?child_id=${child.id}`)}>
                  <Icon icon="solar:chart-outline" className="mr-1" width={13} /> Monitoring
                </Button>
                <Button size="sm" className="flex-1 text-xs bg-[#0152EA] hover:bg-blue-700 text-white" onClick={() => navigate(`/stunting-detection?child_id=${child.id}`)}>
                  <Icon icon="solar:medical-kit-outline" className="mr-1" width={13} /> Deteksi
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteUuid} onOpenChange={() => setDeleteUuid(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Data Anak?</AlertDialogTitle>
            <AlertDialogDescription>Data anak ini akan dihapus permanen beserta semua riwayat deteksinya.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => deleteUuid && deleteMutation.mutate(deleteUuid)}>
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ChildrenPage;
