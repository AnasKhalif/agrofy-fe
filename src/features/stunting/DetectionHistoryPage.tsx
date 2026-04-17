import { useState } from "react";
import { useNavigate } from "react-router";
import { Icon } from "@iconify/react";
import { useGetChildren } from "@/app/api/child/useChildApi";
import { useGetStuntingHistory } from "@/app/api/stunting/useStuntingApi";
import { Button } from "@/shared/components/agrofy-ui/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/agrofy-ui/ui/select";

const STATUS_COLORS: Record<string, string> = {
  'severely stunted': 'text-red-600 bg-red-100',
  'stunted':          'text-orange-600 bg-orange-100',
  'normal':           'text-green-600 bg-green-100',
  'tinggi':           'text-blue-600 bg-blue-100',
};

const STATUS_ICON: Record<string, string> = {
  'severely stunted': 'solar:danger-triangle-outline',
  'stunted':          'solar:danger-circle-outline',
  'normal':           'solar:check-circle-outline',
  'tinggi':           'solar:graph-up-outline',
};

const DetectionHistoryPage = () => {
  const navigate = useNavigate();
  const [childFilter, setChildFilter] = useState<string>("all");

  const { data: childrenData } = useGetChildren();
  const children = childrenData?.data?.data ?? [];

  const { data: historyData, isLoading } = useGetStuntingHistory(
    childFilter !== "all" ? { child_id: parseInt(childFilter) } : undefined
  );
  const history = historyData?.data?.data ?? [];

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Riwayat Deteksi</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Semua hasil deteksi risiko stunting</p>
        </div>
        <Button className="bg-[#0152EA] hover:bg-blue-700 text-white gap-2 text-sm" onClick={() => navigate("/stunting-detection")}>
          <Icon icon="solar:medical-kit-outline" width={16} /> Deteksi Baru
        </Button>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <Select value={childFilter} onValueChange={setChildFilter}>
          <SelectTrigger className="w-56 h-9 text-sm">
            <SelectValue placeholder="Semua Anak" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Anak</SelectItem>
            {children.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <span className="text-sm text-gray-500 dark:text-gray-400">{history.length} hasil ditemukan</span>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-darkgray rounded-xl border border-gray-200 dark:border-darkborder p-4 animate-pulse h-20" />
          ))}
        </div>
      ) : history.length === 0 ? (
        <div className="bg-white dark:bg-darkgray rounded-xl border border-gray-200 dark:border-darkborder py-16 text-center">
          <Icon icon="solar:history-outline" width={56} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-gray-500 dark:text-gray-400">Belum ada riwayat deteksi</p>
          <Button variant="link" className="text-[#0152EA] mt-1" onClick={() => navigate("/stunting-detection")}>
            Mulai deteksi pertama →
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => {
            const colorClass = STATUS_COLORS[item.prediction_result] ?? 'bg-gray-100 text-gray-600';
            const iconName = STATUS_ICON[item.prediction_result] ?? 'solar:question-circle-outline';
            return (
              <div key={item.id} className="bg-white dark:bg-darkgray rounded-xl border border-gray-200 dark:border-darkborder p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                    <Icon icon={iconName} width={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">{item.child?.name ?? '-'}</p>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${colorClass}`}>
                        {item.prediction_label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Icon icon="solar:calendar-outline" width={12} />
                        {new Date(item.measurement_date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Usia: {item.age} bulan</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">TB: {Number(item.height).toFixed(1)} cm</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Z-score: {Number(item.z_score).toFixed(3)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button variant="outline" size="sm" className="text-xs" onClick={() => navigate(`/monitoring?child_id=${item.child_id}`)}>
                      <Icon icon="solar:chart-outline" width={13} className="mr-1" /> Grafik
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DetectionHistoryPage;
