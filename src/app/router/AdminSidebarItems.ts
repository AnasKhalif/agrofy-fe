import type { MenuItem } from "./SidebarItems";
import { ROUTES } from "@/app/constants/router";
import { PERMISSIONS } from "@/app/constants/permission";

const AdminSidebarContent: MenuItem[] = [
  {
    id: 1,
    items: [
      {
        heading: "HOME",
        children: [
          {
            name: "Dashboard",
            icon: "solar:home-2-outline",
            id: "admin-dashboard",
            url: ROUTES.PARENT.DASHBOARD,
            permission: PERMISSIONS.DASHBOARD_READ,
          },
        ],
      },
      {
        heading: "KONTEN",
        children: [
          {
            name: "Manajemen Artikel",
            icon: "solar:document-text-outline",
            id: "admin-articles",
            url: ROUTES.ADMIN.ARTICLES,
            permission: PERMISSIONS.ARTICLES_READ,
          },
          {
            name: "Manajemen FAQ",
            icon: "solar:question-circle-outline",
            id: "admin-faqs",
            url: ROUTES.ADMIN.FAQS,
            permission: PERMISSIONS.FAQS_READ,
          },
          {
            name: "Daftar Makanan",
            icon: "solar:plate-outline",
            id: "admin-foods",
            url: ROUTES.ADMIN.FOODS,
            permission: PERMISSIONS.FOODS_READ,
          },
        ],
      },
      {
        heading: "DATA",
        children: [
          {
            name: "Data Anak",
            icon: "solar:users-group-rounded-outline",
            id: "admin-children",
            url: ROUTES.ADMIN.CHILDREN,
            permission: PERMISSIONS.CHILDREN_READ,
          },
          {
            name: "Laporan Pertumbuhan",
            icon: "solar:chart-square-outline",
            id: "admin-reports",
            url: ROUTES.ADMIN.REPORTS,
            permission: PERMISSIONS.REPORTS_READ,
          },
        ],
      },
      {
        heading: "PENGGUNA",
        children: [
          {
            name: "Manajemen Pengguna",
            icon: "solar:user-id-outline",
            id: "admin-users",
            url: ROUTES.ADMIN.USERS,
            permission: PERMISSIONS.USERS_READ,
          },
        ],
      },
    ],
  },
];

export default AdminSidebarContent;
