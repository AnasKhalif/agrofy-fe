import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useForm, useWatch } from "react-hook-form";
import { Icon } from "@iconify/react";
import { useGetChild, useCreateChild, useUpdateChild } from "@/app/api/child/useChildApi";
import { Button } from "@/shared/components/agrofy-ui/ui/button";
import { Input } from "@/shared/components/agrofy-ui/ui/input";
import { Label } from "@/shared/components/agrofy-ui/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/agrofy-ui/ui/select";
import { useToast } from "@/shared/hooks";
import type { CreateChildRequest } from "@/app/api/child/type";

const ChildFormPage = () => {
  const { id: uuid } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const isEdit = !!uuid;

  const { data: childData, isLoading } = useGetChild(uuid ?? "", { enabled: isEdit });
  const child = childData?.data?.data;

  const { register, handleSubmit, setValue, control, reset, formState: { errors } } = useForm<CreateChildRequest>();
  const gender = useWatch({ control, name: "gender" });
  const asiEksklusif = useWatch({ control, name: "asi_eksklusif" });

  useEffect(() => {
    if (child && isEdit) {
      reset({
        name: child.name,
        gender: child.gender,
        date_of_birth: child.date_of_birth,
        birth_weight: child.birth_weight ?? undefined,
        birth_height: child.birth_height ?? undefined,
        asi_eksklusif: child.asi_eksklusif ?? false,
      });
    }
  }, [child, isEdit, reset]);

  const createMutation = useCreateChild({
    onSuccess: () => { toast.success("Data anak berhasil ditambahkan"); navigate("/children"); },
    onError: () => toast.error("Gagal menambahkan data anak"),
  });

  const updateMutation = useUpdateChild({
    onSuccess: () => { toast.success("Data anak berhasil diperbarui"); navigate("/children"); },
    onError: () => toast.error("Gagal memperbarui data anak"),
  });

  const onSubmit = (data: CreateChildRequest) => {
    if (isEdit) updateMutation.mutate({ uuid: uuid!, data });
    else createMutation.mutate(data);
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  if (isEdit && isLoading) {
    return <div className="p-6 flex justify-center"><Icon icon="solar:refresh-line-duotone" className="animate-spin text-gray-400" width={32} /></div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate("/children")} className="h-8 w-8 p-0">
          <Icon icon="solar:alt-arrow-left-outline" width={18} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEdit ? "Edit Data Anak" : "Tambah Anak Baru"}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isEdit ? "Perbarui informasi data anak" : "Daftarkan data anak baru"}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-darkgray rounded-xl border border-gray-200 dark:border-darkborder p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1.5">
            <Label>Nama Lengkap <span className="text-red-500">*</span></Label>
            <Input placeholder="Nama anak..." {...register("name", { required: "Nama wajib diisi" })} />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Jenis Kelamin <span className="text-red-500">*</span></Label>
            <Select value={gender ?? ""} onValueChange={(v) => setValue("gender", v as 'laki-laki' | 'perempuan')}>
              <SelectTrigger><SelectValue placeholder="Pilih jenis kelamin..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="laki-laki">Laki-laki</SelectItem>
                <SelectItem value="perempuan">Perempuan</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && <p className="text-xs text-red-500">Jenis kelamin wajib dipilih</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Tanggal Lahir <span className="text-red-500">*</span></Label>
            <Input type="date" {...register("date_of_birth", { required: "Tanggal lahir wajib diisi" })} />
            {errors.date_of_birth && <p className="text-xs text-red-500">{errors.date_of_birth.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Berat Badan Lahir (kg)</Label>
              <Input type="number" step="0.1" placeholder="Contoh: 3.2" {...register("birth_weight", { valueAsNumber: true })} />
            </div>
            <div className="space-y-1.5">
              <Label>Tinggi Badan Lahir (cm)</Label>
              <Input type="number" step="0.1" placeholder="Contoh: 50" {...register("birth_height", { valueAsNumber: true })} />
            </div>
          </div>

          <label className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-darkborder cursor-pointer hover:bg-gray-50 dark:hover:bg-darkminisidebar">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-gray-300 text-[#0152EA] focus:ring-[#0152EA]"
              checked={!!asiEksklusif}
              onChange={(e) => setValue("asi_eksklusif", e.target.checked)}
            />
            <div className="text-sm">
              <p className="font-medium text-gray-900 dark:text-white">ASI Eksklusif</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Anak mendapat ASI Eksklusif (tanpa makanan/minuman lain) selama 0–6 bulan, sesuai standar Buku KIA & WHO.</p>
            </div>
          </label>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => navigate("/children")} className="flex-1">Batal</Button>
            <Button type="submit" disabled={isPending} className="flex-1 bg-[#0152EA] hover:bg-blue-700 text-white">
              {isPending && <Icon icon="solar:refresh-line-duotone" className="mr-2 animate-spin" width={16} />}
              {isEdit ? "Simpan Perubahan" : "Tambah Anak"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChildFormPage;
