import { useMemo } from "react";
import type { WfaCurvePoint, StuntingResult } from "@/app/api/stunting/type";

interface KmsWfaChartProps {
  curve: WfaCurvePoint[];
  history: StuntingResult[];
  gender: 'laki-laki' | 'perempuan';
  childName?: string;
  asiEksklusif?: boolean | null;
}

/**
 * KBM (Kenaikan Berat Minimal) per usia bulan, sumber Buku KIA Kemenkes 2020.
 * Bulan 0 tidak ada karena baseline = berat lahir.
 */
const KBM_GRAMS: Record<number, number> = {
  1: 800, 2: 900, 3: 800, 4: 600, 5: 500, 6: 400,
  7: 300, 8: 300, 9: 300,
  10: 200, 11: 200, 12: 200, 13: 200, 14: 200, 15: 200, 16: 200, 17: 200,
  18: 200, 19: 200, 20: 200, 21: 200, 22: 200, 23: 200, 24: 200,
};

const KmsWfaChart = ({ curve, history, gender, childName, asiEksklusif }: KmsWfaChartProps) => {
  const padding = { top: 24, right: 28, bottom: 56, left: 44 };
  const width = 920;
  const height = 460;
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const xMin = 0;
  const xMax = 24;

  const yMin = 1;
  const yMax = useMemo(() => {
    const lastIn = curve.find(c => c.age === xMax) ?? curve[curve.length - 1];
    const ceilTo = Math.ceil((lastIn?.SD3 ?? 18) + 1);
    return Math.max(18, ceilTo);
  }, [curve]);

  const xScale = (age: number) => padding.left + ((age - xMin) / (xMax - xMin)) * innerW;
  const yScale = (kg: number) => padding.top + innerH - ((kg - yMin) / (yMax - yMin)) * innerH;

  const visibleCurve = curve.filter(p => p.age >= xMin && p.age <= xMax);

  const buildPath = (key: keyof Omit<WfaCurvePoint, 'age'>) =>
    visibleCurve
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xScale(p.age).toFixed(2)} ${yScale(p[key]).toFixed(2)}`)
      .join(' ');

  // Zona warna ala KMS: di bawah median = merah/kuning (kurang), di atas = hijau (sehat)
  // Buku KIA: garis hijau (median), garis kuning/oranye (-2SD), garis merah (-3SD), garis di atas median = hijau gelap & oranye atas
  const lines = [
    { key: 'SD3' as const,    color: '#a855f7', dash: '4 3', label: '+3 SD' },
    { key: 'SD2' as const,    color: '#3b82f6', dash: '4 3', label: '+2 SD' },
    { key: 'SD1' as const,    color: '#22c55e', dash: '4 3', label: '+1 SD' },
    { key: 'median' as const, color: '#16a34a', dash: '0',   label: 'Median' },
    { key: 'SD1neg' as const, color: '#84cc16', dash: '4 3', label: '-1 SD' },
    { key: 'SD2neg' as const, color: '#f59e0b', dash: '4 3', label: '-2 SD (Garis Kuning)' },
    { key: 'SD3neg' as const, color: '#ef4444', dash: '4 3', label: '-3 SD (Garis Merah)' },
  ];

  // Build zone areas (ala KMS warna background)
  const zoneAreaPath = (topKey: keyof Omit<WfaCurvePoint, 'age'>, botKey: keyof Omit<WfaCurvePoint, 'age'>) => {
    const top = visibleCurve.map(p => `${xScale(p.age).toFixed(2)},${yScale(p[topKey]).toFixed(2)}`).join(' L ');
    const bot = [...visibleCurve].reverse().map(p => `${xScale(p.age).toFixed(2)},${yScale(p[botKey]).toFixed(2)}`).join(' L ');
    return `M ${top} L ${bot} Z`;
  };

  const childPoints = useMemo(() => {
    // Dedup per usia bulan: pakai pengukuran TERBARU (by measurement_date) untuk tiap age,
    // supaya grafik halus tidak zigzag karena banyak input di bulan yang sama.
    const byAge = new Map<number, { id: number; age: number; weight: number; date: string; prediction: string }>();
    history
      .filter(h => h.weight !== null && h.weight !== undefined && h.age >= xMin && h.age <= xMax)
      .forEach(h => {
        const point = {
          id: h.id,
          age: h.age,
          weight: Number(h.weight),
          date: h.measurement_date,
          prediction: h.prediction_result,
        };
        const existing = byAge.get(h.age);
        if (!existing || new Date(point.date).getTime() > new Date(existing.date).getTime()) {
          byAge.set(h.age, point);
        }
      });
    return Array.from(byAge.values()).sort((a, b) => a.age - b.age);
  }, [history]);

  const childLine = childPoints.length >= 2
    ? childPoints
        .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xScale(p.age).toFixed(2)} ${yScale(p.weight).toFixed(2)}`)
        .join(' ')
    : null;

  // Hitung N/T per pengukuran: bandingkan kenaikan BB dari titik sebelumnya vs KBM minimum.
  // N (Naik) = kenaikan ≥ KBM minimum bulan tsb
  // T (Tidak naik) = kenaikan < KBM minimum atau menurun
  const monthlyTable = useMemo(() => {
    const byAge = new Map<number, { weight: number; date: string }>();
    childPoints.forEach(p => byAge.set(p.age, { weight: p.weight, date: p.date }));

    return Array.from({ length: 25 }, (_, age) => {
      const point = byAge.get(age);
      if (!point) return { age, weight: null as number | null, kbm: KBM_GRAMS[age] ?? null, status: null as 'N' | 'T' | null };

      // Cari titik sebelumnya untuk hitung kenaikan
      let prev: { weight: number; ageMo: number } | null = null;
      for (let a = age - 1; a >= 0; a--) {
        const p = byAge.get(a);
        if (p) { prev = { weight: p.weight, ageMo: a }; break; }
      }
      const kbm = KBM_GRAMS[age] ?? null;
      let status: 'N' | 'T' | null = null;
      if (prev && kbm !== null) {
        // Round ke 1 desimal dulu untuk hindari floating point precision (0.2 jadi 0.19999...)
        const gainGrams = Math.round((point.weight - prev.weight) * 100) * 10;
        // Per bulan KBM (kalau jarak > 1 bulan, KBM proporsional ke jumlah bulan)
        const monthsGap = age - prev.ageMo;
        const requiredGain = kbm * monthsGap;
        // Toleransi 1g untuk anti floating-point edge cases
        status = gainGrams + 1 >= requiredGain ? 'N' : 'T';
      }
      return { age, weight: point.weight, kbm, status };
    });
  }, [childPoints]);

  const xTicks = Array.from({ length: 25 }, (_, i) => i);
  const yTicks = Array.from({ length: yMax - yMin + 1 }, (_, i) => yMin + i);

  return (
    <div className="w-full">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            Kurva KMS — Berat Badan menurut Umur (BB/U)
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Standar WHO • {gender === 'laki-laki' ? 'Laki-laki' : 'Perempuan'} • 0–24 bulan
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[10px]">
          <span className="flex items-center gap-1"><span className="w-3 h-2 rounded-sm bg-red-200 inline-block" />Gizi Buruk (&lt;-3SD)</span>
          <span className="flex items-center gap-1"><span className="w-3 h-2 rounded-sm bg-yellow-200 inline-block" />Gizi Kurang</span>
          <span className="flex items-center gap-1"><span className="w-3 h-2 rounded-sm bg-green-200 inline-block" />Gizi Baik</span>
          <span className="flex items-center gap-1"><span className="w-3 h-2 rounded-sm bg-blue-200 inline-block" />Risiko Lebih</span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-darkborder bg-white dark:bg-darkgray">
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" style={{ minWidth: 700, display: 'block' }}>
          {/* Background zona warna ala KMS */}
          <path d={zoneAreaPath('SD3neg', 'SD3neg')} fill="none" />
          <path d={`M ${xScale(xMin)} ${yScale(yMin)} L ${xScale(xMax)} ${yScale(yMin)} L ${visibleCurve.map(p => `${xScale(p.age)},${yScale(p.SD3neg)}`).reverse().join(' L ')} Z`} fill="#fee2e2" opacity={0.55} />
          <path d={zoneAreaPath('SD2neg', 'SD3neg')} fill="#fef9c3" opacity={0.55} />
          <path d={zoneAreaPath('SD2', 'SD2neg')} fill="#dcfce7" opacity={0.55} />
          <path d={zoneAreaPath('SD3', 'SD2')} fill="#dbeafe" opacity={0.55} />
          <path d={`M ${xScale(xMin)} ${yScale(yMax)} L ${xScale(xMax)} ${yScale(yMax)} L ${visibleCurve.map(p => `${xScale(p.age)},${yScale(p.SD3)}`).reverse().join(' L ')} Z`} fill="#ede9fe" opacity={0.45} />

          {/* Y grid + labels */}
          {yTicks.map(t => (
            <g key={`y${t}`}>
              <line
                x1={padding.left}
                y1={yScale(t)}
                x2={width - padding.right}
                y2={yScale(t)}
                stroke="#e5e7eb"
                strokeWidth={t % 2 === 0 ? 0.8 : 0.4}
                strokeDasharray={t % 2 === 0 ? '0' : '2 3'}
              />
              <text x={padding.left - 6} y={yScale(t) + 3} textAnchor="end" fontSize={10} fill="#6b7280">{t}</text>
            </g>
          ))}

          {/* X grid + labels */}
          {xTicks.map(t => (
            <g key={`x${t}`}>
              <line
                x1={xScale(t)}
                y1={padding.top}
                x2={xScale(t)}
                y2={height - padding.bottom}
                stroke="#e5e7eb"
                strokeWidth={0.5}
              />
              <text x={xScale(t)} y={height - padding.bottom + 14} textAnchor="middle" fontSize={10} fill="#6b7280">{t}</text>
            </g>
          ))}

          {/* Sumbu */}
          <line x1={padding.left} y1={padding.top} x2={padding.left} y2={height - padding.bottom} stroke="#9ca3af" strokeWidth={1} />
          <line x1={padding.left} y1={height - padding.bottom} x2={width - padding.right} y2={height - padding.bottom} stroke="#9ca3af" strokeWidth={1} />

          {/* Axis labels */}
          <text
            transform={`rotate(-90, ${padding.left - 30}, ${padding.top + innerH / 2})`}
            x={padding.left - 30}
            y={padding.top + innerH / 2}
            textAnchor="middle"
            fontSize={11}
            fill="#374151"
            fontWeight={600}
          >
            Berat Badan (kg)
          </text>
          <text
            x={padding.left + innerW / 2}
            y={height - 8}
            textAnchor="middle"
            fontSize={11}
            fill="#374151"
            fontWeight={600}
          >
            Umur (Bulan)
          </text>

          {/* Garis-garis WHO */}
          {lines.map(l => (
            <path
              key={l.key}
              d={buildPath(l.key)}
              fill="none"
              stroke={l.color}
              strokeWidth={l.key === 'median' ? 2 : 1.4}
              strokeDasharray={l.dash}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {/* Label garis di sisi kanan */}
          {lines.map(l => {
            const last = visibleCurve[visibleCurve.length - 1];
            if (!last) return null;
            return (
              <text
                key={`lbl-${l.key}`}
                x={xScale(last.age) + 4}
                y={yScale(last[l.key]) + 3}
                fontSize={9}
                fill={l.color}
                fontWeight={600}
              >
                {l.key === 'median' ? 'M' : l.label.split(' ')[0]}
              </text>
            );
          })}

          {/* Garis pertumbuhan anak */}
          {childLine && (
            <path
              d={childLine}
              fill="none"
              stroke="#0152EA"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Titik-titik pengukuran anak */}
          {childPoints.map((p) => {
            const cx = xScale(p.age);
            const cy = yScale(p.weight);
            return (
              <g key={p.id}>
                <circle cx={cx} cy={cy} r={5.5} fill="#0152EA" stroke="white" strokeWidth={2} />
                <text x={cx} y={cy - 9} textAnchor="middle" fontSize={9} fill="#0152EA" fontWeight={700}>
                  {p.weight.toFixed(1)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Tabel ala KMS Buku KIA: Umur | BB | KBM | N/T | ASI Eksklusif */}
      <div className="mt-3 overflow-x-auto rounded-lg border border-gray-200 dark:border-darkborder">
        <table className="w-full text-[10px] border-collapse" style={{ minWidth: 700 }}>
          <thead>
            <tr className="bg-gray-50 dark:bg-darkminisidebar">
              <th className="border border-gray-200 dark:border-darkborder px-1 py-1 text-left font-semibold text-gray-700 dark:text-gray-300 sticky left-0 bg-gray-50 dark:bg-darkminisidebar z-10">Umur (Bulan)</th>
              {monthlyTable.map(m => (
                <th key={m.age} className="border border-gray-200 dark:border-darkborder px-1 py-1 text-center font-semibold text-gray-600 dark:text-gray-400 w-7">{m.age}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-200 dark:border-darkborder px-1 py-1 text-gray-700 dark:text-gray-300 sticky left-0 bg-white dark:bg-darkgray z-10">BB (kg)</td>
              {monthlyTable.map(m => (
                <td key={m.age} className="border border-gray-200 dark:border-darkborder px-1 py-1 text-center text-gray-700 dark:text-gray-300">
                  {m.weight !== null ? m.weight.toFixed(1) : ''}
                </td>
              ))}
            </tr>
            <tr>
              <td className="border border-gray-200 dark:border-darkborder px-1 py-1 text-gray-700 dark:text-gray-300 sticky left-0 bg-white dark:bg-darkgray z-10" title="Kenaikan Berat Minimal per bulan (Buku KIA Kemenkes 2020)">
                KBM (gr)
              </td>
              {monthlyTable.map(m => (
                <td key={m.age} className="border border-gray-200 dark:border-darkborder px-1 py-1 text-center text-gray-500 dark:text-gray-500">
                  {m.kbm ?? ''}
                </td>
              ))}
            </tr>
            <tr>
              <td className="border border-gray-200 dark:border-darkborder px-1 py-1 text-gray-700 dark:text-gray-300 sticky left-0 bg-white dark:bg-darkgray z-10" title="Naik (N) bila kenaikan ≥ KBM, Tidak Naik (T) bila kurang">
                N/T
              </td>
              {monthlyTable.map(m => (
                <td
                  key={m.age}
                  className={`border border-gray-200 dark:border-darkborder px-1 py-1 text-center font-bold ${
                    m.status === 'N' ? 'text-green-600 bg-green-50 dark:bg-green-900/20'
                      : m.status === 'T' ? 'text-red-600 bg-red-50 dark:bg-red-900/20'
                      : ''
                  }`}
                >
                  {m.status ?? ''}
                </td>
              ))}
            </tr>
            <tr>
              <td className="border border-gray-200 dark:border-darkborder px-1 py-1 text-gray-700 dark:text-gray-300 sticky left-0 bg-white dark:bg-darkgray z-10" title="ASI Eksklusif (0–6 bulan)">
                ASI Eksklusif
              </td>
              {monthlyTable.map(m => {
                const inAsiRange = m.age >= 0 && m.age <= 6;
                if (!inAsiRange) {
                  return <td key={m.age} className="border border-gray-200 dark:border-darkborder px-1 py-1 bg-gray-100 dark:bg-darkminisidebar/50" />;
                }
                return (
                  <td key={m.age} className="border border-gray-200 dark:border-darkborder px-1 py-1 text-center">
                    {asiEksklusif === true ? (
                      <span className="text-green-600 font-bold">✓</span>
                    ) : asiEksklusif === false ? (
                      <span className="text-red-500 font-bold">✗</span>
                    ) : (
                      <span className="text-gray-300">–</span>
                    )}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mt-2 text-[10px] text-gray-500 dark:text-gray-400 italic">
        <strong>KBM</strong> = Kenaikan Berat Minimal per bulan (sumber: Buku KIA Kemenkes 2020).
        <strong className="ml-2">N</strong> = Naik (≥ KBM), <strong>T</strong> = Tidak Naik (&lt; KBM). Bila <strong>T</strong> 2× berturut-turut atau berat di Bawah Garis Merah, segera rujuk ke fasyankes.
      </p>

      <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-gray-600 dark:text-gray-400">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#0152EA] inline-block border border-white shadow" />
          Berat {childName ?? 'Anak'} ({childPoints.length} titik)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-0.5 bg-green-700 inline-block" />
          Median (BB ideal)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-0.5 bg-yellow-500 inline-block" style={{ borderTop: '2px dashed #f59e0b', height: 0 }} />
          Garis Kuning (-2 SD)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-0.5 bg-red-500 inline-block" style={{ borderTop: '2px dashed #ef4444', height: 0 }} />
          Garis Merah (-3 SD)
        </span>
      </div>

      {childPoints.length === 0 && (
        <p className="mt-2 text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400 rounded p-2">
          Belum ada pengukuran berat badan untuk anak ini di rentang 0–24 bulan. Lakukan deteksi dengan input berat badan untuk plot di kurva KMS.
        </p>
      )}
    </div>
  );
};

export default KmsWfaChart;
