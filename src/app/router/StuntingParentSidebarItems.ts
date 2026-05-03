import type { MenuItem } from "./SidebarItems";
import { PERMISSIONS } from "@/app/constants/permission";

const StuntingParentSidebarContent: MenuItem[] = [
  {
    id: 1,
    items: [
      {
        heading: "HOME",
        children: [
          {
            name: "Dashboard",
            icon: "solar:home-2-outline",
            id: "parent-dashboard",
            url: "/dashboard",
            permission: PERMISSIONS.DASHBOARD_READ,
          },
        ],
      },
      {
        heading: "DATA ANAK",
        children: [
          {
            name: "Daftar Anak",
            icon: "solar:users-group-rounded-outline",
            id: "parent-children",
            url: "/children",
            permission: PERMISSIONS.CHILDREN_READ,
          },
        ],
      },
      {
        heading: "DETEKSI STUNTING",
        children: [
          {
            name: "Deteksi Risiko",
            icon: "solar:health-outline",
            id: "parent-detection",
            url: "/stunting-detection",
            permission: PERMISSIONS.STUNTING_CREATE,
          },
          {
            name: "Riwayat Deteksi",
            icon: "solar:history-outline",
            id: "parent-detection-history",
            url: "/detection-history",
            permission: PERMISSIONS.STUNTING_READ,
          },
        ],
      },
      {
        heading: "MONITORING",
        children: [
          {
            name: "Monitoring Pertumbuhan",
            icon: "solar:graph-new-up-outline",
            id: "parent-monitoring",
            url: "/monitoring",
            permission: PERMISSIONS.MONITORING_READ,
          },
        ],
      },
      {
        heading: "IMUNISASI",
        children: [
          {
            name: "Jadwal & Catatan Imunisasi",
            icon: "solar:syringe-outline",
            id: "parent-vaccination",
            url: "/vaccination",
            permission: PERMISSIONS.VACCINATIONS_READ,
          },
        ],
      },
      {
        heading: "KONSULTASI",
        children: [
          {
            name: "Konsultasi Online",
            icon: "solar:chat-round-dots-outline",
            id: "parent-consultation",
            url: "/consultation",
            permission: PERMISSIONS.CONSULTATIONS_READ,
          },
        ],
      },
      {
        heading: "REKOMENDASI",
        children: [
          {
            name: "Saran Makanan & Tindakan",
            icon: "solar:star-outline",
            id: "parent-food-recommendations",
            url: "/food-recommendations",
            permission: PERMISSIONS.FOODS_READ,
          },
        ],
      },
      {
        heading: "AKUN",
        children: [
          {
            name: "Profil Saya",
            icon: "solar:user-circle-outline",
            id: "parent-profile",
            url: "/profile",
            permission: PERMISSIONS.PROFILE_READ,
          },
        ],
      },
    ],
  },
];

export default StuntingParentSidebarContent;
