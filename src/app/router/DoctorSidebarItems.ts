import type { MenuItem } from "./SidebarItems";
import { ROUTES } from "@/app/constants/router";
import { PERMISSIONS } from "@/app/constants/permission";

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
            url: ROUTES.DOCTOR.DASHBOARD,
            permission: PERMISSIONS.DASHBOARD_READ,
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
            url: ROUTES.DOCTOR.CONSULTATION,
            permission: PERMISSIONS.CONSULTATIONS_READ,
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
            url: ROUTES.DOCTOR.PATIENTS,
            permission: PERMISSIONS.CHILDREN_READ,
          },
          {
            name: "Monitoring Pasien",
            icon: "solar:graph-new-up-outline",
            id: "doctor-monitoring",
            url: ROUTES.DOCTOR.MONITORING,
            permission: PERMISSIONS.MONITORING_READ,
          },
          {
            name: "Imunisasi Pasien",
            icon: "solar:syringe-outline",
            id: "doctor-vaccination",
            url: ROUTES.DOCTOR.VACCINATION,
            permission: PERMISSIONS.VACCINATIONS_READ,
          },
        ],
      },
      {
        heading: "REKOMENDASI",
        children: [
          {
            name: "Daftar Makanan",
            icon: "solar:plate-outline",
            id: "doctor-foods",
            url: ROUTES.DOCTOR.FOODS,
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
            id: "doctor-profile",
            url: ROUTES.PARENT.PROFILE,
            permission: PERMISSIONS.PROFILE_READ,
          },
        ],
      },
    ],
  },
];

export default DoctorSidebarContent;
