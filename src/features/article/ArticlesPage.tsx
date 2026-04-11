import { useState } from "react";
import { Icon } from "@iconify/react";
import { useGetArticles, useDeleteArticle } from "@/app/api/article/useArticleApi";
import { Button } from "@/shared/components/agrofy-ui/ui/button";
import { Input } from "@/shared/components/agrofy-ui/ui/input";
import { Badge } from "@/shared/components/agrofy-ui/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/agrofy-ui/ui/table";
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
import { useToast } from "@/shared/hooks";
import ArticleFormDialog from "./components/ArticleFormDialog";
import type { Article } from "@/app/api/article/type";

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

      {/* Table */}
      <div className="bg-white dark:bg-darkgray rounded-xl border border-gray-200 dark:border-darkborder overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-darkminisidebar">
              <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Judul</TableHead>
              <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Kategori</TableHead>
              <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Status</TableHead>
              <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Tanggal</TableHead>
              <TableHead className="font-semibold text-gray-700 dark:text-gray-300 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-4 bg-gray-100 dark:bg-darkminisidebar rounded animate-pulse" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : articles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-gray-400">
                  <Icon icon="solar:document-outline" width={40} className="mx-auto mb-2 opacity-40" />
                  <p>Belum ada artikel</p>
                </TableCell>
              </TableRow>
            ) : (
              articles.map((article) => (
                <TableRow key={article.id} className="hover:bg-gray-50 dark:hover:bg-darkminisidebar">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {article.image ? (
                        <img src={article.image} alt={article.title} className="w-10 h-10 rounded-lg object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                          <Icon icon="solar:document-text-outline" className="text-[#0152EA]" width={18} />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm line-clamp-1">{article.title}</p>
                        {article.excerpt && (
                          <p className="text-xs text-gray-400 line-clamp-1">{article.excerpt}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {article.category ? (
                      <Badge variant="outline" className="text-xs">{article.category}</Badge>
                    ) : (
                      <span className="text-gray-400 text-xs">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={article.published
                      ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                    }>
                      {article.published ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(article.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Icon icon="solar:menu-dots-bold" width={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(article)}>
                          <Icon icon="solar:pen-outline" className="mr-2" width={15} />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={() => setDeleteId(article.id)}
                        >
                          <Icon icon="solar:trash-bin-trash-outline" className="mr-2" width={15} />
                          Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

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
