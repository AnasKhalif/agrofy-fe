import {
  Box,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { LineChart } from "@mui/x-charts/LineChart";
import { useState, useMemo } from "react";
import { useGetStuntingHistory } from "@/app/api/stunting/useStuntingApi";
import { useGetConsultations } from "@/app/api/consultation/useConsultationApi";

export default function OmzetTrendCard({
  title = "Tren Aktivitas",
}: {
  title?: string;
}) {
  const theme = useTheme();
  const { data: stuntingHistoryData } = useGetStuntingHistory();
  const { data: consultationsData } = useGetConsultations();

  const now = new Date();
  const currentMonthValue = `${String(now.getMonth() + 1).padStart(2, "0")}-${now.getFullYear()}`;
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthValue);

  const history = useMemo(
    () => stuntingHistoryData?.data?.data ?? [],
    [stuntingHistoryData],
  );
  const consultations = useMemo(
    () => consultationsData?.data?.data ?? [],
    [consultationsData],
  );

  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const { labels, detectionSeries, consultationSeries, maxValue } = useMemo(() => {
    const [monthStr, yearStr] = selectedMonth.split("-");
    const month = Number(monthStr);
    const year = Number(yearStr);

    if (!month || !year) {
      return {
        labels: Array.from({ length: 30 }, (_, i) => `${i + 1}`),
        detectionSeries: Array.from({ length: 30 }, () => 0),
        consultationSeries: Array.from({ length: 30 }, () => 0),
        maxValue: 10,
      };
    }

    const daysInMonth = new Date(year, month, 0).getDate();
    const localLabels = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`);
    const localDetections = Array.from({ length: daysInMonth }, () => 0);
    const localConsultations = Array.from({ length: daysInMonth }, () => 0);

    history.forEach((item) => {
      const date = new Date(item.measurement_date);
      if (date.getFullYear() !== year || date.getMonth() + 1 !== month) return;
      const dayIndex = date.getDate() - 1;
      if (dayIndex >= 0 && dayIndex < daysInMonth) {
        localDetections[dayIndex] += 1;
      }
    });

    consultations.forEach((item) => {
      const date = new Date(item.created_at);
      if (date.getFullYear() !== year || date.getMonth() + 1 !== month) return;
      const dayIndex = date.getDate() - 1;
      if (dayIndex >= 0 && dayIndex < daysInMonth) {
        localConsultations[dayIndex] += 1;
      }
    });

    const seriesMax = Math.max(...localDetections, ...localConsultations, 1);

    return {
      labels: localLabels,
      detectionSeries: localDetections,
      consultationSeries: localConsultations,
      maxValue: Math.ceil(seriesMax * 1.2),
    };
  }, [consultations, history, selectedMonth]);

  return (
    <Card
      elevation={0}
      sx={{
        height: "405px",
        borderRadius: "8px",
        bgcolor: theme.palette.background.paper,
        boxShadow: "0px 6px 18px rgba(29, 36, 60, 0.04)",
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {title}
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              Laporan harian deteksi & konsultasi
            </Typography>
            <Box display="flex" gap={2} alignItems="center" mt={1}>
              <Box display="flex" alignItems="center" gap={1}>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    bgcolor: "#0A62FF",
                  }}
                />
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  Deteksi
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    bgcolor: "#7ED1FF",
                  }}
                />
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  Konsultasi
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box display="flex" gap={1} alignItems="center">
            <Select
              size="small"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {Array.from({ length: 12 }).map((_, i) => {
                const month1Based = i + 1;
                const year = now.getFullYear();
                const value = `${String(month1Based).padStart(2, "0")}-${year}`;
                return (
                  <MenuItem key={`${i}-${year}`} value={value}>
                    {monthNames[i]} {year}
                  </MenuItem>
                );
              })}
            </Select>
            <Button
              variant="contained"
              color="primary"
              size="small"
              sx={{ textTransform: "none", borderRadius: "8px" }}
            >
              Laporan Aktivitas
            </Button>
          </Box>
        </Box>

        <Box sx={{ height: 300 }}>
          <LineChart
            xAxis={[
              {
                scaleType: "point",
                data: labels,
                tickLabelStyle: { fill: theme.palette.text.secondary },
                disableLine: true,
                disableTicks: true,
              },
            ]}
            yAxis={[
              {
                position: "left",
                min: 0,
                max: maxValue,
                tickLabelStyle: { fill: theme.palette.text.secondary },
                disableLine: true,
              },
            ]}
            series={[
              {
                data: consultationSeries,
                color: "#7ED1FF",
                area: true,
                showMark: false,
                curve: "natural",
              },
              {
                data: detectionSeries,
                color: "#0A62FF",
                area: false,
                showMark: false,
                curve: "natural",
              },
            ]}
            height={300}
            margin={{ top: 10, right: 10, bottom: 30, left: 10 }}
            grid={{ horizontal: true, vertical: false }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
