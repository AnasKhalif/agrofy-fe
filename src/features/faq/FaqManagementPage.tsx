import { useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { useGetFaqs, useCreateFaq, useUpdateFaq, useDeleteFaq } from "@/app/api/faq/useFaqApi";
import type { FaqItem, CreateFaqRequest } from "@/app/api/faq/type";
import { useToast } from "@/shared/hooks";
import { Button } from "@/shared/components/agrofy-ui/ui/button";
import { Input } from "@/shared/components/agrofy-ui/ui/input";
import { Label } from "@/shared/components/agrofy-ui/ui/label";
import { Textarea } from "@/shared/components/agrofy-ui/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/agrofy-ui/ui/dialog";
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

const FaqFormDialog = ({
  open,
  onClose,
  faq,
  onSubmit,
  isPending = false,
}: {
  open: boolean;
  onClose: () => void;
  faq: FaqItem | null;
  onSubmit: (data: CreateFaqRequest) => void;
  isPending?: boolean;
}) => {
  const [form, setForm] = useState<CreateFaqRequest>({
    question: faq?.question ?? "",
    answer: faq?.answer ?? "",
    published: faq?.published ?? false,
  });

  const isEdit = !!faq;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit FAQ" : "Tambah FAQ"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Pertanyaan</Label>
            <Input
              value={form.question}
              onChange={(e) => setForm((p) => ({ ...p, question: e.target.value }))}
              placeholder="Masukkan pertanyaan..."
            />
          </div>
          <div className="space-y-1.5">
            <Label>Jawaban</Label>
            <Textarea
              value={form.answer}
              onChange={(e) => setForm((p) => ({ ...p, answer: e.target.value }))}
              placeholder="Masukkan jawaban..."
              className="min-h-[120px]"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <input
              type="checkbox"
              checked={!!form.published}
              onChange={(e) => setForm((p) => ({ ...p, published: e.target.checked }))}
            />
            Publish FAQ
          </label>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>Batal</Button>
          <Button
            className="bg-[#0152EA] hover:bg-blue-700 text-white"
            disabled={isPending || !form.question.trim() || !form.answer.trim()}
            onClick={() => onSubmit({
              question: form.question.trim(),
              answer: form.answer.trim(),
              published: !!form.published,
            })}
          >
            {isPending ? "Menyimpan..." : isEdit ? "Simpan" : "Tambah"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const FaqManagementPage = () => {
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading, refetch } = useGetFaqs({ search: search || undefined });
  const faqs = useMemo(() => data?.data?.data ?? [], [data]);

  const createMutation = useCreateFaq({
    onSuccess: () => {
      toast.success("FAQ berhasil ditambahkan");
      setIsFormOpen(false);
      setEditingFaq(null);
      refetch();
    },
    onError: () => toast.error("Gagal menambahkan FAQ"),
  });

  const updateMutation = useUpdateFaq({
    onSuccess: () => {
      toast.success("FAQ berhasil diperbarui");
      setIsFormOpen(false);
      setEditingFaq(null);
      refetch();
    },
    onError: () => toast.error("Gagal memperbarui FAQ"),
  });

  const deleteMutation = useDeleteFaq({
    onSuccess: () => {
      toast.success("FAQ berhasil dihapus");
      setDeleteId(null);
      refetch();
    },
    onError: () => toast.error("Gagal menghapus FAQ"),
  });

  const handleSubmit = (payload: CreateFaqRequest) => {
    if (editingFaq) {
      updateMutation.mutate({ id: editingFaq.id, data: payload });
      return;
    }
    createMutation.mutate(payload);
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manajemen FAQ</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Kelola daftar pertanyaan yang tampil untuk pengguna</p>
        </div>
        <Button
          onClick={() => {
            setEditingFaq(null);
            setIsFormOpen(true);
          }}
          className="bg-[#0152EA] hover:bg-blue-700 text-white gap-2"
        >
          <Icon icon="solar:add-circle-outline" width={18} />
          Tambah FAQ
        </Button>
      </div>

      <div className="bg-white dark:bg-darkgray rounded-xl border border-gray-200 dark:border-darkborder p-4">
        <div className="relative w-full max-w-sm">
          <Icon icon="solar:magnifer-outline" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width={16} />
          <Input
            placeholder="Cari FAQ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-darkgray rounded-xl border border-gray-200 dark:border-darkborder p-5 animate-pulse h-36" />
          ))}
        </div>
      ) : faqs.length === 0 ? (
        <div className="bg-white dark:bg-darkgray rounded-xl border border-gray-200 dark:border-darkborder py-20 text-center">
          <Icon icon="solar:question-circle-outline" width={56} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">Belum ada FAQ</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((faq) => (
            <div key={faq.id} className="bg-white dark:bg-darkgray rounded-xl border border-gray-200 dark:border-darkborder p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Icon icon="solar:question-circle-outline" className="text-[#0152EA]" width={18} />
                  <p className="font-semibold text-gray-900 dark:text-white line-clamp-2">{faq.question}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Icon icon="solar:menu-dots-bold" width={15} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setEditingFaq(faq);
                        setIsFormOpen(true);
                      }}
                    >
                      <Icon icon="solar:pen-outline" className="mr-2" width={14} /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600"
                      onClick={() => setDeleteId(faq.id)}
                    >
                      <Icon icon="solar:trash-bin-trash-outline" className="mr-2" width={14} /> Hapus
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 line-clamp-4">{faq.answer}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${faq.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                  {faq.published ? "Published" : "Draft"}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(faq.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <FaqFormDialog
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingFaq(null);
        }}
        faq={editingFaq}
        onSubmit={handleSubmit}
        isPending={isPending}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus FAQ?</AlertDialogTitle>
            <AlertDialogDescription>FAQ yang dihapus tidak bisa dikembalikan.</AlertDialogDescription>
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

export default FaqManagementPage;
