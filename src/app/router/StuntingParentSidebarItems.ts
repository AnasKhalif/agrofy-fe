import type { MenuItem } from "./SidebarItems";

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
          },
          {
            name: "Riwayat Deteksi",
            icon: "solar:history-outline",
            id: "parent-detection-history",
            url: "/detection-history",
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
          },
        ],
      },
    ],
  },
];

export default StuntingParentSidebarContent;
