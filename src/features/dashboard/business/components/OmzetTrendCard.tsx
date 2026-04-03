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

export default function OmzetTrendCard({
  title = "Omzet Trend",
}: {
  title?: string;
}) {
  const theme = useTheme();
  const now = new Date();
  const currentMonthValue = `${String(now.getMonth() + 1).padStart(2, "0")}-${now.getFullYear()}`;
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthValue);

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

  // Sample data - static values to avoid impure function error
  const labels = useMemo(
    () => Array.from({ length: 30 }, (_, i) => `${i + 1}`),
    [],
  );
  const productSeries = useMemo(
    () => [
      5000, 7000, 6500, 8000, 9000, 7500, 10000, 9500, 11000, 10500, 12000,
      11500, 13000, 12500, 14000, 13500, 15000, 14500, 13000, 12000, 11000,
      10000, 9000, 8000, 7000, 8500, 9500, 10500, 11500, 12500,
    ],
    [],
  );
  const treatmentSeries = useMemo(
    () => [
      3000, 4000, 3500, 5000, 6000, 4500, 7000, 6500, 8000, 7500, 9000, 8500,
      10000, 9500, 11000, 10500, 12000, 11500, 10000, 9000, 8000, 7000, 6000,
      5000, 4000, 5500, 6500, 7500, 8500, 9500,
    ],
    [],
  );

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
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {title}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: theme.palette.text.secondary }}
            >
              Laporan harian pemasukan klinik
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
                <Typography
                  variant="body2"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  Produk
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
                <Typography
                  variant="body2"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  Treatment
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
              Laporan Penjualan
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
                max: 20000,
                tickLabelStyle: { fill: theme.palette.text.secondary },
                disableLine: true,
              },
            ]}
            series={[
              {
                data: treatmentSeries,
                color: "#7ED1FF",
                area: true,
                showMark: false,
                curve: "natural",
              },
              {
                data: productSeries,
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
