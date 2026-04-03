import { Box, Grid } from "@mui/material";
import { useState } from "react";
import DatePill from "@/shared/components/agrofy-ui-legacy/DatePill/DatePill";
import OmzetCard from "./components/OmzetCard";
import OmzetTrendCard from "./components/OmzetTrendCard";
import TopDoctor from "./components/TopDoctor";
import MonthlyAppointment from "./components/MonthlyAppointment";
import PopularTreatment from "./components/PopularTreatment";
import GoogleAnalyticsCard from "./components/GoogleAnalytics";
import PopularProductsTable from "./components/PopularProductsTable";

export default function BusinessPage() {
  const [currentDate, setCurrentDate] = useState(() => new Date());

  // Sample data - will be replaced with API hooks later
  const newPatientThisMonth = 0;
  const repeatPatientThisMonth = 0;
  const totalPatientsThisMonth = 0;
  const totalPatientsLastMonth = 0;
  const month = 0;
  const lastMonth = 0;

  // get previous month name
  const prevMonthName = new Intl.DateTimeFormat("id-ID", {
    month: "long",
  }).format(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

  // calculate upward/downward omzet comparison
  let formattedOmzet = "";

  if (lastMonth === 0) {
    if (month === 0) {
      formattedOmzet = "Sama dengan bulan lalu";
    } else {
      formattedOmzet = "Naik 100% dibanding " + prevMonthName;
    }
  } else if (lastMonth > month) {
    const calculate = ((lastMonth - month) / lastMonth) * 100;
    formattedOmzet = `Turun ${calculate.toFixed(0)}% dibanding ${prevMonthName}`;
  } else if (month > lastMonth) {
    const calculate = ((month - lastMonth) / lastMonth) * 100;
    formattedOmzet = `Naik ${calculate.toFixed(0)}% dibanding ${prevMonthName}`;
  } else {
    formattedOmzet = "Sama dengan bulan lalu";
  }

  // calculate upward/downward patient comparison
  let formattedPatient = "";
  let calculate = 0;
  if (totalPatientsLastMonth === 0) {
    if (totalPatientsThisMonth === 0) {
      formattedPatient = "Sama dengan bulan lalu";
    } else {
      calculate = 100;
      formattedPatient = "Naik 100% dari bulan lalu";
    }
  } else if (totalPatientsLastMonth > totalPatientsThisMonth) {
    calculate =
      ((totalPatientsLastMonth - totalPatientsThisMonth) /
        totalPatientsLastMonth) *
      100;
    formattedPatient = `Turun ${calculate.toFixed(0)}% dari bulan lalu`;
  } else if (totalPatientsThisMonth > totalPatientsLastMonth) {
    calculate =
      ((totalPatientsThisMonth - totalPatientsLastMonth) /
        totalPatientsLastMonth) *
      100;
    formattedPatient = `Naik ${calculate.toFixed(0)}% dari bulan lalu`;
  } else {
    formattedPatient = "Sama dengan bulan lalu";
  }

  // calculate loyality
  let loyality = 0;
  if (totalPatientsThisMonth > 0 && totalPatientsLastMonth > 0) {
    loyality = (totalPatientsThisMonth / totalPatientsLastMonth) * 100;
  }

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

  const rupiah = (n: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 2,
    }).format(n);

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
            label="Omzet Bulan Ini"
            value={rupiah(month)}
            description={formattedOmzet}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <OmzetCard
            label="Pasien Bulan Ini"
            value={totalPatientsThisMonth}
            description={`${newPatientThisMonth} baru | ${repeatPatientThisMonth} repeat`}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <OmzetCard
            label="Pertumbuhan Bulan Ini"
            value={`${calculate.toFixed(0)}%`}
            description={formattedPatient}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <OmzetCard
            label="Angka Loyalitas"
            value={`${loyality.toFixed(0)}%`}
            description={`Dari ${totalPatientsLastMonth}, ${totalPatientsThisMonth} kembali bulan ini`}
          />
        </Grid>
      </Grid>

      {/* Omzet trend - wide card row */}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <OmzetTrendCard />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TopDoctor />
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <MonthlyAppointment />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <PopularTreatment />
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <GoogleAnalyticsCard />
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <PopularProductsTable />
        </Grid>
      </Grid>
    </Box>
  );
}
