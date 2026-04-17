import {
  Card,
  CardContent,
  Typography,
  Box,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Chip,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useMemo, useState } from "react";
import { useGetConsultations } from "@/app/api/consultation/useConsultationApi";

interface Doctor {
  id: string;
  name: string;
  specialty?: string;
  count: number;
}

export default function TopDoctor() {
  const theme = useTheme();
  const { data: consultationsData } = useGetConsultations();
  const now = new Date();
  const currentMonthValue = `${String(now.getMonth() + 1).padStart(2, "0")}-${now.getFullYear()}`;
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthValue);
  const consultations = consultationsData?.data?.data ?? [];

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

  const topDoctors = useMemo<Doctor[]>(() => {
    const [monthStr, yearStr] = selectedMonth.split("-");
    const month = Number(monthStr);
    const year = Number(yearStr);

    const grouped = new Map<number, { name: string; parentIds: Set<number> }>();

    consultations.forEach((consultation) => {
      const date = new Date(consultation.created_at);
      if (date.getFullYear() !== year || date.getMonth() + 1 !== month) return;

      const doctorId = Number(consultation.health_worker_id);
      const parentId = Number(consultation.parent_id);
      if (Number.isNaN(doctorId) || Number.isNaN(parentId)) return;

      const existing = grouped.get(doctorId);
      if (!existing) {
        grouped.set(doctorId, {
          name: consultation.health_worker?.name ?? `Dokter #${doctorId}`,
          parentIds: new Set([parentId]),
        });
        return;
      }

      existing.parentIds.add(parentId);
    });

    return Array.from(grouped.entries())
      .map(([id, value]) => ({
        id: String(id),
        name: value.name,
        specialty: "Dokter",
        count: value.parentIds.size,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [consultations, selectedMonth]);

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: "8px",
        bgcolor: theme.palette.background.paper,
        boxShadow: "0px 6px 18px rgba(29, 36, 60, 0.04)",
        height: "405px",
      }}
    >
      <CardContent
        sx={{
          minHeight: 380,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Top Dokter
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: theme.palette.text.secondary }}
            >
              Pasien terbanyak
            </Typography>
          </Box>

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
        </Box>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{ px: "6px" }}
        >
          <Typography sx={{ color: "#2A3547", fontWeight: 600 }}>
            Dokter
          </Typography>
          <Typography sx={{ color: "#2A3547", fontWeight: 600 }}>
            Jumlah Pasien
          </Typography>
        </Box>
        <Divider />

        <Box>
          <List disablePadding>
            {topDoctors.length === 0 ? (
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary, py: 2 }}>
                Belum ada data konsultasi pada bulan ini.
              </Typography>
            ) : topDoctors.map((d, idx) => (
              <ListItem
                key={d.id}
                sx={{
                  py: 2,
                  px: 0,
                  alignItems: "center",
                  borderBottom:
                    idx < topDoctors.length - 1
                      ? `1px solid ${theme.palette.divider}`
                      : "none",
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ width: 32, height: 32 }}>
                    {d.name.charAt(0)}
                  </Avatar>
                </ListItemAvatar>

                <ListItemText
                  primary={
                    <Typography sx={{ fontWeight: 600, fontSize: "14px" }}>
                      {d.name}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="caption"
                      sx={{ color: theme.palette.text.secondary }}
                    >
                      {d.specialty}
                    </Typography>
                  }
                />

                <Chip
                  label={d.count}
                  sx={{
                    borderRadius: "16px",
                    mr: "28px",
                    backgroundColor: "#49BEFF",
                    color: "#ffffff",
                    fontWeight: 400,
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </CardContent>
    </Card>
  );
}
