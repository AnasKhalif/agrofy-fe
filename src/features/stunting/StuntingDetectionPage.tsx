import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { Icon } from "@iconify/react";
import { useGetChildren } from "@/app/api/child/useChildApi";
import { useDetectStunting } from "@/app/api/stunting/useStuntingApi";
import { useGetUsers } from "@/app/api/user/useUserApi";
import { useCreateConsultation } from "@/app/api/consultation/useConsultationApi";
import { consultationApi } from "@/app/api/consultation/consultationApi";
import { Button } from "@/shared/components/agrofy-ui/ui/button";
import { Input } from "@/shared/components/agrofy-ui/ui/input";
import { Label } from "@/shared/components/agrofy-ui/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/agrofy-ui/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/shared/components/agrofy-ui/ui/dialog";
import { useToast } from "@/shared/hooks";
import type { DetectRequest, DetectResponse } from "@/app/api/stunting/type";

const STATUS_CONFIG = {
  'severely stunted': { color: 'red', bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800', text: 'text-red-700 dark:text-red-400', badge: 'bg-red-100 text-red-700', icon: 'solar:danger-triangle-outline' },
  'stunted':          { color: 'orange', bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-800', text: 'text-orange-700 dark:text-orange-400', badge: 'bg-orange-100 text-orange-700', icon: 'solar:danger-circle-outline' },
  'normal':           { color: 'green', bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800', text: 'text-green-700 dark:text-green-400', badge: 'bg-green-100 text-green-700', icon: 'solar:check-circle-outline' },
  'tinggi':           { color: 'blue', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800', text: 'text-blue-700 dark:text-blue-400', badge: 'bg-blue-100 text-blue-700', icon: 'solar:graph-up-outline' },
};

const StuntingDetectionPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [result, setResult] = useState<DetectResponse | null>(null);
  const [konsulOpen, setKonsulOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);

  const { data: childrenData } = useGetChildren();
  const children = childrenData?.data?.data ?? [];

  const { register, handleSubmit, setValue, control, formState: { errors } } = useForm<DetectRequest>({
    defaultValues: { measurement_date: new Date().toISOString().split('T')[0] },
  });

  const childId = useWatch({ control, name: "child_id" });

  useEffect(() => {
    const preselect = searchParams.get("child_id");
    if (preselect) setValue("child_id", parseInt(preselect));
  }, [searchParams, setValue]);

  const detectMutation = useDetectStunting({
    onSuccess: (res) => {
      setResult(res.data.data);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    onError: () => toast.error("Gagal melakukan deteksi. Pastikan server ML aktif."),
  });

  const { data: usersData } = useGetUsers({ role: "dokter" });
  const doctors = usersData?.data?.data ?? [];

  const [isSending, setIsSending] = useState(false);

  const createConsultationMutation = useCreateConsultation({
    onError: () => toast.error("Gagal membuat konsultasi"),
  });

  const handleKonsultasi = async () => {
    if (!selectedDoctorId || !result) return;
    setIsSending(true);
    try {
      const konsul = await createConsultationMutation.mutateAsync({
        health_worker_id: selectedDoctorId,
        child_id: result.result.child_id,
        subject: `Konsultasi hasil deteksi stunting — ${result.advice.label}`,
      });
      const konsulId = konsul.data.data.id;
      const ageMonths = selectedChild?.age_in_months ?? result.result.age ?? result.age_months ?? 0;
      const attachment = JSON.stringify({
        type: 'stunting_result',
        child_name: result.child.name,
        prediction_result: result.result.prediction_result,
        label: result.advice.label,
        z_score: result.z_score,
        age_months: ageMonths,
        height: result.result.height,
        measurement_date: result.result.measurement_date,
      });
      await consultationApi.sendMessage(konsulId, {
        message: `Halo dokter, saya ingin berkonsultasi mengenai hasil deteksi stunting anak saya.`,
        attachment,
      });
      toast.success("Berhasil dikirim ke dokter!");
      setKonsulOpen(false);
      navigate("/consultation");
    } catch {
      toast.error("Gagal mengirim konsultasi");
    } finally {
      setIsSending(false);
    }
  };

  const onSubmit = (data: DetectRequest) => detectMutation.mutate(data);

  const selectedChild = children.find(c => c.id === Number(childId));
  const cfg = result ? STATUS_CONFIG[result.result.prediction_result] : null;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate("/children")} className="h-8 w-8 p-0">
          <Icon icon="solar:alt-arrow-left-outline" width={18} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Deteksi Risiko Stunting</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Deteksi risiko stunting menggunakan AI (Artificial Neural Network)</p>
        </div>
      </div>

      {/* Result */}
      {result && cfg && (
        <div className={`rounded-xl border-2 ${cfg.border} ${cfg.bg} p-6 space-y-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${cfg.badge}`}>
                <Icon icon={cfg.icon} width={26} />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Hasil Deteksi</p>
                <h2 className={`text-xl font-bold ${cfg.text}`}>{result.advice.label}</h2>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 dark:text-gray-400">Z-score TB/U</p>
              <p className={`text-2xl font-bold ${cfg.text}`}>{result.z_score.toFixed(2)}</p>
            </div>
          </div>

          <p className={`text-sm ${cfg.text} font-medium`}>{result.advice.message}</p>

          {/* WHO Reference Chart */}
          {result.who_ref && (() => {
            const ref = result.who_ref;
            const childH = Number(result.result.height);
            const bars = [
              { label: '-3 SD', val: ref.SD3neg, color: '#ef4444' },
              { label: '-2 SD', val: ref.SD2neg, color: '#f97316' },
              { label: '-1 SD', val: ref.SD1neg, color: '#eab308' },
              { label: 'Median', val: ref.median,  color: '#22c55e' },
              { label: '+1 SD', val: ref.SD1,     color: '#3b82f6' },
              { label: '+2 SD', val: ref.SD2,     color: '#6366f1' },
              { label: '+3 SD', val: ref.SD3,     color: '#8b5cf6' },
            ];
            const allVals = [...bars.map(b => b.val), childH];
            const minV = Math.min(...allVals) - 2;
            const maxV = Math.max(...allVals) + 2;
            const range = maxV - minV;
            const chartH = 160;
            const toY = (v: number) => chartH - ((v - minV) / range) * chartH;
            const barW = 36;
            const gap = 12;
            const totalW = bars.length * (barW + gap) + gap;
            const childLineY = toY(childH);
            return (
              <div className="bg-white/60 dark:bg-black/20 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wide">
                  Referensi Standar WHO — TB/U usia {result.result.age || result.age_months} bulan
                </p>
                <div className="overflow-x-auto">
                  <svg width={totalW} height={chartH + 48} style={{ display: 'block', margin: '0 auto' }}>
                    {/* Grid lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map(t => {
                      const y = t * chartH;
                      const v = maxV - t * range;
                      return (
                        <g key={t}>
                          <line x1={0} y1={y} x2={totalW} y2={y} stroke="#e5e7eb" strokeWidth={1} strokeDasharray="4 2" />
                          <text x={2} y={y - 2} fontSize={9} fill="#9ca3af">{v.toFixed(1)}</text>
                        </g>
                      );
                    })}
                    {/* Bars */}
                    {bars.map((b, i) => {
                      const x = gap + i * (barW + gap);
                      const barH = ((b.val - minV) / range) * chartH;
                      const y = chartH - barH;
                      return (
                        <g key={b.label}>
                          <rect x={x} y={y} width={barW} height={barH} fill={b.color} opacity={0.75} rx={3} />
                          <text x={x + barW / 2} y={y - 3} textAnchor="middle" fontSize={9} fill="#374151">{b.val}</text>
                          <text x={x + barW / 2} y={chartH + 12} textAnchor="middle" fontSize={9} fill="#6b7280">{b.label}</text>
                        </g>
                      );
                    })}
                    {/* Garis tinggi anak */}
                    <line x1={0} y1={childLineY} x2={totalW} y2={childLineY} stroke="#ef4444" strokeWidth={2} strokeDasharray="5 3" />
                    <text x={totalW - 4} y={childLineY - 4} textAnchor="end" fontSize={10} fill="#ef4444" fontWeight="bold">
                      Anak: {childH} cm
                    </text>
                  </svg>
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-0.5 bg-red-500 border-dashed border-t-2 border-red-500" />
                    <span className="text-[11px] text-gray-500">Tinggi anak: <strong className="text-red-600">{childH} cm</strong></span>
                  </div>
                  <span className="text-[11px] text-gray-400">Z-score TB/U: <strong className="text-gray-700 dark:text-gray-300">{result.z_score.toFixed(2)}</strong></span>
                </div>
              </div>
            );
          })()}

          {/* Tindakan */}
          {result.advice.steps && result.advice.steps.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">Tindakan yang Disarankan</p>
              <ol className="space-y-1.5">
                {result.advice.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${cfg.badge}`}>{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Stimulasi Tumbuh Kembang */}
          {result.advice.stimulasi && result.advice.stimulasi.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">Stimulasi Tumbuh Kembang (Sesuai Usia)</p>
              <ol className="space-y-1.5">
                {result.advice.stimulasi.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Saran Makanan */}
          <div>
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">Rekomendasi Makanan</p>
            <div className="grid grid-cols-2 gap-2">
              {result.foods.slice(0, 6).map((food, i) => (
                <div key={i} className="bg-white/60 dark:bg-black/20 rounded-lg p-2.5 flex items-start gap-2">
                  <Icon icon="solar:plate-outline" className={cfg.text} width={16} />
                  <div>
                    <p className="text-xs font-semibold text-gray-800 dark:text-white">{food.name}</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-2">{food.benefit}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setResult(null)}>
              <Icon icon="solar:refresh-outline" width={14} /> Deteksi Ulang
            </Button>
            <Button size="sm" className="bg-[#0152EA] hover:bg-blue-700 text-white gap-2" onClick={() => navigate(`/monitoring?child_id=${result.result.child_id}`)}>
              <Icon icon="solar:chart-outline" width={14} /> Lihat Monitoring
            </Button>
            <Button size="sm" variant="outline" className="gap-2" onClick={() => navigate("/food-recommendations")}>
              <Icon icon="solar:plate-outline" width={14} /> Semua Rekomendasi
            </Button>
            <Button size="sm" variant="outline" className="gap-2 border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-400" onClick={() => setKonsulOpen(true)}>
              <Icon icon="solar:chat-round-dots-outline" width={14} /> Konsultasikan ke Dokter
            </Button>
          </div>
        </div>
      )}

      {/* Form */}
      {!result && (
        <div className="bg-white dark:bg-darkgray rounded-xl border border-gray-200 dark:border-darkborder p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-5">Input Data Pemeriksaan</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <Label>Pilih Anak <span className="text-red-500">*</span></Label>
              <Select value={childId?.toString() ?? ""} onValueChange={(v) => setValue("child_id", parseInt(v))}>
                <SelectTrigger><SelectValue placeholder="Pilih anak yang akan diperiksa..." /></SelectTrigger>
                <SelectContent>
                  {children.length === 0
                    ? <SelectItem value="none" disabled>Belum ada data anak — tambah dulu</SelectItem>
                    : children.map(c => (
                        <SelectItem key={c.id} value={c.id.toString()}>
                          {c.name} ({c.gender === 'laki-laki' ? '♂' : '♀'} · {c.age_in_months} bulan)
                        </SelectItem>
                      ))
                  }
                </SelectContent>
              </Select>
              {errors.child_id && <p className="text-xs text-red-500">Pilih anak terlebih dahulu</p>}
            </div>

            {selectedChild && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 flex items-center gap-3">
                <Icon icon="solar:info-circle-outline" className="text-blue-600" width={18} />
                <div className="text-sm">
                  <span className="font-medium text-blue-800 dark:text-blue-300">{selectedChild.name}</span>
                  <span className="text-blue-600 dark:text-blue-400"> · {selectedChild.age_in_months} bulan · {selectedChild.gender}</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Tinggi Badan (cm) <span className="text-red-500">*</span></Label>
                <Input type="number" step="0.1" placeholder="Contoh: 75.5"
                  {...register("height", { required: "Tinggi badan wajib diisi", valueAsNumber: true, min: { value: 30, message: "Min 30 cm" }, max: { value: 150, message: "Max 150 cm" } })}
                />
                {errors.height && <p className="text-xs text-red-500">{errors.height.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Berat Badan (kg)</Label>
                <Input type="number" step="0.1" placeholder="Contoh: 8.5" {...register("weight", { valueAsNumber: true })} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Tanggal Pemeriksaan <span className="text-red-500">*</span></Label>
              <Input type="date" {...register("measurement_date", { required: "Tanggal wajib diisi" })} />
              {errors.measurement_date && <p className="text-xs text-red-500">{errors.measurement_date.message}</p>}
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 text-sm text-yellow-800 dark:text-yellow-300">
              <div className="flex items-start gap-2">
                <Icon icon="solar:danger-triangle-outline" width={16} className="flex-shrink-0 mt-0.5" />
                <p>Hasil deteksi bersifat <strong>skrining awal</strong>, bukan diagnosis medis. Selalu konsultasikan dengan tenaga kesehatan.</p>
              </div>
            </div>

            <Button type="submit" disabled={detectMutation.isPending} className="w-full bg-[#0152EA] hover:bg-blue-700 text-white gap-2">
              {detectMutation.isPending
                ? <><Icon icon="solar:refresh-line-duotone" className="animate-spin" width={18} /> Mendeteksi...</>
                : <><Icon icon="solar:medical-kit-outline" width={18} /> Deteksi Sekarang</>
              }
            </Button>
          </form>
        </div>
      )}

      {/* Riwayat singkat */}
      <div className="bg-white dark:bg-darkgray rounded-xl border border-gray-200 dark:border-darkborder p-4">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-sm text-gray-900 dark:text-white">Riwayat Deteksi</p>
          <Button variant="link" size="sm" className="text-[#0152EA] text-xs" onClick={() => navigate("/detection-history")}>
            Lihat semua →
          </Button>
        </div>
      </div>

      {/* Dialog Konsultasi */}
      <Dialog open={konsulOpen} onOpenChange={setKonsulOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icon icon="solar:chat-round-dots-outline" width={20} className="text-purple-600" />
              Konsultasikan ke Dokter
            </DialogTitle>
          </DialogHeader>

          {result && (
            <div className="space-y-4">
              {/* Preview hasil deteksi */}
              <div className={`rounded-xl border-2 p-4 ${cfg?.border} ${cfg?.bg}`}>
                <p className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wide">Hasil yang akan dikirim</p>
                <div className="flex items-center gap-3">
                  <Icon icon={cfg?.icon ?? ''} width={24} className={cfg?.text} />
                  <div>
                    <p className={`font-bold text-sm ${cfg?.text}`}>{result.advice.label}</p>
                    <p className="text-xs text-gray-500">{result.child.name} · {selectedChild?.age_in_months ?? result.result.age ?? result.age_months} bulan · Z-score: {result.z_score.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Pilih dokter */}
              <div className="space-y-1.5">
                <Label>Pilih Dokter <span className="text-red-500">*</span></Label>
                <Select
                  value={selectedDoctorId?.toString() ?? ""}
                  onValueChange={(v) => setSelectedDoctorId(parseInt(v))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih dokter..." />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.length === 0
                      ? <SelectItem value="none" disabled>Tidak ada dokter tersedia</SelectItem>
                      : doctors.map((d) => (
                          <SelectItem key={d.id} value={d.id.toString()}>{d.name}</SelectItem>
                        ))
                    }
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setKonsulOpen(false)}>Batal</Button>
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white gap-2"
              disabled={!selectedDoctorId || isSending}
              onClick={handleKonsultasi}
            >
              {isSending
                ? <Icon icon="solar:refresh-line-duotone" className="animate-spin" width={16} />
                : <Icon icon="solar:plain-2-outline" width={16} />
              }
              Kirim ke Dokter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StuntingDetectionPage;
