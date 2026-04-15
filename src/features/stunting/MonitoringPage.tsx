import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { LineChart } from "@mui/x-charts/LineChart";
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


const MonitoringPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedChildId, setSelectedChildId] = useState<string>(searchParams.get("child_id") ?? "");

  const { data: childrenData } = useGetChildren();
  const children = childrenData?.data?.data ?? [];

  const { data: historyData, isLoading } = useGetStuntingHistory(
    selectedChildId ? { child_id: parseInt(selectedChildId) } : undefined
  );
  const history = historyData?.data?.data ?? [];

  const selectedChild = children.find(c => c.id.toString() === selectedChildId);
  const chartData = [...history].sort((a, b) => new Date(a.measurement_date).getTime() - new Date(b.measurement_date).getTime());

  // Pad to at least 2 points for LineChart (duplicate if only 1)
  const padded = chartData.length === 1 ? [chartData[0], chartData[0]] : chartData;

  const dateLabels = padded.map((d, i) =>
    padded.length === 2 && chartData.length === 1
      ? (i === 0 ? '' : new Date(d.measurement_date).toLocaleDateString("id-ID", { day: "numeric", month: "short" }))
      : new Date(d.measurement_date).toLocaleDateString("id-ID", { day: "numeric", month: "short" })
  );
  const heightSeries = padded.map(d => Number(d.height));
  const zScoreSeries = chartData.map(d => Number(d.z_score));
  const zDateLabels = chartData.map(d =>
    new Date(d.measurement_date).toLocaleDateString("id-ID", { day: "numeric", month: "short" })
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Monitoring Pertumbuhan</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Pantau perkembangan pertumbuhan anak dari waktu ke waktu</p>
        </div>
        {selectedChildId && (
          <Button className="bg-[#0152EA] hover:bg-blue-700 text-white gap-2 text-sm" onClick={() => navigate(`/stunting-detection?child_id=${selectedChildId}`)}>
            <Icon icon="solar:medical-kit-outline" width={16} /> Deteksi Baru
          </Button>
        )}
      </div>

      {/* Pilih Anak */}
      <div className="bg-white dark:bg-darkgray rounded-xl border border-gray-200 dark:border-darkborder p-4">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pilih Anak</p>
        <Select value={selectedChildId} onValueChange={setSelectedChildId}>
          <SelectTrigger className="w-full max-w-sm">
            <SelectValue placeholder="Pilih anak untuk monitoring..." />
          </SelectTrigger>
          <SelectContent>
            {children.map(c => (
              <SelectItem key={c.id} value={c.id.toString()}>
                {c.name} · {c.age_in_months} bulan
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!selectedChildId ? (
        <div className="bg-white dark:bg-darkgray rounded-xl border border-gray-200 dark:border-darkborder py-16 text-center">
          <Icon icon="solar:chart-outline" width={56} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-gray-500 dark:text-gray-400">Pilih anak terlebih dahulu untuk melihat monitoring pertumbuhan</p>
        </div>
      ) : isLoading ? (
        <div className="flex justify-center py-12"><Icon icon="solar:refresh-line-duotone" className="animate-spin text-gray-400" width={32} /></div>
      ) : history.length === 0 ? (
        <div className="bg-white dark:bg-darkgray rounded-xl border border-gray-200 dark:border-darkborder py-16 text-center">
          <Icon icon="solar:chart-outline" width={56} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">Belum ada riwayat deteksi</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1 mb-4">Lakukan deteksi stunting untuk mulai memantau pertumbuhan</p>
          <Button className="bg-[#0152EA] hover:bg-blue-700 text-white gap-2" onClick={() => navigate(`/stunting-detection?child_id=${selectedChildId}`)}>
            <Icon icon="solar:medical-kit-outline" width={16} /> Mulai Deteksi
          </Button>
        </div>
      ) : (
        <>
          {/* Info Anak */}
          {selectedChild && (
            <div className="bg-white dark:bg-darkgray rounded-xl border border-gray-200 dark:border-darkborder p-4 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${selectedChild.gender === 'laki-laki' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'}`}>
                {selectedChild.name[0]}
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{selectedChild.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{selectedChild.age_in_months} bulan · {selectedChild.gender}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-xs text-gray-400">Status Terakhir</p>
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[history[0]?.prediction_result] ?? 'bg-gray-100 text-gray-600'}`}>
                  {history[0]?.prediction_label ?? '-'}
                </span>
              </div>
            </div>
          )}

          {/* Grafik Tinggi Badan */}
          <div className="bg-white dark:bg-darkgray rounded-xl border border-gray-200 dark:border-darkborder p-5">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Icon icon="solar:chart-2-outline" width={18} className="text-[#0152EA]" />
                Grafik Tinggi Badan (cm)
              </h3>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#0152EA]" />
                <span className="text-xs text-gray-500">Tinggi Badan</span>
              </div>
            </div>
            <LineChart
              xAxis={[{
                scaleType: "point",
                data: dateLabels,
                tickLabelStyle: { fontSize: 11, fill: '#9ca3af' },
                disableLine: true,
                disableTicks: true,
              }]}
              yAxis={[{
                min: Math.min(...heightSeries) - 5,
                max: Math.max(...heightSeries) + 5,
                tickLabelStyle: { fontSize: 11, fill: '#9ca3af' },
                disableLine: true,
                valueFormatter: (v: number) => `${v}`,
              }]}
              series={[{
                data: heightSeries,
                color: "#0152EA",
                area: true,
                showMark: true,
                curve: "natural",
                label: "Tinggi (cm)",
                valueFormatter: (v) => `${v} cm`,
              }]}
              height={260}
              margin={{ top: 16, right: 24, bottom: 36, left: 48 }}
              grid={{ horizontal: true, vertical: false }}
              slotProps={{ legend: { sx: { display: 'none' } } }}
              sx={{
                '& .MuiAreaElement-root': { fillOpacity: 0.12 },
              }}
            />
          </div>

          {/* Grafik Z-Score */}
          <div className="bg-white dark:bg-darkgray rounded-xl border border-gray-200 dark:border-darkborder p-5">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
              <Icon icon="solar:graph-new-up-outline" width={18} className="text-[#0152EA]" />
              Grafik Z-Score TB/U
            </h3>
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-4">
              <span className="flex items-center gap-1"><span className="w-3 h-1.5 rounded bg-red-500 inline-block" /> &lt; -3 SD (Sangat Pendek)</span>
              <span className="flex items-center gap-1"><span className="w-3 h-1.5 rounded bg-orange-500 inline-block" /> -3 s/d -2 SD (Pendek)</span>
              <span className="flex items-center gap-1"><span className="w-3 h-1.5 rounded bg-green-500 inline-block" /> -2 s/d +2 SD (Normal)</span>
              <span className="flex items-center gap-1"><span className="w-3 h-1.5 rounded bg-blue-500 inline-block" /> &gt; +2 SD (Tinggi)</span>
            </div>
            {(() => {
              const zMin = Math.min(...zScoreSeries, -4);
              const zMax = Math.max(...zScoreSeries, 4);
              const pctOf = (v: number) => Math.round(((v - zMin) / (zMax - zMin)) * 100);
              const pctMinus3 = pctOf(-3);
              const pctMinus2 = pctOf(-2);
              const pctPlus2  = pctOf(2);
              return (
                <div className="space-y-3">
                  {chartData.map((item, i) => {
                    const z = Number(item.z_score);
                    const pct = Math.min(98, Math.max(2, pctOf(z)));
                    const dotColor =
                      z < -3 ? 'bg-red-500' :
                      z < -2 ? 'bg-orange-500' :
                      z < 2  ? 'bg-green-500' : 'bg-blue-500';
                    return (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 dark:text-gray-400 w-20 flex-shrink-0">
                          {new Date(item.measurement_date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "2-digit" })}
                        </span>
                        <div className="flex-1 relative">
                          {/* Track dengan zona warna */}
                          <div className="w-full h-5 rounded-full overflow-hidden flex">
                            <div style={{ width: `${pctMinus3}%` }} className="bg-red-100 dark:bg-red-900/30 h-full" />
                            <div style={{ width: `${pctMinus2 - pctMinus3}%` }} className="bg-orange-100 dark:bg-orange-900/30 h-full" />
                            <div style={{ width: `${pctPlus2 - pctMinus2}%` }} className="bg-green-100 dark:bg-green-900/30 h-full" />
                            <div className="flex-1 bg-blue-100 dark:bg-blue-900/30 h-full" />
                          </div>
                          {/* Dot marker */}
                          <div
                            className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-md ${dotColor}`}
                            style={{ left: `calc(${pct}% - 8px)` }}
                          />
                          {/* Tick labels */}
                          <div className="relative h-4 mt-0.5">
                            {[{ p: pctMinus3, l: '-3' }, { p: pctMinus2, l: '-2' }, { p: pctPlus2, l: '+2' }].map(t => (
                              <span key={t.l} className="absolute text-[9px] text-gray-400 -translate-x-1/2" style={{ left: `${t.p}%` }}>{t.l}</span>
                            ))}
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 w-16 text-right flex-shrink-0">
                          {z > 0 ? '+' : ''}{z.toFixed(2)} SD
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium w-20 text-center flex-shrink-0 ${STATUS_COLORS[item.prediction_result] ?? 'bg-gray-100 text-gray-600'}`}>
                          {item.prediction_label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>

          {/* Tabel Riwayat */}
          <div className="bg-white dark:bg-darkgray rounded-xl border border-gray-200 dark:border-darkborder overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200 dark:border-darkborder">
              <h3 className="font-semibold text-gray-900 dark:text-white">Tabel Riwayat Pengukuran</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 dark:bg-darkminisidebar">
                  <tr>
                    {['Tanggal', 'Usia (bln)', 'TB (cm)', 'BB (kg)', 'Z-Score', 'Status'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-darkborder">
                  {history.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-darkminisidebar">
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                        {new Date(item.measurement_date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{item.age}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{Number(item.height).toFixed(1)}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{item.weight ? Number(item.weight).toFixed(1) : '-'}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">
                        {Number(item.z_score) > 0 ? '+' : ''}{Number(item.z_score).toFixed(3)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${STATUS_COLORS[item.prediction_result] ?? 'bg-gray-100 text-gray-600'}`}>
                          {item.prediction_label}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MonitoringPage;
