import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { Icon } from "@iconify/react";
import { useGetChildren } from "@/app/api/child/useChildApi";
import {
  useGetVaccineSchedule,
  useGetChildVaccinations,
  useRecordVaccination,
  useDeleteVaccination,
} from "@/app/api/vaccination/useVaccinationApi";
import type { ChildVaccineItem, VaccineStatus } from "@/app/api/vaccination/type";
import { Button } from "@/shared/components/agrofy-ui/ui/button";
import { Input } from "@/shared/components/agrofy-ui/ui/input";
import { Label } from "@/shared/components/agrofy-ui/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/agrofy-ui/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/agrofy-ui/ui/dialog";
import { useToast } from "@/shared/hooks";

const STATUS_STYLE: Record<VaccineStatus, { bg: string; text: string; label: string; icon: string }> = {
  given:    { bg: 'bg-green-100 dark:bg-green-900/30',  text: 'text-green-700 dark:text-green-400',  label: 'Diberikan',     icon: 'solar:check-circle-bold' },
  due:      { bg: 'bg-blue-100 dark:bg-blue-900/30',    text: 'text-blue-700 dark:text-blue-400',    label: 'Saatnya',        icon: 'solar:alarm-outline' },
  overdue:  { bg: 'bg-red-100 dark:bg-red-900/30',      text: 'text-red-700 dark:text-red-400',      label: 'Terlewat',       icon: 'solar:danger-triangle-outline' },
  upcoming: { bg: 'bg-gray-100 dark:bg-darkminisidebar', text: 'text-gray-600 dark:text-gray-400',   label: 'Akan datang',    icon: 'solar:clock-circle-outline' },
};

// Warna kolom usia ala KMS Buku KIA
const AGE_CELL_COLOR = (age: number, recommended: number, catchUp: number, childAge: number): string => {
  if (childAge >= age && age <= recommended) return 'bg-white'; // tepat
  if (age > recommended && age <= catchUp) return 'bg-yellow-100'; // boleh kejar
  if (age > catchUp) return 'bg-orange-200'; // imunisasi kejar
  return 'bg-gray-100 dark:bg-darkminisidebar'; // belum waktunya
};

const VaccinationPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const toast = useToast();
  const queryChildId = searchParams.get("child_id") ?? "";
  const [selectedChildId, setSelectedChildId] = useState<string>(queryChildId);
  const [activeTab, setActiveTab] = useState<'jadwal' | 'riwayat'>('riwayat');
  const [recordOpen, setRecordOpen] = useState(false);
  const [recordingVaccine, setRecordingVaccine] = useState<ChildVaccineItem | null>(null);
  const [givenDate, setGivenDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [batchNo, setBatchNo] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const { data: childrenData } = useGetChildren();
  const children = childrenData?.data?.data ?? [];
  const sortedChildren = useMemo(() => [...children].sort((a, b) => a.name.localeCompare(b.name)), [children]);

  useEffect(() => {
    if (!selectedChildId && sortedChildren.length > 0) {
      const fallback = sortedChildren[0].id.toString();
      setSelectedChildId(fallback);
      setSearchParams({ child_id: fallback }, { replace: true });
    }
  }, [selectedChildId, sortedChildren, setSearchParams]);

  const { data: scheduleData } = useGetVaccineSchedule();
  const schedule = scheduleData?.data?.data ?? [];

  const childIdNum = selectedChildId ? parseInt(selectedChildId) : undefined;
  const { data: childVacData, isLoading, error: childVacError } = useGetChildVaccinations(childIdNum);
  const childVacResponse = childVacData?.data?.data;
  const items = childVacResponse?.items ?? [];
  const summary = childVacResponse?.summary;
  const childInfo = childVacResponse?.child;

  const recordMutation = useRecordVaccination(childIdNum ?? 0, {
    onSuccess: () => {
      toast.success("Catatan imunisasi disimpan");
      setRecordOpen(false);
      setRecordingVaccine(null);
      setBatchNo("");
      setNotes("");
    },
    onError: () => toast.error("Gagal menyimpan catatan imunisasi"),
  });

  const deleteMutation = useDeleteVaccination(childIdNum ?? 0, {
    onSuccess: () => toast.success("Catatan dihapus"),
    onError: () => toast.error("Gagal menghapus catatan"),
  });

  const handleChildChange = (value: string) => {
    setSelectedChildId(value);
    setSearchParams({ child_id: value }, { replace: true });
  };

  const openRecordDialog = (vac: ChildVaccineItem) => {
    setRecordingVaccine(vac);
    setGivenDate(new Date().toISOString().split('T')[0]);
    setBatchNo("");
    setNotes("");
    setRecordOpen(true);
  };

  const submitRecord = () => {
    if (!recordingVaccine || !childIdNum) return;
    recordMutation.mutate({
      vaccine_code: recordingVaccine.code,
      given_date: givenDate,
      batch_no: batchNo || undefined,
      notes: notes || undefined,
    });
  };

  // Group items by group label
  const itemsByGroup = useMemo(() => {
    const map = new Map<string, ChildVaccineItem[]>();
    items.forEach(it => {
      const arr = map.get(it.group) ?? [];
      arr.push(it);
      map.set(it.group, arr);
    });
    return Array.from(map.entries());
  }, [items]);

  const ageColumns = Array.from({ length: 25 }, (_, i) => i); // 0-24 bulan

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Imunisasi Anak</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Jadwal & catatan imunisasi sesuai Permenkes No. 2 Tahun 2020 (Buku KIA)
          </p>
        </div>
      </div>

      {/* Pilih Anak */}
      <div className="bg-white dark:bg-darkgray rounded-xl border border-gray-200 dark:border-darkborder p-4">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pilih Anak</p>
        <Select value={selectedChildId} onValueChange={handleChildChange}>
          <SelectTrigger className="w-full max-w-sm">
            <SelectValue placeholder="Pilih anak..." />
          </SelectTrigger>
          <SelectContent>
            {sortedChildren.map(c => (
              <SelectItem key={c.id} value={c.id.toString()}>
                {c.name} · {c.age_in_months} bulan
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-darkborder">
        {[
          { key: 'riwayat', label: 'Riwayat & Status Anak', icon: 'solar:user-id-outline' },
          { key: 'jadwal',  label: 'Jadwal Lengkap (KMS)',  icon: 'solar:calendar-outline' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as 'jadwal' | 'riwayat')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === t.key
                ? 'border-[#0152EA] text-[#0152EA]'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
          >
            <Icon icon={t.icon} width={16} />
            {t.label}
          </button>
        ))}
      </div>

      {!selectedChildId ? (
        <div className="bg-white dark:bg-darkgray rounded-xl border border-gray-200 dark:border-darkborder py-16 text-center">
          <Icon icon="solar:syringe-outline" width={56} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-gray-500 dark:text-gray-400">Pilih anak terlebih dahulu</p>
        </div>
      ) : isLoading ? (
        <div className="flex justify-center py-12">
          <Icon icon="solar:refresh-line-duotone" className="animate-spin text-gray-400" width={32} />
        </div>
      ) : childVacError ? (
        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 p-6 text-center">
          <Icon icon="solar:danger-triangle-outline" width={40} className="mx-auto text-red-500 mb-2" />
          <p className="text-sm font-semibold text-red-700 dark:text-red-400">Gagal memuat data imunisasi</p>
          <p className="text-xs text-red-600 dark:text-red-400 mt-1">
            Pastikan role Anda memiliki permission <code className="bg-red-100 dark:bg-red-900/40 px-1 rounded">vaccinations-read</code>, atau anak dipilih milik Anda.
          </p>
        </div>
      ) : !childVacResponse ? (
        <div className="bg-white dark:bg-darkgray rounded-xl border border-gray-200 dark:border-darkborder py-16 text-center">
          <Icon icon="solar:syringe-outline" width={56} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-gray-500 dark:text-gray-400">Tidak ada data imunisasi untuk anak ini</p>
        </div>
      ) : activeTab === 'riwayat' ? (
        <>
          {/* Summary cards */}
          {summary && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <SummaryCard label="Total Vaksin" value={summary.total} icon="solar:list-outline" color="text-gray-700" />
              <SummaryCard label="Diberikan"  value={summary.given}    icon="solar:check-circle-bold" color="text-green-600" />
              <SummaryCard label="Saatnya"    value={summary.due}      icon="solar:alarm-outline" color="text-blue-600" />
              <SummaryCard label="Terlewat"   value={summary.overdue}  icon="solar:danger-triangle-outline" color="text-red-600" />
              <SummaryCard label="Akan datang" value={summary.upcoming} icon="solar:clock-circle-outline" color="text-gray-500" />
            </div>
          )}

          {/* List per group */}
          <div className="space-y-4">
            {itemsByGroup.map(([groupName, vaccines]) => (
              <div key={groupName} className="bg-white dark:bg-darkgray rounded-xl border border-gray-200 dark:border-darkborder overflow-hidden">
                <div className="px-5 py-3 bg-gray-50 dark:bg-darkminisidebar border-b border-gray-200 dark:border-darkborder">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{groupName}</p>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-darkborder">
                  {vaccines.map(v => {
                    const cfg = STATUS_STYLE[v.status];
                    return (
                      <div key={v.code} className="px-5 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-darkminisidebar/50">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                          <Icon icon={cfg.icon} width={18} className={cfg.text} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{v.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Usia tepat: {v.recommended_age} bln · Batas kejar: {v.catch_up_until} bln
                            {v.given_date && (
                              <> · Diberikan: <strong>{new Date(v.given_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</strong></>
                            )}
                            {v.batch_no && <> · Batch: {v.batch_no}</>}
                          </p>
                        </div>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${cfg.bg} ${cfg.text}`}>
                          {cfg.label}
                        </span>
                        {v.status === 'given' && v.record_id ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-xs text-red-600 hover:text-red-700"
                            onClick={() => v.record_id && deleteMutation.mutate(v.record_id)}
                            disabled={deleteMutation.isPending}
                          >
                            <Icon icon="solar:trash-bin-trash-outline" width={14} />
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            className="bg-[#0152EA] hover:bg-blue-700 text-white h-8 text-xs gap-1"
                            onClick={() => openRecordDialog(v)}
                          >
                            <Icon icon="solar:add-circle-outline" width={14} />
                            Catat
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        // Tab Jadwal Lengkap (matrix vaksin x usia bulan, ala foto Buku KIA hal 72)
        <div className="bg-white dark:bg-darkgray rounded-xl border border-gray-200 dark:border-darkborder p-4 overflow-x-auto">
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Pelayanan Imunisasi (Buku KIA hal. 72)</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            Setiap kolom = usia anak dalam bulan. Warna sesuai legenda Buku KIA Kemenkes 2020.
          </p>
          <table className="w-full text-[10px] border-collapse" style={{ minWidth: 850 }}>
            <thead>
              <tr>
                <th rowSpan={2} className="border border-gray-300 dark:border-darkborder px-2 py-1 bg-gray-100 dark:bg-darkminisidebar text-left font-semibold sticky left-0 z-10">
                  Jenis Vaksin
                </th>
                <th colSpan={ageColumns.length} className="border border-gray-300 dark:border-darkborder px-2 py-1 bg-gray-100 dark:bg-darkminisidebar text-center">
                  Bulan
                </th>
              </tr>
              <tr>
                {ageColumns.map(age => (
                  <th key={age} className="border border-gray-300 dark:border-darkborder w-7 py-1 bg-gray-50 dark:bg-darkminisidebar/70 text-center font-semibold text-gray-600">
                    {age}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {schedule.map(vac => {
                const recordItem = items.find(i => i.code === vac.code);
                const givenDate = recordItem?.given_date;
                const givenAtAge = givenDate && childInfo
                  ? Math.floor((new Date(givenDate).getTime() - new Date(childInfo.date_of_birth).getTime()) / (30.44 * 24 * 60 * 60 * 1000))
                  : null;
                return (
                  <tr key={vac.code}>
                    <td className="border border-gray-300 dark:border-darkborder px-2 py-1 bg-white dark:bg-darkgray sticky left-0 z-10 text-gray-800 dark:text-gray-200">
                      {vac.name}
                    </td>
                    {ageColumns.map(age => {
                      const isMarked = givenAtAge === age;
                      const cellColor = AGE_CELL_COLOR(
                        age,
                        vac.recommended_age,
                        vac.catch_up_until,
                        childInfo?.age_months ?? 0,
                      );
                      return (
                        <td
                          key={age}
                          className={`border border-gray-300 dark:border-darkborder text-center ${cellColor} ${isMarked ? 'font-bold' : ''}`}
                          title={
                            age === vac.recommended_age
                              ? `Usia tepat pemberian (${vac.name})`
                              : age <= vac.catch_up_until && age > vac.recommended_age
                              ? `Masih boleh untuk melengkapi`
                              : ''
                          }
                        >
                          {isMarked && (
                            <span className="text-green-600">✓</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-[10px]">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-white border border-gray-300 inline-block" />Usia tepat pemberian</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-yellow-100 border border-gray-300 inline-block" />Masih boleh untuk melengkapi</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-orange-200 border border-gray-300 inline-block" />Imunisasi kejar (terlewat)</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-gray-100 border border-gray-300 inline-block" />Belum waktunya</span>
            <span className="flex items-center gap-1.5"><span className="text-green-600 font-bold">✓</span>Sudah diberikan</span>
          </div>
        </div>
      )}

      {/* Dialog Catat Imunisasi */}
      <Dialog open={recordOpen} onOpenChange={setRecordOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icon icon="solar:syringe-outline" width={20} className="text-[#0152EA]" />
              Catat Imunisasi
            </DialogTitle>
          </DialogHeader>
          {recordingVaccine && (
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">{recordingVaccine.name}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">Usia tepat: {recordingVaccine.recommended_age} bulan</p>
              </div>
              <div className="space-y-1.5">
                <Label>Tanggal Pemberian <span className="text-red-500">*</span></Label>
                <Input type="date" value={givenDate} onChange={(e) => setGivenDate(e.target.value)} max={new Date().toISOString().split('T')[0]} />
              </div>
              <div className="space-y-1.5">
                <Label>Nomor Batch (opsional)</Label>
                <Input placeholder="Contoh: BAT-2026-001" value={batchNo} onChange={(e) => setBatchNo(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Catatan (opsional)</Label>
                <Input placeholder="Reaksi, lokasi suntik, dll" value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setRecordOpen(false)}>Batal</Button>
            <Button
              className="bg-[#0152EA] hover:bg-blue-700 text-white gap-2"
              onClick={submitRecord}
              disabled={recordMutation.isPending}
            >
              {recordMutation.isPending && <Icon icon="solar:refresh-line-duotone" className="animate-spin" width={14} />}
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const SummaryCard = ({ label, value, icon, color }: { label: string; value: number; icon: string; color: string }) => (
  <div className="bg-white dark:bg-darkgray rounded-xl border border-gray-200 dark:border-darkborder p-3 flex items-center gap-3">
    <Icon icon={icon} width={22} className={color} />
    <div>
      <p className="text-lg font-bold text-gray-900 dark:text-white leading-none">{value}</p>
      <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
    </div>
  </div>
);

export default VaccinationPage;
