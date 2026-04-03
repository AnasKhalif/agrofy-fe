//  Profile Data
interface MiniiconsType {
  id: number;
  icon: string;
  tooltip: string;
}

const Miniicons: MiniiconsType[] = [
  {
    id: 1,
    icon: "solar:layers-line-duotone",
    tooltip: "Dashboard",
  },
  {
    id: 2,
    icon: "solar:calendar-outline",
    tooltip: "Jadwal",
  },
  {
    id: 3,
    icon: "solar:users-group-two-rounded-outline",
    tooltip: "Pasien",
  },
  {
    id: 4,
    icon: "solar:money-bag-outline",
    tooltip: "Penjualan",
  },
  {
    id: 5,
    icon: "solar:key-outline",
    tooltip: "Treatment",
  },
  {
    id: 6,
    icon: "solar:box-outline",
    tooltip: "Produk",
  },
  {
    id: 7,
    icon: "solar:archive-outline",
    tooltip: "Inventory",
  },
  {
    id: 8,
    icon: "solar:document-outline",
    tooltip: "Laporan Penjualan",
  },
];

export default Miniicons;
