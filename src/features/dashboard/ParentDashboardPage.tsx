import { useNavigate } from "react-router";
import { Icon } from "@iconify/react";
import { useGetParentDashboard } from "@/app/api/dashboard/useDashboardApi";
import { Button } from "@/shared/components/agrofy-ui/ui/button";

const STATUS_COLORS: Record<string, string> = {
  'severely stunted': 'text-red-600 bg-red-100',
  'stunted':          'text-orange-600 bg-orange-100',
  'normal':           'text-green-600 bg-green-100',
  'tinggi':           'text-blue-600 bg-blue-100',
};

const ParentDashboardPage = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetParentDashboard();
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
    { label: 'Jumlah Anak', value: dashboard?.total_children ?? 0, icon: 'solar:users-group-rounded-outline', color: 'text-blue-600 bg-blue-50', action: () => navigate('/children') },
    { label: 'Total Deteksi', value: dashboard?.total_detections ?? 0, icon: 'solar:medical-kit-outline', color: 'text-purple-600 bg-purple-50', action: () => navigate('/detection-history') },
    { label: 'Konsultasi Aktif', value: dashboard?.active_consultations ?? 0, icon: 'solar:chat-round-dots-outline', color: 'text-green-600 bg-green-50', action: () => navigate('/consultation') },
    { label: 'Status Normal', value: dashboard?.status_counts?.['normal'] ?? 0, icon: 'solar:check-circle-outline', color: 'text-emerald-600 bg-emerald-50', action: () => navigate('/detection-history') },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Selamat datang! Pantau pertumbuhan anak Anda di sini.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <button key={s.label} onClick={s.action} className="bg-white dark:bg-darkgray rounded-xl border border-gray-200 dark:border-darkborder p-5 text-left hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
              <Icon icon={s.icon} width={22} />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
          </button>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Tambah Anak', icon: 'solar:user-plus-rounded-outline', color: 'bg-blue-600 hover:bg-blue-700', path: '/children/create' },
          { label: 'Deteksi Stunting', icon: 'solar:medical-kit-outline', color: 'bg-purple-600 hover:bg-purple-700', path: '/stunting-detection' },
          { label: 'Monitoring', icon: 'solar:chart-2-outline', color: 'bg-green-600 hover:bg-green-700', path: '/monitoring' },
          { label: 'Konsultasi', icon: 'solar:chat-round-dots-outline', color: 'bg-orange-600 hover:bg-orange-700', path: '/consultation' },
        ].map((a) => (
          <button key={a.label} onClick={() => navigate(a.path)} className={`${a.color} text-white rounded-xl p-4 flex flex-col items-center gap-2 transition-colors`}>
            <Icon icon={a.icon} width={24} />
            <span className="text-xs font-medium">{a.label}</span>
          </button>
        ))}
      </div>

      {/* Children Summary */}
      {(dashboard?.children_summary?.length ?? 0) > 0 && (
        <div className="bg-white dark:bg-darkgray rounded-xl border border-gray-200 dark:border-darkborder p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">Ringkasan Anak</h2>
            <Button variant="link" size="sm" className="text-[#0152EA] text-xs" onClick={() => navigate('/children')}>Lihat semua →</Button>
          </div>
          <div className="space-y-3">
            {dashboard!.children_summary.map((child) => (
              <div key={child.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-darkminisidebar rounded-lg">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${child.gender === 'laki-laki' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'}`}>
                  {child.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900 dark:text-white">{child.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{child.age_in_months} bulan</p>
                </div>
                <div className="text-right">
                  {child.latest_status ? (
                    <>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[child.latest_status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {child.latest_label}
                      </span>
                      {child.latest_height && <p className="text-xs text-gray-400 mt-1">TB: {Number(child.latest_height).toFixed(1)} cm</p>}
                    </>
                  ) : (
                    <span className="text-xs text-gray-400">Belum ada deteksi</span>
                  )}
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400" onClick={() => navigate(`/stunting-detection?child_id=${child.id}`)}>
                  <Icon icon="solar:medical-kit-outline" width={15} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Riwayat Deteksi Terakhir */}
      {(dashboard?.latest_results?.length ?? 0) > 0 && (
        <div className="bg-white dark:bg-darkgray rounded-xl border border-gray-200 dark:border-darkborder p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">Deteksi Terakhir</h2>
            <Button variant="link" size="sm" className="text-[#0152EA] text-xs" onClick={() => navigate('/detection-history')}>Lihat semua →</Button>
          </div>
          <div className="space-y-2">
            {dashboard!.latest_results.map((r) => (
              <div key={r.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-darkminisidebar rounded-lg transition-colors">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${r.prediction_result === 'normal' ? 'bg-green-500' : r.prediction_result === 'stunted' ? 'bg-orange-500' : r.prediction_result === 'severely stunted' ? 'bg-red-500' : 'bg-blue-500'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{r.child_name}</p>
                  <p className="text-xs text-gray-400">{new Date(r.measurement_date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[r.prediction_result] ?? 'bg-gray-100 text-gray-600'}`}>
                  {r.prediction_label}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">TB: {Number(r.height).toFixed(1)} cm</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {(dashboard?.total_children ?? 0) === 0 && (
        <div className="bg-white dark:bg-darkgray rounded-xl border border-gray-200 dark:border-darkborder py-16 text-center">
          <Icon icon="solar:users-group-rounded-outline" width={56} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-600 dark:text-gray-400 font-medium">Mulai dengan menambahkan data anak</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1 mb-5">Daftarkan anak Anda untuk memulai pemantauan pertumbuhan</p>
          <Button className="bg-[#0152EA] hover:bg-blue-700 text-white gap-2" onClick={() => navigate('/children/create')}>
            <Icon icon="solar:user-plus-rounded-outline" width={16} /> Tambah Anak Sekarang
          </Button>
        </div>
      )}
    </div>
  );
};

export default ParentDashboardPage;
