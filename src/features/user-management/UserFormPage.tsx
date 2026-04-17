import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useForm, useWatch } from "react-hook-form";
import { AxiosError } from "axios";
import { Icon } from "@iconify/react";
import { Button } from "@/shared/components/agrofy-ui/ui/button";
import { Input } from "@/shared/components/agrofy-ui/ui/input";
import { Label } from "@/shared/components/agrofy-ui/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/agrofy-ui/ui/select";
import { useCreateUser, useUpdateUser, useGetUser } from "@/app/api/user/useUserApi";
import { useToast } from "@/shared/hooks";
import type { CreateUserRequest } from "@/app/api/user/type";

const ROLES = [
  { value: "superadmin", label: "Super Admin" },
  { value: "admin", label: "Admin" },
  { value: "dokter", label: "Dokter" },
  { value: "orang_tua", label: "Orang Tua" },
];

const UserFormPage = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const isEdit = !!id;

  const { data: userData, isLoading } = useGetUser(parseInt(id ?? "0"), {
    enabled: isEdit,
  });
  const user = userData?.data?.data;

  const { register, handleSubmit, reset, setValue, control, formState: { errors } } = useForm<CreateUserRequest>();
  const role = useWatch({ control, name: "role" });

  useEffect(() => {
    if (user) {
      const roleName = typeof user.role === "string" ? user.role : user.role?.name ?? "";
      reset({
        name: user.name,
        email: user.email,
        phone_number: user.phone_number ?? "",
        address: user.address ?? "",
        role: roleName,
      });
    }
  }, [user, reset]);

  const createMutation = useCreateUser({
    onSuccess: () => { toast.success("Pengguna berhasil ditambahkan"); navigate("/users"); },
    onError: (err: unknown) => {
      const message = err instanceof AxiosError
        ? (err.response?.data as { message?: string } | undefined)?.message
        : undefined;
      toast.error(message ?? "Gagal menambahkan pengguna");
    },
  });

  const updateMutation = useUpdateUser({
    onSuccess: () => { toast.success("Pengguna berhasil diperbarui"); navigate("/users"); },
    onError: () => toast.error("Gagal memperbarui pengguna"),
  });

  const onSubmit = (data: CreateUserRequest) => {
    if (isEdit && user) {
      const { password, ...rest } = data;
      updateMutation.mutate({ id: user.id, data: password ? data : rest });
    } else {
      createMutation.mutate(data);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/users")}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-darkminisidebar text-gray-500"
        >
          <Icon icon="solar:arrow-left-outline" width={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEdit ? "Edit Pengguna" : "Tambah Pengguna Baru"}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {isEdit ? "Perbarui data pengguna" : "Tambahkan pengguna baru ke dalam sistem"}
          </p>
        </div>
      </div>

      {isLoading && isEdit ? (
        <div className="flex items-center justify-center py-24 text-gray-400">
          <Icon icon="solar:refresh-line-duotone" className="animate-spin mr-2" width={20} />
          Memuat data...
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Card */}
          <div className="bg-white dark:bg-darkgray rounded-[12px] border border-gray-200 dark:border-darkborder p-6 space-y-5">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Informasi Pengguna</h2>

            {/* Nama */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Nama Lengkap <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Nama lengkap..."
                className="h-10"
                {...register("name", { required: "Nama wajib diisi" })}
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                type="email"
                placeholder="email@example.com"
                className="h-10"
                {...register("email", { required: "Email wajib diisi" })}
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Password {!isEdit && <span className="text-red-500">*</span>}
              </Label>
              <Input
                type="password"
                placeholder={isEdit ? "Kosongkan jika tidak diubah" : "Minimal 8 karakter"}
                className="h-10"
                {...register("password", {
                  required: !isEdit ? "Password wajib diisi" : false,
                  minLength: { value: 8, message: "Minimal 8 karakter" },
                })}
              />
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>

            {/* Role */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Role <span className="text-red-500">*</span>
              </Label>
              <Select value={role ?? ""} onValueChange={(v) => setValue("role", v)}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Pilih role..." />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* No. Telepon */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">No. Telepon</Label>
              <Input
                placeholder="08xxxxxxxxxx"
                className="h-10"
                {...register("phone_number")}
              />
            </div>

            {/* Alamat */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Alamat</Label>
              <textarea
                placeholder="Alamat lengkap..."
                rows={3}
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-darkborder rounded-lg bg-white dark:bg-darkgray text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0152EA] resize-none"
                {...register("address")}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/users")}
              disabled={isPending}
              className="h-10 px-6"
            >
              Batalkan
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-[#0152EA] hover:bg-blue-700 text-white h-10 px-6 gap-2"
            >
              {isPending && <Icon icon="solar:refresh-line-duotone" className="animate-spin" width={14} />}
              {isEdit ? "Simpan Perubahan" : "Tambah Pengguna"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UserFormPage;
