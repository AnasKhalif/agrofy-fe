import { useNavigate } from "react-router";
import { Icon } from "@iconify/react";
import { Button } from "@/shared/components/agrofy-ui/ui/button";

const ForbiddenPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center bg-white dark:bg-darkgray border border-gray-200 dark:border-darkborder rounded-2xl p-8">
        <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
          <Icon icon="solar:shield-cross-outline" width={28} className="text-red-500" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">403 - Akses Ditolak</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Kamu tidak memiliki izin untuk mengakses halaman ini.
        </p>

        <Button onClick={() => navigate(-1)} className="bg-[#0152EA] hover:bg-blue-700 text-white">
          Kembali
        </Button>
      </div>
    </div>
  );
};

export default ForbiddenPage;
