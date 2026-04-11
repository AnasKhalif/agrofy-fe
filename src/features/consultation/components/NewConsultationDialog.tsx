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
import { useCreateConsultation } from "@/app/api/consultation/useConsultationApi";
import { useGetUsers } from "@/app/api/user/useUserApi";
import { useToast } from "@/shared/hooks";
import type { CreateConsultationRequest } from "@/app/api/consultation/type";

interface Props {
  open: boolean;
  onClose: () => void;
}

const NewConsultationDialog = ({ open, onClose }: Props) => {
  const toast = useToast();
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<CreateConsultationRequest>();

  const healthWorkerId = watch("health_worker_id");

  const { data: usersData } = useGetUsers({ role: "dokter" });
  const doctors = usersData?.data?.data ?? [];

  const createMutation = useCreateConsultation({
    onSuccess: () => {
      toast.success("Konsultasi berhasil dimulai");
      reset();
      onClose();
    },
    onError: () => toast.error("Gagal membuat konsultasi"),
  });

  const onSubmit = (data: CreateConsultationRequest) => {
    createMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon icon="solar:chat-round-dots-outline" width={20} className="text-[#0152EA]" />
            Konsultasi Baru
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label>Pilih Tenaga Kesehatan <span className="text-red-500">*</span></Label>
            <Select
              value={healthWorkerId?.toString() ?? ""}
              onValueChange={(v) => setValue("health_worker_id", parseInt(v))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih dokter / ahli gizi..." />
              </SelectTrigger>
              <SelectContent>
                {doctors.length === 0 ? (
                  <SelectItem value="none" disabled>Tidak ada tenaga kesehatan tersedia</SelectItem>
                ) : (
                  doctors.map((d) => (
                    <SelectItem key={d.id} value={d.id.toString()}>
                      {d.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="subject">Topik / Keluhan</Label>
            <Input
              id="subject"
              placeholder="Contoh: Anak saya berusia 2 tahun..."
              {...register("subject")}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button
              type="submit"
              className="bg-[#0152EA] hover:bg-blue-700 text-white"
              disabled={createMutation.isPending || !healthWorkerId}
            >
              {createMutation.isPending && (
                <Icon icon="solar:refresh-line-duotone" className="mr-2 animate-spin" width={16} />
              )}
              Mulai Konsultasi
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewConsultationDialog;
