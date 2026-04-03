import { Box, Card, CardContent, Typography, useTheme } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";

const monthNames: Record<string, string> = {
  "01": "Jan",
  "02": "Feb",
  "03": "Mar",
  "04": "Apr",
  "05": "May",
  "06": "Jun",
  "07": "Jul",
  "08": "Aug",
  "09": "Sep",
  "10": "Oct",
  "11": "Nov",
  "12": "Dec",
};

const now = new Date();
const defaultSixMonthLabels = Array.from({ length: 6 })
  .map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    return monthNames[String(d.getMonth() + 1).padStart(2, "0")];
  })
  .reverse();

export default function MonthlyAppointment() {
  const theme = useTheme();

  // Sample data
  const produkSeriesData = [100, 120, 90, 150, 110, 130];
  const treatmentSeriesData = [80, 90, 70, 110, 85, 95];

  return (
    <Card
      elevation={1}
      sx={{ borderRadius: 2, height: "254px", px: "30px", py: "25px" }}
    >
      <CardContent
        sx={{ height: "100%", display: "flex", flexDirection: "row", gap: 1 }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            gap: 4,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "text.primary" }}
              >
                Jumlah Appointment Bulanan
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 6, mb: 2 }}>
            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 1,
                  pl: 1,
                }}
              >
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    bgcolor: "primary.main",
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  Produk
                </Typography>
              </Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: 600, color: "text.primary", pl: 1 }}
              >
                {produkSeriesData[produkSeriesData.length - 1]}
              </Typography>
            </Box>

            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 1,
                  pl: 1,
                }}
              >
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    bgcolor: "grey.200",
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  Treatment
                </Typography>
              </Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: 600, color: "text.primary", pl: 1 }}
              >
                {treatmentSeriesData[treatmentSeriesData.length - 1]}
              </Typography>
            </Box>
          </Box>
        </Box>

        <BarChart
          xAxis={[
            {
              scaleType: "band",
              data: defaultSixMonthLabels,
              tickLabelStyle: { fill: "#94A3B8", fontSize: 12 },
              disableLine: true,
              disableTicks: true,
            },
          ]}
          yAxis={[{ position: "none" }]}
          series={[
            {
              data: produkSeriesData,
              label: "Produk",
              color: theme.palette.primary.main,
            },
            {
              data: treatmentSeriesData,
              label: "Treatment",
              color: theme.palette.grey[200],
            },
          ]}
          height={220}
          borderRadius={6}
          grid={{ horizontal: false, vertical: false }}
          slotProps={{ legend: { sx: { display: "none" } } }}
        />
      </CardContent>
    </Card>
  );
}
