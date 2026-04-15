import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Icon } from "@iconify/react";
import { useGetProfile, useUpdateProfile, useChangePassword } from "@/app/api/profile/useProfileApi";
import { Button } from "@/shared/components/agrofy-ui/ui/button";
import { Input } from "@/shared/components/agrofy-ui/ui/input";
import { Label } from "@/shared/components/agrofy-ui/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/agrofy-ui/ui/select";
import { useToast } from "@/shared/hooks";
import type { UpdateProfileRequest, ChangePasswordRequest } from "@/app/api/profile/profileApi";

const ROLE_LABEL: Record<string, string> = {
  superadmin: 'Super Admin', admin: 'Admin', dokter: 'Dokter', user: 'Orang Tua', orang_tua: 'Orang Tua',
};

const ProfilePage = () => {
  const toast = useToast();
  const [tab, setTab] = useState<'profile' | 'password'>('profile');

  const { data: profileData, isLoading } = useGetProfile();
  const profile = profileData?.data?.data;

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<UpdateProfileRequest>();
  const gender = watch("gender");

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name,
        email: profile.email,
        phone_number: profile.phone_number ?? "",
        address: profile.address ?? "",
        date_of_birth: profile.date_of_birth ?? "",
        gender: profile.gender ?? "",
      });
    }
  }, [profile, reset]);

  const updateMutation = useUpdateProfile({
    onSuccess: () => toast.success("Profil berhasil diperbarui"),
    onError: () => toast.error("Gagal memperbarui profil"),
  });

  const { register: regPwd, handleSubmit: handlePwd, reset: resetPwd, formState: { errors: pwdErrors } } = useForm<ChangePasswordRequest>();

  const changePwdMutation = useChangePassword({
    onSuccess: () => { toast.success("Password berhasil diubah"); resetPwd(); },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "Gagal mengubah password"),
  });

  if (isLoading) {
    return <div className="p-6 flex justify-center"><Icon icon="solar:refresh-line-duotone" className="animate-spin text-gray-400" width={32} /></div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profil Saya</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Kelola informasi akun Anda</p>
      </div>

      {/* Avatar + info */}
      <div className="bg-white dark:bg-darkgray rounded-xl border border-gray-200 dark:border-darkborder p-6 flex items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-[#0152EA] flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
          {profile?.name?.[0]?.toUpperCase() ?? "?"}
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{profile?.name}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{profile?.email}</p>
          <span className="inline-block mt-1.5 text-xs px-2.5 py-0.5 rounded-full font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
            {ROLE_LABEL[profile?.role ?? ''] ?? profile?.role ?? 'User'}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-darkminisidebar rounded-lg p-1 w-fit">
        {(['profile', 'password'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === t ? 'bg-white dark:bg-darkgray text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}>
            {t === 'profile' ? 'Informasi Profil' : 'Ganti Password'}
          </button>
        ))}
      </div>

      {tab === 'profile' ? (
        <div className="bg-white dark:bg-darkgray rounded-xl border border-gray-200 dark:border-darkborder p-6">
          <form onSubmit={handleSubmit((data: UpdateProfileRequest) => updateMutation.mutate(data))} className="space-y-5">
            <div className="space-y-1.5">
              <Label>Nama Lengkap</Label>
              <Input {...register("name", { required: "Nama wajib diisi" })} />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input type="email" {...register("email")} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>No. Telepon</Label>
                <Input placeholder="08xxxxxxxxxx" {...register("phone_number")} />
              </div>
              <div className="space-y-1.5">
                <Label>Tanggal Lahir</Label>
                <Input type="date" {...register("date_of_birth")} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Jenis Kelamin</Label>
              <Select value={gender ?? ""} onValueChange={(v) => setValue("gender", v)}>
                <SelectTrigger><SelectValue placeholder="Pilih jenis kelamin..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="laki-laki">Laki-laki</SelectItem>
                  <SelectItem value="perempuan">Perempuan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Alamat</Label>
              <Input placeholder="Alamat lengkap..." {...register("address")} />
            </div>

            <Button type="submit" disabled={updateMutation.isPending} className="bg-[#0152EA] hover:bg-blue-700 text-white gap-2">
              {updateMutation.isPending && <Icon icon="solar:refresh-line-duotone" className="animate-spin" width={16} />}
              Simpan Perubahan
            </Button>
          </form>
        </div>
      ) : (
        <div className="bg-white dark:bg-darkgray rounded-xl border border-gray-200 dark:border-darkborder p-6">
          <form onSubmit={handlePwd((data: ChangePasswordRequest) => changePwdMutation.mutate(data))} className="space-y-5">
            <div className="space-y-1.5">
              <Label>Password Lama <span className="text-red-500">*</span></Label>
              <Input type="password" placeholder="Masukkan password lama" {...regPwd("current_password", { required: "Password lama wajib diisi" })} />
              {pwdErrors.current_password && <p className="text-xs text-red-500">{pwdErrors.current_password.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label>Password Baru <span className="text-red-500">*</span></Label>
              <Input type="password" placeholder="Minimal 8 karakter" {...regPwd("password", { required: "Password baru wajib diisi", minLength: { value: 8, message: "Minimal 8 karakter" } })} />
              {pwdErrors.password && <p className="text-xs text-red-500">{pwdErrors.password.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label>Konfirmasi Password Baru <span className="text-red-500">*</span></Label>
              <Input type="password" placeholder="Ulangi password baru" {...regPwd("password_confirmation", { required: "Konfirmasi password wajib diisi" })} />
              {pwdErrors.password_confirmation && <p className="text-xs text-red-500">{pwdErrors.password_confirmation.message}</p>}
            </div>

            <Button type="submit" disabled={changePwdMutation.isPending} className="bg-[#0152EA] hover:bg-blue-700 text-white gap-2">
              {changePwdMutation.isPending && <Icon icon="solar:refresh-line-duotone" className="animate-spin" width={16} />}
              Ubah Password
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
