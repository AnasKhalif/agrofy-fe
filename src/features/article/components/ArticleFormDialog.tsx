import { useEffect, useState } from "react";
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
import { Textarea } from "@/shared/components/agrofy-ui/ui/textarea";
import { Switch } from "@/shared/components/agrofy-ui/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/agrofy-ui/ui/select";
import { useCreateArticle, useUpdateArticle, useUploadArticleImage } from "@/app/api/article/useArticleApi";
import { useToast } from "@/shared/hooks";
import type { Article, CreateArticleRequest } from "@/app/api/article/type";

interface Props {
  open: boolean;
  onClose: () => void;
  article?: Article | null;
}

const CATEGORIES = ["Nutrisi", "Pencegahan", "Penanganan", "Tumbuh Kembang", "Tips Parenting"];

const ArticleFormDialog = ({ open, onClose, article }: Props) => {
  const toast = useToast();
  const isEdit = !!article;
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<CreateArticleRequest>({
    defaultValues: { title: "", body: "", category: "", excerpt: "", published: false },
  });

  const published = watch("published");
  const category = watch("category");

  useEffect(() => {
    if (article) {
      reset({
        title: article.title,
        body: article.body,
        category: article.category ?? "",
        excerpt: article.excerpt ?? "",
        published: article.published,
      });
    } else {
      reset({ title: "", body: "", category: "", excerpt: "", published: false });
    }
    setSelectedImageFile(null);
  }, [article, reset]);

  const createMutation = useCreateArticle({
    onSuccess: () => { toast.success("Artikel berhasil dibuat"); onClose(); },
    onError: () => toast.error("Gagal membuat artikel"),
  });

  const updateMutation = useUpdateArticle({
    onError: () => toast.error("Gagal memperbarui artikel"),
  });

  const uploadImageMutation = useUploadArticleImage({
    onError: () => toast.error("Gagal upload gambar artikel"),
  });

  const onSubmit = async (data: CreateArticleRequest) => {
    try {
      let articleId = article?.id;

      if (isEdit && article) {
        await updateMutation.mutateAsync({ id: article.id, data });
      } else {
        const response = await createMutation.mutateAsync(data);
        articleId = response.data?.data?.id;
      }

      if (selectedImageFile && articleId) {
        await uploadImageMutation.mutateAsync({ id: articleId, file: selectedImageFile });
      }

      toast.success(isEdit ? "Artikel berhasil diperbarui" : "Artikel berhasil dibuat");
      onClose();
    } catch {
      // Toast error handled at mutation level
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending || uploadImageMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon icon="solar:document-text-outline" width={20} className="text-[#0152EA]" />
            {isEdit ? "Edit Artikel" : "Tambah Artikel Baru"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          {/* Judul */}
          <div className="space-y-1.5">
            <Label htmlFor="title">Judul Artikel <span className="text-red-500">*</span></Label>
            <Input
              id="title"
              placeholder="Masukkan judul artikel..."
              {...register("title", { required: "Judul wajib diisi" })}
            />
            {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
          </div>

          {/* Kategori */}
          <div className="space-y-1.5">
            <Label>Kategori</Label>
            <Select value={category ?? ""} onValueChange={(v) => setValue("category", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori..." />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Excerpt */}
          <div className="space-y-1.5">
            <Label htmlFor="excerpt">Ringkasan</Label>
            <Input
              id="excerpt"
              placeholder="Ringkasan singkat artikel..."
              {...register("excerpt")}
            />
          </div>

          {/* Image */}
          <div className="space-y-1.5">
            <Label htmlFor="image_file">Upload Gambar</Label>
            <Input
              id="image_file"
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedImageFile(e.target.files?.[0] ?? null)}
            />
            {article?.image && !selectedImageFile && (
              <p className="text-xs text-gray-500">Gambar saat ini sudah tersedia. Pilih file baru jika ingin mengganti.</p>
            )}
            {selectedImageFile && (
              <p className="text-xs text-gray-500">File dipilih: {selectedImageFile.name}</p>
            )}
          </div>

          {/* Konten */}
          <div className="space-y-1.5">
            <Label htmlFor="body">Konten <span className="text-red-500">*</span></Label>
            <Textarea
              id="body"
              placeholder="Tulis isi artikel di sini..."
              className="min-h-[200px] resize-y"
              {...register("body", { required: "Konten wajib diisi" })}
            />
            {errors.body && <p className="text-xs text-red-500">{errors.body.message}</p>}
          </div>

          {/* Published toggle */}
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-darkminisidebar rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Publish Artikel</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Artikel akan tampil di halaman publik</p>
            </div>
            <Switch
              checked={published}
              onCheckedChange={(v) => setValue("published", v)}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Batal
            </Button>
            <Button type="submit" className="bg-[#0152EA] hover:bg-blue-700 text-white" disabled={isPending}>
              {isPending && <Icon icon="solar:refresh-line-duotone" className="mr-2 animate-spin" width={16} />}
              {isEdit ? "Simpan Perubahan" : "Buat Artikel"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ArticleFormDialog;
