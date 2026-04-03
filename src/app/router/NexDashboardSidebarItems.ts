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

const NexDashboardSidebarContent: MenuItem[] = [
  {
    id: 1,
    name: "NEX DASHBOARD",
    items: [
      {
        heading: "NEX DASHBOARD",
        children: [
          {
            name: "Dashboard Overview",
            icon: "solar:chart-square-outline",
            id: "nex-dashboard-overview",
            url: "/nex-dashboard/overview",
          },
        ],
      },
    ],
  },
];

export default NexDashboardSidebarContent;
