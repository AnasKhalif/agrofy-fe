import type { MenuItem } from "./SidebarItems";

const DoctorSidebarContent: MenuItem[] = [
  {
    id: 1,
    items: [
      {
        heading: "HOME",
        children: [
          {
            name: "Dashboard",
            icon: "solar:home-2-outline",
            id: "doctor-dashboard",
            url: "/doctor/dashboard",
          },
        ],
      },
      {
        heading: "KONSULTASI",
        children: [
          {
            name: "Manajemen Konsultasi",
            icon: "solar:chat-round-dots-outline",
            id: "doctor-consultation",
            url: "/doctor/consultation",
          },
        ],
      },
      {
        heading: "PASIEN",
        children: [
          {
            name: "Daftar Pasien",
            icon: "solar:users-group-rounded-outline",
            id: "doctor-patients",
            url: "/doctor/patients",
          },
        ],
      },
      {
        heading: "AKUN",
        children: [
          {
            name: "Profil Saya",
            icon: "solar:user-circle-outline",
            id: "doctor-profile",
            url: "/doctor/profile",
          },
        ],
      },
    ],
  },
];

export default DoctorSidebarContent;
