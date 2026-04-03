import { FC } from "react";
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

        {/* View Selector Dropdown */}
        <DropdownMenu>
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
        </DropdownMenu>
      </div>

      {/* Right Side - Notifications, Settings, Profile */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="h-9 w-9 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-darkminisidebar rounded-lg transition-colors"
              aria-label="Notifications"
              id="notification-button"
            >
              <Icon
                icon="solar:bell-outline"
                width={20}
                className="text-gray-600 dark:text-gray-400"
              />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="px-4 py-3 border-b border-gray-100 dark:border-darkborder">
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                Notifications
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                You have 3 unread messages
              </p>
            </div>
            <div className="max-h-96 overflow-y-auto">
              <DropdownMenuItem>
                <div className="flex gap-3 py-1">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                    <Icon
                      icon="solar:calendar-outline"
                      className="text-blue-600 dark:text-blue-400"
                      width={16}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      New appointment
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Patient scheduled for tomorrow
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex gap-3 py-1">
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                    <Icon
                      icon="solar:check-circle-outline"
                      className="text-green-600 dark:text-green-400"
                      width={16}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      Payment received
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Rp 500.000 from patient #123
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
            </div>
            <div className="px-4 py-3 border-t border-gray-100 dark:border-darkborder">
              <button
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                id="view-all-notification"
                onClick={() => navigate("/errors/not_found")}
              >
                View all notifications
              </button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Settings */}
        <button
          className="h-9 w-9 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-darkminisidebar rounded-lg transition-colors"
          aria-label="Settings"
          id="setting-button"
          onClick={() => navigate("/settings")}
        >
          <Icon
            icon="solar:settings-outline"
            width={20}
            className="text-gray-600 dark:text-gray-400"
          />
        </button>

        {/* Profile Section */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild id="profile-button">
            <button className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-darkminisidebar rounded-lg px-2 py-1.5 transition-colors">
              <div className="hidden md:block text-right">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.profile?.first_name || "Admin"}{" "}
                  {user?.profile?.last_name || "User"}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.role?.label || "Administrator"}
                </div>
              </div>
              <Avatar className="w-9 h-9">
                <AvatarImage
                  src={user?.profile?.photo}
                  alt={user?.profile?.first_name || "Admin"}
                />
                <AvatarFallback className="bg-blue-600 text-white text-sm">
                  AU
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="px-4 py-3 border-b border-gray-100 dark:border-darkborder">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.profile?.first_name || "Admin"}{" "}
                {user?.profile?.last_name || "User"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {user?.role?.label || "Administrator"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user?.email || "admin@agrofy.id"}
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
