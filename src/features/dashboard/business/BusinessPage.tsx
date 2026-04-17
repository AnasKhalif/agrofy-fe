import { Box, Grid } from "@mui/material";
import { useState } from "react";
import DatePill from "@/shared/components/agrofy-ui-legacy/DatePill/DatePill";
import OmzetCard from "./components/OmzetCard";
import OmzetTrendCard from "./components/OmzetTrendCard";
import TopDoctor from "./components/TopDoctor";
import { useGetAdminDashboard } from "@/app/api/dashboard/useDashboardApi";
import { useGetConsultations } from "@/app/api/consultation/useConsultationApi";

const getMonthKey = (date: Date | string) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

export default function BusinessPage() {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const { data: dashboardData } = useGetAdminDashboard();
  const { data: consultationsData } = useGetConsultations();

  const dashboard = dashboardData?.data?.data;
  const consultations = consultationsData?.data?.data ?? [];

  const currentMonthKey = getMonthKey(currentDate);
  const previousDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
  const previousMonthKey = getMonthKey(previousDate);

  const monthlyDetections = (dashboard?.monthly_detections ?? []).reduce((acc, item) => {
    acc[item.month] = Number(item.total ?? 0);
    return acc;
  }, {} as Record<string, number>);

  const statusCounts = dashboard?.status_counts ?? {};
  const normalCount = Number(statusCounts.normal ?? 0);
  const stuntedCount = Number(statusCounts.stunted ?? 0);
  const severelyStuntedCount = Number(statusCounts["severely stunted"] ?? 0);
  const highCount = Number(statusCounts.tinggi ?? 0);
  const needAttentionCount = stuntedCount + severelyStuntedCount;

  const currentMonthDetections = monthlyDetections[currentMonthKey] ?? 0;

  const currentMonthConsultations = consultations.filter(
    (item) => getMonthKey(item.created_at) === currentMonthKey,
  );

  const previousMonthConsultations = consultations.filter(
    (item) => getMonthKey(item.created_at) === previousMonthKey,
  );

  const currentParentIds = new Set(
    currentMonthConsultations
      .map((item) => Number(item.parent_id))
      .filter((id) => !Number.isNaN(id)),
  );

  const previousParentIds = new Set(
    previousMonthConsultations
      .map((item) => Number(item.parent_id))
      .filter((id) => !Number.isNaN(id)),
  );

  const historicalParentIds = new Set(
    consultations
      .filter((item) => getMonthKey(item.created_at) < currentMonthKey)
      .map((item) => Number(item.parent_id))
      .filter((id) => !Number.isNaN(id)),
  );

  const newPatientThisMonth = Array.from(currentParentIds).filter(
    (id) => !historicalParentIds.has(id),
  ).length;

  const repeatPatientThisMonth = Math.max(currentParentIds.size - newPatientThisMonth, 0);
  const totalPatientsThisMonth = currentParentIds.size;
  const totalPatientsLastMonth = previousParentIds.size;

  const returningPatientsCount = Array.from(currentParentIds).filter((id) => previousParentIds.has(id)).length;

  // get previous month and next month function
  const prevMonth = () => {
    const d = new Date(currentDate);
    d.setDate(1);
    d.setMonth(d.getMonth() - 1);
    setCurrentDate(d);
  };

  const nextMonth = () => {
    const d = new Date(currentDate);
    d.setDate(1);
    d.setMonth(d.getMonth() + 1);
    setCurrentDate(d);
  };

  return (
    <Box sx={{ p: 0 }}>
      <Box display={"flex"} justifyContent="end" alignItems="center">
        <DatePill
          date={currentDate}
          onPrev={prevMonth}
          onNext={nextMonth}
          showBell={false}
        />
      </Box>

      {/* Omzet grid card */}
      <Grid container spacing={2} sx={{ mt: "1rem" }}>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <OmzetCard
            label="Deteksi Bulan Ini"
            value={currentMonthDetections}
            description={`Normal: ${normalCount} | Perlu perhatian: ${needAttentionCount}`}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <OmzetCard
            label="Pasien Bulan Ini"
            value={totalPatientsThisMonth}
            description={`${newPatientThisMonth} pasien baru | ${repeatPatientThisMonth} pasien repeat`}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <OmzetCard
            label="Status Normal"
            value={normalCount}
            description={`Akumulasi status normal dari total deteksi`}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <OmzetCard
            label="Butuh Perhatian"
            value={needAttentionCount}
            description={`Pendek: ${stuntedCount} | Sangat pendek: ${severelyStuntedCount} | Tinggi: ${highCount}`}
          />
        </Grid>
      </Grid>

      {/* Omzet trend - wide card row */}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <OmzetTrendCard title="Tren Aktivitas" />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TopDoctor />
        </Grid>
      </Grid>
    </Box>
  );
}
