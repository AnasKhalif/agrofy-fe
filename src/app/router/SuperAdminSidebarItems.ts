import type { MenuItem } from "./SidebarItems";
import { ROUTES } from "@/app/constants/router";
import { PERMISSIONS } from "@/app/constants/permission";

const SuperAdminSidebarContent: MenuItem[] = [
  {
    id: 1,
    items: [
      {
        heading: "HOME",
        children: [
          {
            name: "Dashboard",
            icon: "solar:home-2-outline",
            id: "superadmin-dashboard",
            url: ROUTES.PARENT.DASHBOARD,
            permission: PERMISSIONS.DASHBOARD_READ,
          },
        ],
      },
      {
        heading: "PENGATURAN",
        children: [
          {
            name: "Manajemen Pengguna",
            icon: "solar:user-id-outline",
            id: "superadmin-user-management",
            url: "/users",
            permission: PERMISSIONS.USERS_READ,
          },
          {
            name: "Role & Permission",
            icon: "solar:shield-check-outline",
            id: "superadmin-role-permission",
            url: "/roles",
            permission: PERMISSIONS.ROLES_READ,
          },
          {
            name: "Log System",
            icon: "solar:history-outline",
            id: "superadmin-log-system",
            url: ROUTES.SUPER_ADMIN.LOG_SYSTEM,
            permission: PERMISSIONS.LOG_SYSTEM_READ,
          },
        ],
      },
    ],
  },
];

export default SuperAdminSidebarContent;