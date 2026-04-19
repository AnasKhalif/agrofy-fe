import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Icon } from "@iconify/react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useGetChildren } from "@/app/api/child/useChildApi";
import { useGetStuntingHistory } from "@/app/api/stunting/useStuntingApi";
import { Button } from "@/shared/components/agrofy-ui/ui/button";

const STATUS_COLORS: Record<string, string> = {
  "severely stunted": "text-red-600 bg-red-100",
  stunted: "text-orange-600 bg-orange-100",
  normal: "text-green-600 bg-green-100",
  tinggi: "text-blue-600 bg-blue-100",
};

const PERIOD_OPTIONS = [
  { label: "30 Hari", value: 30 },
  { label: "3 Bulan", value: 90 },
  { label: "6 Bulan", value: 180 },
  { label: "Semua", value: 0 },
];

const monthLabel = (dateString: string) =>
  new Date(dateString).toLocaleDateString("id-ID", { month: "short", year: "2-digit" });

const fullDateLabel = (dateString: string) =>
  new Date(dateString).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });

const GrowthReportPage = () => {
  const navigate = useNavigate();
  const [periodDays, setPeriodDays] = useState<number>(90);

  const { data: childrenData } = useGetChildren();
  const children = useMemo(() => childrenData?.data?.data ?? [], [childrenData]);

  const { data: historyData, isLoading } = useGetStuntingHistory();
  const allHistory = useMemo(() => historyData?.data?.data ?? [], [historyData]);

  const filteredHistory = useMemo(() => {
    if (periodDays === 0) return allHistory;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - periodDays);

    return allHistory.filter((item) => {
      const measurementDate = new Date(item.measurement_date);
      return measurementDate >= cutoff;
    });
  }, [allHistory, periodDays]);

  const latestByChild = useMemo(() => {
    const latestMap = new Map<number, (typeof allHistory)[number]>();

    allHistory.forEach((item) => {
      const childId = Number(item.child_id);
      const prev = latestMap.get(childId);

      if (!prev) {
        latestMap.set(childId, item);
        return;
      }

      const prevDate = new Date(prev.measurement_date).getTime();
      const currDate = new Date(item.measurement_date).getTime();

      if (currDate > prevDate) {
        latestMap.set(childId, item);
      }
    });

    return Array.from(latestMap.values());
  }, [allHistory]);

  const statusSummary = useMemo(() => {
    return latestByChild.reduce(
      (acc, item) => {
        const key = item.prediction_result;
        acc[key] = (acc[key] ?? 0) + 1;
        return acc;
      },
      {
        "severely stunted": 0,
        stunted: 0,
        normal: 0,
        tinggi: 0,
      } as Record<string, number>,
    );
  }, [latestByChild]);

  const monthlyTrend = useMemo(() => {
    const monthlyMap = new Map<
      string,
      {
        label: string;
        total: number;
      }
    >();

    filteredHistory.forEach((item) => {
      const date = new Date(item.measurement_date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const current = monthlyMap.get(key) ?? { label: monthLabel(item.measurement_date), total: 0 };
      current.total += 1;
      monthlyMap.set(key, current);
    });

    return Array.from(monthlyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([, value]) => value);
  }, [filteredHistory]);

  const maxMonthly = useMemo(() => {
    if (monthlyTrend.length === 0) return 1;
    return Math.max(...monthlyTrend.map((m) => m.total), 1);
  }, [monthlyTrend]);

  const childBreakdown = useMemo(() => {
    const grouped = new Map<number, { count: number; latestDate: string; latestStatus: string; latestLabel: string }>();

    allHistory.forEach((item) => {
      const childId = Number(item.child_id);
      const current = grouped.get(childId);

      if (!current) {
        grouped.set(childId, {
          count: 1,
          latestDate: item.measurement_date,
          latestStatus: item.prediction_result,
          latestLabel: item.prediction_label,
        });
        return;
      }

      const currDate = new Date(item.measurement_date).getTime();
      const prevDate = new Date(current.latestDate).getTime();

      grouped.set(childId, {
        count: current.count + 1,
        latestDate: currDate > prevDate ? item.measurement_date : current.latestDate,
        latestStatus: currDate > prevDate ? item.prediction_result : current.latestStatus,
        latestLabel: currDate > prevDate ? item.prediction_label : current.latestLabel,
      });
    });

    return children
      .map((child) => ({
        child,
        report: grouped.get(child.id),
      }))
      .filter((item) => !!item.report)
      .sort((a, b) => (b.report?.count ?? 0) - (a.report?.count ?? 0));
  }, [allHistory, children]);

  const exportRows = useMemo(
    () =>
      filteredHistory.map((item) => ({
        tanggal: fullDateLabel(item.measurement_date),
        anak: item.child?.name ?? "-",
        usiaBulan: Number(item.age),
        tinggiCm: Number(item.height).toFixed(1),
        zScore: Number(item.z_score).toFixed(2),
        status: item.prediction_label,
      })),
    [filteredHistory],
  );

  const exportFileSuffix = useMemo(() => {
    const periodLabel = PERIOD_OPTIONS.find((option) => option.value === periodDays)?.label ?? "Semua";
    return periodLabel.toLowerCase().replace(/\s+/g, "-");
  }, [periodDays]);

  const handleExportCSV = () => {
    const headers = ["Tanggal", "Anak", "Usia (bulan)", "Tinggi (cm)", "Z-Score", "Status"];
    const lines = exportRows.map((row) => [
      row.tanggal,
      row.anak,
      String(row.usiaBulan),
      row.tinggiCm,
      row.zScore,
      row.status,
    ]);

    const csvContent = [headers, ...lines]
      .map((line) => line.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `laporan-pertumbuhan-${exportFileSuffix}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

    doc.setFontSize(14);
    doc.text("Laporan Pertumbuhan Anak", 14, 14);

    doc.setFontSize(10);
    doc.text(`Periode: ${PERIOD_OPTIONS.find((option) => option.value === periodDays)?.label ?? "Semua"}`, 14, 20);
    doc.text(`Total Anak: ${children.length}`, 14, 25);
    doc.text(`Total Pengukuran: ${filteredHistory.length}`, 60, 25);

    autoTable(doc, {
      startY: 30,
      head: [["Tanggal", "Anak", "Usia (bulan)", "Tinggi (cm)", "Z-Score", "Status"]],
      body: exportRows.map((row) => [row.tanggal, row.anak, String(row.usiaBulan), row.tinggiCm, row.zScore, row.status]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [1, 82, 234] },
      didDrawPage: (data) => {
        const pageCount = doc.getNumberOfPages();
        doc.setFontSize(8);
        doc.text(`Halaman ${data.pageNumber}/${pageCount}`, data.settings.margin.left, doc.internal.pageSize.getHeight() - 6);
      },
    });

    doc.save(`laporan-pertumbuhan-${exportFileSuffix}.pdf`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Laporan Pertumbuhan</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Ringkasan status pertumbuhan dan tren pengukuran anak</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="h-8 text-xs" onClick={handleExportCSV} disabled={exportRows.length === 0}>
            <Icon icon="solar:download-line-duotone" width={14} className="mr-1" />
            Export CSV
          </Button>
          <Button variant="outline" className="h-8 text-xs" onClick={handleExportPDF} disabled={exportRows.length === 0}>
            <Icon icon="solar:file-text-line-duotone" width={14} className="mr-1" />
            Export PDF
          </Button>
          {PERIOD_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setPeriodDays(option.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                periodDays === option.value
                  ? "bg-[#0152EA] text-white border-[#0152EA]"
                  : "bg-white dark:bg-darkgray border-gray-200 dark:border-darkborder text-gray-600 dark:text-gray-300"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-darkgray rounded-xl border border-gray-200 dark:border-darkborder p-4">
          <p className="text-xs text-gray-500">Total Anak</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{children.length}</p>
        </div>
        <div className="bg-white dark:bg-darkgray rounded-xl border border-gray-200 dark:border-darkborder p-4">
          <p className="text-xs text-gray-500">Pengukuran ({periodDays === 0 ? "Semua" : `${periodDays} hari`})</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{filteredHistory.length}</p>
        </div>
        <div className="bg-white dark:bg-darkgray rounded-xl border border-gray-200 dark:border-darkborder p-4">
          <p className="text-xs text-gray-500">Status Normal (terakhir)</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{statusSummary.normal}</p>
        </div>
        <div className="bg-white dark:bg-darkgray rounded-xl border border-gray-200 dark:border-darkborder p-4">
          <p className="text-xs text-gray-500">Butuh Perhatian (terakhir)</p>
          <p className="text-2xl font-bold text-orange-600 mt-1">{statusSummary.stunted + statusSummary["severely stunted"]}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-darkgray rounded-xl border border-gray-200 dark:border-darkborder p-5">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Tren Pengukuran 6 Bulan Terakhir</h2>
        {monthlyTrend.length === 0 ? (
          <p className="text-sm text-gray-500">Belum ada data pengukuran pada periode ini.</p>
        ) : (
          <div className="grid grid-cols-6 gap-3 items-end h-40">
            {monthlyTrend.map((item, index) => (
              <div key={`${item.label}-${index}`} className="flex flex-col items-center justify-end gap-2">
                <div
                  className="w-full max-w-[36px] bg-[#0152EA] rounded-t-md"
                  style={{ height: `${Math.max((item.total / maxMonthly) * 120, 8)}px` }}
                />
                <span className="text-[11px] text-gray-500">{item.label}</span>
                <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300">{item.total}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-darkgray rounded-xl border border-gray-200 dark:border-darkborder p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900 dark:text-white">Breakdown Per Anak</h2>
          <span className="text-xs text-gray-500">Berdasarkan status terakhir</span>
        </div>
        {childBreakdown.length === 0 ? (
          <p className="text-sm text-gray-500">Belum ada data anak dengan pengukuran.</p>
        ) : (
          <div className="space-y-2">
            {childBreakdown.map(({ child, report }) => (
              <div key={child.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-darkminisidebar">
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm">
                  {child.name[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{child.name}</p>
                  <p className="text-xs text-gray-500">{report?.count ?? 0} pengukuran</p>
                </div>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${STATUS_COLORS[report?.latestStatus ?? ""] ?? "bg-gray-100 text-gray-600"}`}>
                  {report?.latestLabel}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-darkgray rounded-xl border border-gray-200 dark:border-darkborder p-5">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Riwayat Detail</h2>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-14 rounded-lg bg-gray-100 dark:bg-darkminisidebar animate-pulse" />
            ))}
          </div>
        ) : filteredHistory.length === 0 ? (
          <p className="text-sm text-gray-500">Tidak ada riwayat detail pada periode ini.</p>
        ) : (
          <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
            {filteredHistory.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 dark:border-darkborder">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${STATUS_COLORS[item.prediction_result] ?? "bg-gray-100 text-gray-600"}`}>
                  <Icon icon="solar:chart-2-outline" width={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-white font-medium">{item.child?.name ?? "-"}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(item.measurement_date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })} · TB {Number(item.height).toFixed(1)} cm · Z {Number(item.z_score).toFixed(2)}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => navigate(`/monitoring?child_id=${item.child_id}`)}
                >
                  Grafik
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GrowthReportPage;
