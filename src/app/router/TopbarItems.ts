import { uniqueId } from "lodash";
import { ROUTES } from "@/app/constants/router";
import { PERMISSIONS } from "@/app/constants/permission";

interface TopbarChildItem {
  id: string;
  title: string;
  icon: string;
  href: string;
  permission?: string;
  children?: TopbarChildItem[];
}

interface TopbarMenuItem {
  id: string;
  title: string;
  icon: string;
  href: string;
  column: number;
  children: TopbarChildItem[];
}

const Menuitems: TopbarMenuItem[] = [
  {
    id: uniqueId(),
    title: "Dashboard",
    icon: "solar:layers-line-duotone",
    href: "",
    column: 1,
    children: [
      {
        id: uniqueId(),
        title: "Performa Bisnis",
        icon: "solar:chart-square-outline",
        href: ROUTES.DASHBOARD_V1.DASHBOARD_BUSINESS_PERFORMANCE,
        permission: PERMISSIONS.DASHBOARD_BUSINESS_PERFORMANCE,
      },
    ],
  },
];

export default Menuitems;
