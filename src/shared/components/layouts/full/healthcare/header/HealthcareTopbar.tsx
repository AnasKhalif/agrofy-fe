import { FC, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/shared/components/agrofy-ui/ui/dropdown-menu";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/shared/components/agrofy-ui/ui/avatar";
import { useAuth } from "@/app/auth";
import { ROUTES } from "@/app/constants/router";

interface HealthcareTopbarProps {
  onMobileMenuClick?: () => void;
}

/**
 * HealthcareTopbar - Clean, modern topbar matching Figma design
 * Features:
 * - Logo with view selector dropdown
 * - Notifications and settings icons
 * - Profile section with name, role, and avatar
 */
const HealthcareTopbar: FC<HealthcareTopbarProps> = ({ onMobileMenuClick }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const roleName = user?.role
    ? (typeof user.role === "string" ? user.role : user.role.name).toLowerCase()
    : "";
  const normalizedRoleName = roleName.replace(/[^a-z0-9]+/g, "");
  const isDoctorRole = normalizedRoleName === "dokter" || normalizedRoleName === "healthworker";
  const isAdminRole = normalizedRoleName === "admin" || normalizedRoleName === "superadmin";
  const [readNotificationIds, setReadNotificationIds] = useState<string[]>([]);

  const generalNotifications = [
    {
      id: "notif-1",
      icon: "solar:calendar-mark-outline",
      title: "Reminder Monitoring",
      description: "Pastikan data pertumbuhan minggu ini sudah terisi.",
      onClick: () => navigate(ROUTES.PARENT.MONITORING),
    },
    {
      id: "notif-2",
      icon: "solar:chart-square-outline",
      title: "Dashboard Diperbarui",
      description: "Ringkasan status pertumbuhan sudah diperbarui.",
      onClick: () => navigate(ROUTES.PARENT.DASHBOARD),
    },
    ...(isDoctorRole
      ? [
          {
            id: "notif-doctor",
            icon: "solar:users-group-rounded-outline",
            title: "Tinjau Daftar Pasien",
            description: "Ada data pasien yang bisa ditinjau hari ini.",
            onClick: () => navigate(ROUTES.DOCTOR.PATIENTS),
          },
        ]
      : []),
    ...(isAdminRole
      ? [
          {
            id: "notif-admin",
            icon: "solar:document-text-outline",
            title: "Periksa Laporan Pertumbuhan",
            description: "Laporan bulanan siap ditinjau.",
            onClick: () => navigate(ROUTES.ADMIN.REPORTS),
          },
        ]
      : []),
  ];

  const visibleNotifications = useMemo(
    () => generalNotifications.filter((item) => !readNotificationIds.includes(item.id)),
    [generalNotifications, readNotificationIds],
  );

  const unreadTotal = visibleNotifications.length;

  const handleNotificationClick = (id: string, onClick: () => void) => {
    setReadNotificationIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    onClick();
  };

  const isSuperAdmin =
    normalizedRoleName === "superadmin";

  const displayName = user?.name?.trim() || "Admin User";
  const roleLabel =
    typeof user?.role === "string"
      ? user.role
      : user?.role?.label || user?.role?.name || "Administrator";
  const emailLabel = user?.email || "admin@agrofy.id";
  const avatarInitials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() || "")
    .join("") || "AU";

  return (
    <div className="h-[64px] bg-white dark:bg-darkgray border-b border-gray-200 dark:border-darkborder flex items-center justify-between px-6">
      {/* Left Side - View Selector */}
      <div className="flex items-center gap-6">
        {/* Mobile Menu Toggle */}
        <button
          onClick={onMobileMenuClick}
          className="lg:hidden h-10 w-10 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-darkminisidebar rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Icon icon="solar:hamburger-menu-line-duotone" height={24} />
        </button>

        {/* View Selector Dropdown - Super Admin only */}
        {isSuperAdmin && <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="hidden lg:flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              id="select-user-level-view"
            >
              <Icon
                icon="solar:user-circle-outline"
                width={20}
                className="text-gray-400"
              />
              <span className="text-sm">Super Admin View</span>
              <Icon
                icon="solar:alt-arrow-down-outline"
                width={16}
                className="text-gray-400"
              />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem id="super-admin-level-view">
              <Icon
                icon="solar:user-circle-outline"
                className="mr-2"
                width={16}
              />
              Super Admin View
            </DropdownMenuItem>
            <DropdownMenuItem
              id="doctor-level-view"
              onClick={() => navigate("404")}
            >
              <Icon icon="solar:user-outline" className="mr-2" width={16} />
              Doctor View
            </DropdownMenuItem>
            <DropdownMenuItem
              id="staff-level-view"
              onClick={() => navigate("404")}
            >
              <Icon
                icon="solar:users-group-rounded-outline"
                className="mr-2"
                width={16}
              />
              Staff View
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>}
      </div>

      {/* Right Side - Notifications, Settings, Profile */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="relative h-9 w-9 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-darkminisidebar rounded-lg transition-colors"
              aria-label="Notifications"
              id="notification-button"
            >
              <Icon
                icon="solar:bell-outline"
                width={20}
                className="text-gray-600 dark:text-gray-400"
              />
              {unreadTotal > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold leading-none flex items-center justify-center">
                  {unreadTotal > 99 ? "99+" : unreadTotal}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="px-4 py-3 border-b border-gray-100 dark:border-darkborder">
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                Notifications
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {unreadTotal > 0
                  ? `Ada ${unreadTotal} notifikasi umum`
                  : "Belum ada notifikasi"}
              </p>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {visibleNotifications.length === 0 ? (
                <div className="px-4 py-6 text-center text-xs text-gray-500 dark:text-gray-400">
                  Tidak ada notifikasi.
                </div>
              ) : (
                visibleNotifications.slice(0, 5).map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification.id, notification.onClick)}
                  >
                    <div className="flex gap-3 py-1 w-full">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                        <Icon
                          icon={notification.icon}
                          className="text-blue-600 dark:text-blue-400"
                          width={16}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {notification.description}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))
              )}
            </div>
            <div className="px-4 py-3 border-t border-gray-100 dark:border-darkborder">
              <button
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                id="view-all-notification"
                onClick={() => navigate(ROUTES.PARENT.DASHBOARD)}
              >
                Lihat dashboard
              </button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile Section */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild id="profile-button">
            <button className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-darkminisidebar rounded-lg px-2 py-1.5 transition-colors">
              <div className="hidden md:block text-right">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {displayName}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {roleLabel}
                </div>
              </div>
              <Avatar className="w-9 h-9">
                <AvatarImage
                  src={user?.profile?.photo}
                  alt={displayName}
                />
                <AvatarFallback className="bg-blue-600 text-white text-sm">
                  {avatarInitials}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="px-4 py-3 border-b border-gray-100 dark:border-darkborder">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {displayName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {roleLabel}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {emailLabel}
              </p>
            </div>
            <DropdownMenuItem
              className="text-red-600 dark:text-red-400"
              id="sign-out-button"
              onClick={() => logout()}
            >
              <Icon icon="solar:logout-2-outline" className="mr-2" width={16} />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default HealthcareTopbar;
