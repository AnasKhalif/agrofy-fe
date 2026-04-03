import { PieChart } from "@mui/x-charts/PieChart";
import { Card, CardContent, Typography, Box, Stack } from "@mui/material";

interface PaymentChartItem {
  id: number;
  value: number;
  label: string;
  color: string;
}

const defaultColors = [
  "#0B5FFF",
  "#66C3FF",
  "#24D39A",
  "#FFB33A",
  "#FF6B6B",
  "#8A63FF",
  "#00C2FF",
];

const samplePaymentData: PaymentChartItem[] = [
  { id: 0, value: 35, label: "Cash", color: defaultColors[0] },
  { id: 1, value: 25, label: "Debit", color: defaultColors[1] },
  { id: 2, value: 20, label: "Credit", color: defaultColors[2] },
  { id: 3, value: 15, label: "Transfer", color: defaultColors[3] },
  { id: 4, value: 5, label: "E-Wallet", color: defaultColors[4] },
];

export default function PopularTreatment() {
  return (
    <Card elevation={1} sx={{ borderRadius: 2, p: 2, height: "254px" }}>
      <CardContent sx={{ p: 0 }}>
        <Box
          sx={{
            display: "flex",
            padding: 2,
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Stack direction={"column"} gap={3}>
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, color: "text.primary" }}
              >
                Metode Pembayaran
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mt: 0.5, mb: 1 }}
              >
                Metode yang paling sering digunakan
              </Typography>
            </Box>

            <Stack spacing={1}>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                {samplePaymentData.map((p) => (
                  <Box
                    key={p.id}
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        bgcolor: p.color,
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      {p.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Stack>
          </Stack>

          <Box sx={{ width: 160, height: 160, flexShrink: 0 }}>
            <PieChart
              hideLegend
              series={[
                {
                  data: samplePaymentData,
                  innerRadius: 55,
                  outerRadius: 80,
                  paddingAngle: 0,
                  cornerRadius: 0,
                  highlightScope: { fade: "global", highlight: "item" },
                },
              ]}
              width={160}
              height={160}
              margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
