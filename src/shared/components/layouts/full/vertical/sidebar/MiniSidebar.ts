//  Profile Data
interface MiniiconsType {
  id: number;
  icon: string;
  tooltip: string;
}

const Miniicons: MiniiconsType[] = [
  {
    id: 1,
    icon: "solar:layers-line-duotone",
    tooltip: "Dashboard",
  },
  {
    id: 2,
    icon: "solar:settings-outline",
    tooltip: "Master",
  },
  {
    id: 3,
    icon: "solar:quit-pip-outline",
    tooltip: "UI Kit",
  },
];

export default Miniicons;
