import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Icon } from "@iconify/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/agrofy-ui/ui/dialog";
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
import { useCreateUser, useUpdateUser } from "@/app/api/user/useUserApi";
import { useToast } from "@/shared/hooks";
import type { UserItem, CreateUserRequest } from "@/app/api/user/type";

interface Props {
  open: boolean;
  onClose: () => void;
  user?: UserItem | null;
}

const ROLES = [
  { value: "admin", label: "Admin" },
  { value: "dokter", label: "Dokter" },
  { value: "orang_tua", label: "Orang Tua" },
];

const UserFormDialog = ({ open, onClose, user }: Props) => {
  const toast = useToast();
  const isEdit = !!user;

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<CreateUserRequest>();
  const role = watch("role");

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
    } else {
      reset({ name: "", email: "", password: "", phone_number: "", address: "", role: "" });
    }
  }, [user, reset]);

  const createMutation = useCreateUser({
    onSuccess: () => { toast.success("Pengguna berhasil ditambahkan"); onClose(); },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "Gagal menambahkan pengguna"),
  });

  const updateMutation = useUpdateUser({
    onSuccess: () => { toast.success("Pengguna berhasil diperbarui"); onClose(); },
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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon icon="solar:user-plus-rounded-outline" width={20} className="text-[#0152EA]" />
            {isEdit ? "Edit Pengguna" : "Tambah Pengguna Baru"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label>Nama Lengkap <span className="text-red-500">*</span></Label>
            <Input placeholder="Nama lengkap..." {...register("name", { required: "Nama wajib diisi" })} />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Email <span className="text-red-500">*</span></Label>
            <Input type="email" placeholder="email@example.com" {...register("email", { required: "Email wajib diisi" })} />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Password {!isEdit && <span className="text-red-500">*</span>}</Label>
            <Input
              type="password"
              placeholder={isEdit ? "Kosongkan jika tidak diubah" : "Minimal 8 karakter"}
              {...register("password", { required: !isEdit ? "Password wajib diisi" : false, minLength: { value: 8, message: "Minimal 8 karakter" } })}
            />
            {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Role <span className="text-red-500">*</span></Label>
            <Select value={role ?? ""} onValueChange={(v) => setValue("role", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih role..." />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((r) => (
                  <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>No. Telepon</Label>
            <Input placeholder="08xxxxxxxxxx" {...register("phone_number")} />
          </div>

          <div className="space-y-1.5">
            <Label>Alamat</Label>
            <Input placeholder="Alamat..." {...register("address")} />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Batal
            </Button>
            <Button type="submit" className="bg-[#0152EA] hover:bg-blue-700 text-white" disabled={isPending}>
              {isPending && <Icon icon="solar:refresh-line-duotone" className="mr-2 animate-spin" width={16} />}
              {isEdit ? "Simpan" : "Tambah Pengguna"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserFormDialog;
