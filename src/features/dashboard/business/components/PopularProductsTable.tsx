import {
  Box,
  Card,
  CardContent,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

const rows = [
  { city: "Jakarta", session: "16,354", views: "164,354" },
  { city: "Malang", session: "13,423", views: "105,354" },
  { city: "Surabaya", session: "12,342", views: "92,354" },
  { city: "Bali", session: "9,933", views: "80,354" },
  { city: "Sidoarjo", session: "9,933", views: "80,354" },
];

const months = (() => {
  const now = new Date();
  const year = now.getFullYear();
  const names = [
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
  return names.map((n, i) => ({
    value: `${i}-${year}`,
    label: `${n} ${year}`,
  }));
})();

export default function PopularProductsTable() {
  return (
    <Card elevation={1} sx={{ borderRadius: 2, height: "465px" }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Box>
            <p className="text-xs text-red-500">
              *fitur masih dalam tahap pengembangan
            </p>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: "text.primary" }}
            >
              Produk Populer
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Produk
            </Typography>
          </Box>

          <Select
            size="small"
            defaultValue={months[new Date().getMonth()].value}
          >
            {months.map((m) => (
              <MenuItem key={m.value} value={m.value}>
                {m.label}
              </MenuItem>
            ))}
          </Select>
        </Box>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  borderBottom: "1px solid rgba(0,0,0,0.06)",
                  fontWeight: 600,
                }}
              >
                Kota
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  borderBottom: "1px solid rgba(0,0,0,0.06)",
                  fontWeight: 600,
                }}
              >
                Session
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  borderBottom: "1px solid rgba(0,0,0,0.06)",
                  fontWeight: 600,
                }}
              >
                Views
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.city} sx={{ "&:last-child td": { border: 0 } }}>
                <TableCell sx={{ py: 3 }}>{r.city}</TableCell>
                <TableCell align="center">{r.session}</TableCell>
                <TableCell align="right">{r.views}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
