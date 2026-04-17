import { useState } from "react";
import { Icon } from "@iconify/react";
import { useGetArticles, useDeleteArticle } from "@/app/api/article/useArticleApi";
import { Button } from "@/shared/components/agrofy-ui/ui/button";
import { Input } from "@/shared/components/agrofy-ui/ui/input";
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
import ArticleFormDialog from "./components/ArticleFormDialog";
import type { Article } from "@/app/api/article/type";

const STATUS_COLORS: Record<string, string> = {
  published: "bg-green-100 text-green-700",
  draft: "bg-gray-100 text-gray-600",
};

const ArticlesPage = () => {
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [page] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editArticle, setEditArticle] = useState<Article | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading, refetch } = useGetArticles({ page, search: search || undefined });
  const articles = data?.data?.data ?? [];

  const deleteMutation = useDeleteArticle({
    onSuccess: () => {
      toast.success("Artikel berhasil dihapus");
      setDeleteId(null);
      refetch();
    },
    onError: () => toast.error("Gagal menghapus artikel"),
  });

  const handleEdit = (article: Article) => {
    setEditArticle(article);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditArticle(null);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditArticle(null);
    refetch();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manajemen Artikel</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Kelola artikel edukasi stunting untuk publik
          </p>
        </div>
        <Button onClick={handleCreate} className="bg-[#0152EA] hover:bg-blue-700 text-white gap-2">
          <Icon icon="solar:add-circle-outline" width={18} />
          Tambah Artikel
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-darkgray rounded-xl border border-gray-200 dark:border-darkborder p-4">
        <div className="relative w-full max-w-sm">
          <Icon icon="solar:magnifer-outline" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width={16} />
          <Input
            placeholder="Cari artikel..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-darkgray rounded-xl border border-gray-200 dark:border-darkborder p-4 animate-pulse">
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-lg bg-gray-100 dark:bg-darkminisidebar" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-100 dark:bg-darkminisidebar rounded w-2/5" />
                  <div className="h-3 bg-gray-100 dark:bg-darkminisidebar rounded w-full" />
                  <div className="h-3 bg-gray-100 dark:bg-darkminisidebar rounded w-4/5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="bg-white dark:bg-darkgray rounded-xl border border-gray-200 dark:border-darkborder py-20 text-center">
          <Icon icon="solar:document-outline" width={56} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">Belum ada artikel</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1 mb-4">Mulai dengan menambahkan artikel pertama</p>
          <Button onClick={handleCreate} className="bg-[#0152EA] hover:bg-blue-700 text-white gap-2">
            <Icon icon="solar:add-circle-outline" width={16} />
            Tambah Artikel Pertama
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map((article) => (
            <div key={article.id} className="bg-white dark:bg-darkgray rounded-xl border border-gray-200 dark:border-darkborder p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-lg bg-gray-50 dark:bg-darkminisidebar p-1.5 flex-shrink-0 flex items-center justify-center">
                  {article.image ? (
                    <img src={article.image} alt={article.title} className="h-full w-full object-contain rounded" />
                  ) : (
                    <Icon icon="solar:document-text-outline" className="text-[#0152EA]" width={22} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2">{article.title}</h3>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {article.category ? (
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium border border-gray-200 dark:border-darkborder text-gray-600 dark:text-gray-300">
                          {article.category}
                        </span>
                      ) : null}
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${article.published ? STATUS_COLORS.published : STATUS_COLORS.draft}`}>
                        {article.published ? "Published" : "Draft"}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed line-clamp-2">
                    {article.excerpt || "Tidak ada ringkasan."}
                  </p>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      {new Date(article.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleEdit(article)}
                        className="w-8 h-8 rounded-lg border border-gray-200 dark:border-darkborder flex items-center justify-center text-gray-500 hover:text-[#0152EA] hover:border-[#0152EA]"
                      >
                        <Icon icon="solar:pen-outline" width={14} />
                      </button>
                      <button
                        onClick={() => setDeleteId(article.id)}
                        className="w-8 h-8 rounded-lg border border-gray-200 dark:border-darkborder flex items-center justify-center text-gray-500 hover:text-red-600 hover:border-red-400"
                      >
                        <Icon icon="solar:trash-bin-trash-outline" width={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Dialog */}
      <ArticleFormDialog
        open={isFormOpen}
        onClose={handleFormClose}
        article={editArticle}
      />

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Artikel?</AlertDialogTitle>
            <AlertDialogDescription>
              Artikel ini akan dihapus permanen dan tidak dapat dikembalikan.
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

export default ArticlesPage;
