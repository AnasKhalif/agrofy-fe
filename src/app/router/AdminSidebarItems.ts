import type { MenuItem } from "./SidebarItems";

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
            url: "/admin/dashboard",
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
            url: "/admin/articles",
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
            url: "/admin/children",
          },
          {
            name: "Laporan Pertumbuhan",
            icon: "solar:chart-square-outline",
            id: "admin-reports",
            url: "/admin/reports",
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
            url: "/admin/users",
          },
        ],
      },
    ],
  },
];

export default AdminSidebarContent;
