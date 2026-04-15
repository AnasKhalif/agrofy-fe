import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useGetDoctorDashboard } from "@/app/api/dashboard/useDashboardApi";
import { Button } from "@/shared/components/agrofy-ui/ui/button";

const STATUS_COLOR: Record<string, string> = {
  pending:   'bg-yellow-100 text-yellow-700',
  ongoing:   'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
};
const STATUS_LABEL: Record<string, string> = { pending: 'Menunggu', ongoing: 'Berlangsung', completed: 'Selesai' };

const DoctorDashboardPage = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetDoctorDashboard();
  const dashboard = data?.data?.data;

  if (isLoading) {
    return (
      <div className="p-6 space-y-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-darkgray rounded-xl border border-gray-200 dark:border-darkborder p-5 animate-pulse h-24" />
          ))}
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Konsultasi', value: dashboard?.total_consultations ?? 0, icon: 'solar:chat-round-dots-outline', color: 'text-blue-600 bg-blue-50' },
    { label: 'Menunggu', value: dashboard?.pending_consultations ?? 0, icon: 'solar:clock-circle-outline', color: 'text-yellow-600 bg-yellow-50' },
    { label: 'Berlangsung', value: dashboard?.ongoing_consultations ?? 0, icon: 'solar:chat-round-line-outline', color: 'text-green-600 bg-green-50' },
    { label: 'Total Pasien', value: dashboard?.total_patients ?? 0, icon: 'solar:users-group-rounded-outline', color: 'text-purple-600 bg-purple-50' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Dokter</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Kelola konsultasi dan pantau pasien Anda</p>
        </div>
        <Button className="bg-[#0152EA] hover:bg-blue-700 text-white gap-2 text-sm" onClick={() => navigate('/doctor/consultation')}>
          <Icon icon="solar:chat-round-dots-outline" width={16} /> Buka Konsultasi
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white dark:bg-darkgray rounded-xl border border-gray-200 dark:border-darkborder p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
              <Icon icon={s.icon} width={22} />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Konsultasi Terbaru */}
      <div className="bg-white dark:bg-darkgray rounded-xl border border-gray-200 dark:border-darkborder p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900 dark:text-white">Konsultasi Terbaru</h2>
          <Button variant="link" size="sm" className="text-[#0152EA] text-xs" onClick={() => navigate('/doctor/consultation')}>
            Lihat semua →
          </Button>
        </div>
        {(dashboard?.recent_consultations?.length ?? 0) === 0 ? (
          <div className="text-center py-8">
            <Icon icon="solar:chat-round-dots-outline" width={40} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-400">Belum ada konsultasi</p>
          </div>
        ) : (
          <div className="space-y-3">
            {dashboard!.recent_consultations.map((c) => (
              <div key={c.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-darkminisidebar rounded-lg hover:bg-gray-100 dark:hover:bg-darkborder transition-colors cursor-pointer" onClick={() => navigate('/doctor/consultation')}>
                <div className="w-9 h-9 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 font-semibold text-sm flex-shrink-0">
                  {c.parent_name[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900 dark:text-white">{c.parent_name}</p>
                  <p className="text-xs text-gray-400 truncate">{c.subject ?? 'Konsultasi umum'}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${STATUS_COLOR[c.status] ?? 'bg-gray-100 text-gray-600'}`}>
                  {STATUS_LABEL[c.status] ?? c.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboardPage;
