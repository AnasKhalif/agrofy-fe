import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Icon } from "@iconify/react";
import { useGetChildren } from "@/app/api/child/useChildApi";
import { useGetConsultations } from "@/app/api/consultation/useConsultationApi";
import { Input } from "@/shared/components/agrofy-ui/ui/input";
import { Button } from "@/shared/components/agrofy-ui/ui/button";
import { ROUTES } from "@/app/constants/router";

const genderIcon = { "laki-laki": "solar:mars-outline", perempuan: "solar:venus-outline" };
const genderColor = { "laki-laki": "text-blue-600 bg-blue-50", perempuan: "text-pink-600 bg-pink-50" };
const genderAvatar = { "laki-laki": "bg-blue-100 text-blue-600", perempuan: "bg-pink-100 text-pink-600" };

const DoctorPatientsPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const { data, isLoading: isLoadingChildren } = useGetChildren();
  const { data: consultationData, isLoading: isLoadingConsultations } = useGetConsultations();
  const children = data?.data?.data ?? [];
  const consultations = consultationData?.data?.data ?? [];

  const latestConsultationByChildId = useMemo(() => {
    const latestMap = new Map<number, number>();
    consultations.forEach((consultation) => {
      if (!consultation.child_id || latestMap.has(consultation.child_id)) {
        return;
      }

      latestMap.set(consultation.child_id, consultation.id);
    });
    return latestMap;
  }, [consultations]);

  const filteredChildren = useMemo(() => {
    const source = children.filter((child) => latestConsultationByChildId.has(child.id));
    if (!search.trim()) return source;
    const keyword = search.toLowerCase();
    return source.filter((child) => {
      const childName = child.name.toLowerCase().includes(keyword);
      const parentName = child.parent?.name?.toLowerCase().includes(keyword) ?? false;
      return childName || parentName;
    });
  }, [children, latestConsultationByChildId, search]);

  const isLoading = isLoadingChildren || isLoadingConsultations;

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Daftar Pasien</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Lihat data anak pasien dan pantau pertumbuhannya</p>
        </div>
      </div>

      <div className="bg-white dark:bg-darkgray rounded-xl border border-gray-200 dark:border-darkborder p-4">
        <div className="relative w-full max-w-sm">
          <Icon icon="solar:magnifer-outline" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width={16} />
          <Input
            placeholder="Cari nama anak / orang tua..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-darkgray rounded-xl border border-gray-200 dark:border-darkborder p-5 animate-pulse h-44" />
          ))}
        </div>
      ) : filteredChildren.length === 0 ? (
        <div className="bg-white dark:bg-darkgray rounded-xl border border-gray-200 dark:border-darkborder py-20 text-center">
          <Icon icon="solar:user-rounded-outline" width={56} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">Tidak ada data pasien ditemukan</p>
          {search && (
            <Button variant="link" size="sm" className="text-[#0152EA] mt-1" onClick={() => setSearch("")}>
              Hapus pencarian
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredChildren.map((child) => (
            <div key={child.id} className="bg-white dark:bg-darkgray rounded-xl border border-gray-200 dark:border-darkborder p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold ${genderAvatar[child.gender]}`}>
                  {child.name[0]?.toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{child.name}</h3>
                  {child.parent?.name && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Orang Tua: <span className="font-medium text-gray-700 dark:text-gray-300">{child.parent.name}</span>
                    </p>
                  )}
                  <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium mt-1 ${genderColor[child.gender]}`}>
                    <Icon icon={genderIcon[child.gender]} width={11} />
                    {child.gender === "laki-laki" ? "Laki-laki" : "Perempuan"}
                  </span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="bg-gray-50 dark:bg-darkminisidebar rounded-lg p-3">
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Usia</p>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">
                    {child.age_in_months >= 12
                      ? `${Math.floor(child.age_in_months / 12)} thn ${child.age_in_months % 12} bln`
                      : `${child.age_in_months} bulan`}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-darkminisidebar rounded-lg p-3">
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Tgl Lahir</p>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">
                    {new Date(child.date_of_birth).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => navigate(`${ROUTES.DOCTOR.MONITORING}?child_id=${child.id}`)}
                >
                  <Icon icon="solar:chart-outline" className="mr-1" width={13} /> Monitoring
                </Button>
                <Button
                  size="sm"
                  className="flex-1 text-xs bg-[#0152EA] hover:bg-blue-700 text-white"
                  onClick={() => {
                    const consultationId = latestConsultationByChildId.get(child.id);
                    if (consultationId) {
                      navigate(`${ROUTES.DOCTOR.CONSULTATION}?consultation_id=${consultationId}`);
                    }
                  }}
                  disabled={!latestConsultationByChildId.has(child.id)}
                >
                  <Icon icon="solar:chat-round-dots-outline" className="mr-1" width={13} /> Konsultasi
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorPatientsPage;
