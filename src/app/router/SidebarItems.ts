export interface ChildItem {
  id?: number | string;
  name?: string;
  icon?: string;
  children?: ChildItem[];
  item?: unknown;
  url?: string;
  color?: string;
  permission?: string;
}

export interface MenuItem {
  heading?: string;
  name?: string;
  icon?: string;
  id?: number;
  to?: string;
  items?: MenuItem[];
  children?: ChildItem[];
  url?: string;
  permission?: string;
}

import { ROUTES } from "@/app/constants/router";

const SidebarContent: MenuItem[] = [
  {
    id: 1,
    items: [
      {
        heading: "DASHBOARD",
        children: [
          {
            name: "Doctor",
            icon: "solar:stethoscope-outline",
            id: "dashboard-doctor",
            url: "/dashboard/doctor",
          },
          {
            name: "Front Office",
            icon: "solar:buildings-outline",
            id: "dashboard-front-office",
            url: "/dashboard/front-office",
          },
          {
            name: "Performa Bisnis",
            icon: "solar:chart-square-outline",
            id: "dashboard-business-performance",
            url: ROUTES.DASHBOARD_V1.DASHBOARD_BUSINESS_PERFORMANCE,
          },
        ],
      },
      {
        heading: "JADWAL",
        children: [
          {
            name: "Jadwal Saya",
            icon: "solar:calendar-outline",
            id: "schedule-doctor",
            url: "/schedule/doctor",
          },
          {
            name: "Jadwal Klinik",
            icon: "solar:user-outline",
            id: "schedule-clinic",
            url: "/schedule/clinic",
          },
        ],
      },
      {
        heading: "PASIEN",
        children: [
          {
            name: "Data Pasien & Riwayat",
            icon: "solar:users-group-two-rounded-outline",
            id: "patients",
            url: "/patients",
          },
        ],
      },
      {
        heading: "PENJUALAN",
        children: [
          {
            name: "Daftar Transaksi",
            icon: "solar:money-bag-outline",
            id: "transactions",
            url: "/transactions",
          },
          {
            name: "Pembayaran",
            icon: "solar:wallet-outline",
            id: "payment",
            url: "/payment",
          },
        ],
      },
      {
        heading: "TREATMENT",
        children: [
          {
            name: "Daftar Treatment",
            icon: "solar:key-outline",
            id: "treatment",
            url: "/treatment",
          },
        ],
      },
      {
        heading: "PRODUK",
        children: [
          {
            name: "Daftar Produk",
            icon: "solar:box-outline",
            id: "products",
            url: "/products",
          },
        ],
      },
      {
        heading: "INVENTORY",
        children: [
          {
            name: "Stok Barang",
            icon: "solar:archive-outline",
            id: "inventory",
            url: "/inventory",
          },
        ],
      },
      {
        heading: "LAPORAN PENJUALAN",
        children: [
          {
            name: "Laporan Harian",
            icon: "solar:document-outline",
            id: "report-daily",
            url: "/report/daily",
          },
        ],
      },
    ],
  },
];

export default SidebarContent;
