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
import { useState } from "react";

interface Doctor {
  id: string;
  name: string;
  specialty?: string;
  count: number;
}

const sampleDoctors: Doctor[] = [
  { id: "1", name: "Dr. Ahmad", specialty: "Ahli Bedah", count: 100 },
  { id: "2", name: "Dr. Siti", specialty: "Kecantikan", count: 80 },
  { id: "3", name: "Dr. Budi", specialty: "Kecantikan", count: 42 },
  { id: "4", name: "Dr. Linda", specialty: "Kecantikan", count: 33 },
];

export default function TopDoctor() {
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
            {sampleDoctors.map((d, idx) => (
              <ListItem
                key={d.id}
                sx={{
                  py: 2,
                  px: 0,
                  alignItems: "center",
                  borderBottom:
                    idx < sampleDoctors.length - 1
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
