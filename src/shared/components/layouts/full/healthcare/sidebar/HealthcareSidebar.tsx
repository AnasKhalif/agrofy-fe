import { FC, useEffect, useState, useMemo } from 'react';
import { useLocation, NavLink } from 'react-router';
import { Icon } from "@iconify/react";
import SidebarContent from "@/app/router/SidebarItems";
import NexDashboardSidebarContent from "@/app/router/NexDashboardSidebarItems";
import { usePermission, useToast } from "@/shared/hooks";
import { Button } from '@/shared/components/agrofy-ui/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/shared/components/agrofy-ui/ui/dropdown-menu';
import { useAuth } from '@/app/auth';
import { useChangeBranch } from '@/app/api/auth/useAuthApi';
import { authService } from '@/app/services/authService';
import { useIsNexCompany } from '@/app/hooks/useIsNexCompany';

interface HealthcareSidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
  onStandByMode?: () => void;
}

interface ClinicOption {
  id: string;
  name: string;
  subtitle: string;
}

/**
 * HealthcareSidebar - Exact replica of nex-healthcare-clinic sidebar
 * Clean, collapsible sidebar with clinic selector and section-based navigation
 */
const HealthcareSidebar: FC<HealthcareSidebarProps> = ({
  isMobileOpen = false,
  onMobileClose,
  onStandByMode,
}) => {
  const { user } = useAuth()
  const { hasPermission } = usePermission();
  const toast = useToast();
  const location = useLocation();
  const pathname = location.pathname;
  const isNexCompany = useIsNexCompany();

  const selectedBranch = user?.selected_branch || user?.profile?.branches?.[0];

  // Get initial clinic based on current_branch from authService or is_nex status
  const getInitialClinic = (): ClinicOption => {
    // For Nex company users, default to Nex Dashboard
    if (isNexCompany) {
      return {
        id: 'nex',
        name: 'Nex Dashboard',
        subtitle: 'Admin Dashboard'
      };
    }

    // For non-Nex company users, get current_branch from authService
    const currentBranch = authService.getCurrentBranch();

    if (currentBranch) {
      return {
        id: currentBranch.id,
        name: currentBranch.name,
        subtitle: "Cabang " + currentBranch.city.replace("Kota ", "").replace("Kab. ", "")
      };
    }

    // Fallback to selected branch from auth
    if (selectedBranch) {
      return {
        id: selectedBranch.id,
        name: selectedBranch.name,
        subtitle: "Cabang " + selectedBranch.city.replace("Kota ", "").replace("Kab. ", "")
      };
    }

    // Default fallback
    return {
      id: 'none',
      name: 'Tidak ada Cabang',
      subtitle: 'Silahkan tambahkan cabang',
    };
  };

  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState<ClinicOption>(getInitialClinic);

  const clinicOptions: ClinicOption[] = user?.profile?.branches?.map(branch => {
    return {
      id: branch.id,
      name: branch.name,
      subtitle: "Cabang " + branch.city.replace("Kota ", "").replace("Kab. ", "")
    }
  }) || []

  // Combine: Nex Dashboard first (only if is_nex is true), then user's branches
  const allClinicOptions: ClinicOption[] = isNexCompany
    ? [
        {
          id: 'nex',
          name: 'Nex Dashboard',
          subtitle: 'Admin Dashboard'
        },
        ...clinicOptions
      ]
    : clinicOptions;

  // Determine which sidebar content to use based on selected clinic
  const currentSidebarContent = selectedClinic.id === 'nex'
    ? NexDashboardSidebarContent
    : SidebarContent;

  // Filter menu items by permissions
  const filteredSidebarContent = useMemo(() => {
    return currentSidebarContent.map((section) => ({
      ...section,
      items: section.items?.map((item) => ({
        ...item,
        children: item.children?.filter((child) => {
          // If no permission is specified, show the item
          if (!child.permission) return true;
          // Otherwise, check if user has the permission
          return hasPermission(child.permission);
        }),
      })).filter((item) => {
        // Filter out items that have no children left after permission filtering
        return item.children && item.children.length > 0;
      }),
    })).filter((section) => {
      // Filter out sections that have no items left after permission filtering
      return section.items && section.items.length > 0;
    });
  }, [hasPermission, currentSidebarContent]);

  // Auto-expand section containing current active route
  useEffect(() => {
    filteredSidebarContent.forEach((section) => {
      section.items?.forEach((item) => {
        const hasActiveChild = item.children?.some((child) => child.url === pathname);
        if (hasActiveChild && item.heading) {
          const heading = item.heading;
          setExpandedSections((prev) => {
            const newSet = new Set(prev);
            // heading is checked above, assert non-null to satisfy TypeScript narrowing inside the callback
            newSet.add(heading!);
            return newSet;
          });
        }
      });
    });
  }, [pathname, filteredSidebarContent]);

  const handleItemClick = () => {
    if (isMobileOpen && onMobileClose) {
      onMobileClose();
    }
  };

  const handleSectionToggle = (sectionTitle: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionTitle)) {
        newSet.delete(sectionTitle);
      } else {
        // Clear all other sections and add only this one (accordion behavior)
        newSet.clear();
        newSet.add(sectionTitle);
      }
      return newSet;
    });
  };

  const changeBranchMutation = useChangeBranch({
    onSuccess: () => {
      toast.success('Cabang berhasil diubah');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to change branch';
      toast.error(message);
    },
  });

  const handleClinicSelect = (clinic: ClinicOption) => {
    // Don't change if already selected
    if (clinic.id === selectedClinic.id) {
      setIsDropdownOpen(false);
      return;
    }

    // Don't change if it's the "no branch" option
    if (clinic.id === 'none') {
      setIsDropdownOpen(false);
      return;
    }

    // Update local state immediately for UI feedback
    setSelectedClinic(clinic);

    // Close dropdown after selection
    setIsDropdownOpen(false);

    // Handle branch selection
    if (clinic.id === 'nex') {
      // Nex Dashboard selected - no need to call API or save branch
      // Just update the UI state
      return;
    }

    // Find the full branch object from user's branches
    const selectedBranch = user?.profile?.branches?.find(branch => branch.id === clinic.id);

    if (selectedBranch) {
      // Save to authService for consistency
      authService.setCurrentBranch(selectedBranch);

      // Call API to change branch
      changeBranchMutation.mutate({ branch_id: clinic.id });
    }
  };

  const sidebarContent = (
    <>
      {/* Logo Header */}
      <div className="h-[64px] px-6 flex items-center border-b border-gray-200 dark:border-darkborder">
        <div className="flex items-center gap-2">
          <div className="flex items-center mr-[41px]">
            <img src="/nex-healthcare-logo.svg" alt="Nex Healthcare" className="h-[38px] mr-[39px]" />
          </div>
        </div>
      </div>

      {/* Clinic Selector */}
      <div className="p-4 border-gray-200 dark:border-darkborder border-b-0 pt-6 pb-1">
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild id='select-branch-button'>
            <button
              className="w-full border border-gray-200 dark:border-darkborder rounded-md p-3 bg-white dark:bg-darkminisidebar py-2.5 hover:bg-gray-50 dark:hover:bg-dark transition-colors"
              disabled={changeBranchMutation.isPending}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg flex items-center justify-center h-0 w-7">
                    <div className="w-6 h-6 rounded-lg bg-[#0152EA] flex items-center justify-center">
                      {changeBranchMutation.isPending ? (
                        <Icon icon="solar:refresh-line-duotone" className="text-white animate-spin" width={14} />
                      ) : (
                        <Icon icon="solar:health-line-duotone" className="text-white" width={14} />
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{selectedClinic.name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{selectedClinic.subtitle}</span>
                  </div>
                </div>
                {changeBranchMutation.isPending ? (
                  <Icon
                    icon="solar:refresh-line-duotone"
                    className="w-4 h-4 text-gray-500 animate-spin"
                  />
                ) : (
                  <Icon
                    icon="solar:alt-arrow-down-line-duotone"
                    className="w-4 h-4 text-gray-500 transition-transform"
                  />
                )}
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-[223px] p-2 bg-white dark:bg-darkgray border border-gray-200 dark:border-darkborder"
            sideOffset={8}
          >
            {allClinicOptions.map((clinic) => (
              <button
                key={clinic.id}
                onClick={() => handleClinicSelect(clinic)}
                id={`select-branch-${clinic.id}-button`}
                className={`w-full flex items-center gap-3 p-3 rounded-md transition-colors text-left ${
                  selectedClinic.id === clinic.id
                    ? 'bg-[#EFF3FF] dark:bg-blue-900/20'
                    : 'hover:bg-gray-50 dark:hover:bg-darkminisidebar'
                }`}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-white dark:bg-darkminisidebar">
                  {clinic.id === 'nex' ? (
                    <div className="w-12 h-12 rounded-full bg-[#0152EA] flex items-center justify-center">
                      <span className="text-white font-bold text-sm">nex.</span>
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#0152EA] flex items-center justify-center">
                      <Icon icon="solar:health-line-duotone" className="text-white" width={24} />
                    </div>
                  )}
                </div>
                <div className="flex flex-col flex-1">
                  <span className="font-medium text-gray-900 dark:text-white text-xs">{clinic.name}</span>
                  <span className="text-xs text-slate-400 dark:text-gray-400">{clinic.subtitle}</span>
                </div>
              </button>
            ))}
            {allClinicOptions.length === 0 && (<button
                key={selectedClinic.id}
                id={`select-branch-${selectedClinic.id}-button`}
                className={`w-full flex items-center gap-3 p-3 rounded-md transition-colors text-left ${
                    'bg-[#EFF3FF] dark:bg-blue-900/20'
                }`}
              >
                <div className="flex flex-col flex-1">
                  <span className="font-medium text-gray-900 dark:text-white text-xs">{selectedClinic.name}</span>
                  <span className="text-xs text-slate-400 dark:text-gray-400">{selectedClinic.subtitle}</span>
                </div>
              </button>)}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto pb-4 pt-2">
        {filteredSidebarContent.map((section) => (
          <div key={section.id}>
            {section.items?.map((item) => {
              const heading = item.heading;
              if (!heading || !item.children || item.children.length === 0) return null;

              const isExpanded = expandedSections.has(heading);

              return (
                <div key={heading} className="px-4 mb-2 pl-5 pr-4">
                  {/* Section Header */}
                  <button
                    onClick={() => handleSectionToggle(heading)}
                    className="w-full flex items-center justify-between py-3 hover:bg-gray-50 dark:hover:bg-darkminisidebar rounded-lg px-2 -mx-2 transition-colors pr-1.5"
                    id={`section-${heading}-button`}
                  >
                    <h3 className="font-bold uppercase tracking-wide text-xs text-slate-600 dark:text-gray-400">
                      {heading}
                    </h3>
                    {item.children.length > 0 &&
                      (isExpanded ? (
                        <Icon icon="solar:alt-arrow-down-line-duotone" className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Icon icon="solar:alt-arrow-right-line-duotone" className="w-4 h-4 text-gray-400" />
                      ))}
                  </button>

                  {/* Section Items */}
                  {isExpanded && item.children.length > 0 && (
                    <div className="space-y-1 mt-2">
                      {item.children.map((child) => {
                        const isActive = pathname === child.url;
                        const displayText = child.name;

                        return (
                          <NavLink
                            key={child.id}
                            id={`section-${heading}-${child.id}-button`}
                            to={child.url || '#'}
                            end
                            onClick={handleItemClick}
                            className={({ isActive: linkActive }) =>
                              `w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors text-left relative ${
                                isActive || linkActive
                                  ? 'bg-[#EFF3FF] dark:bg-blue-900/20 text-[#0152EA] dark:text-blue-400 font-medium'
                                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-darkminisidebar'
                              }`
                            }
                            aria-label={`Navigate to ${displayText}`}
                          >
                            {child.icon && (
                              <Icon
                                icon={child.icon}
                                className={`w-5 h-5 flex-shrink-0 ${
                                  isActive
                                    ? 'text-[#0152EA] dark:text-blue-400'
                                    : 'text-gray-700 dark:text-gray-300'
                                }`}
                              />
                            )}
                            <span className={`flex-1 ${
                              isActive
                                ? 'text-[#0152EA] dark:text-blue-400'
                                : 'text-gray-700 dark:text-gray-300'
                            }`}>
                              {displayText}
                            </span>
                            {('badge' in child) && (child as any).badge && (
                              <div className="bg-[#0152EA] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                                {(child as any).badge}
                              </div>
                            )}
                          </NavLink>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom Action - Standby Mode */}
      <div className="border-gray-200 dark:border-darkborder p-4 pb-6 border-t-0">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-darkminisidebar rounded-md transition-colors border border-gray-200 dark:border-darkborder" id='standby-mode-button' onClick={() => onStandByMode?.()}>
          <Icon icon="solar:power-line-duotone" className="w-5 h-5 text-gray-500" />
          <span>Standby mode</span>
        </button>
      </div>
    </>
  );

  // Desktop Sidebar
  if (!isMobileOpen) {
    return (
      <div className="hidden lg:flex w-[255px] bg-white dark:bg-darkgray border-r border-gray-200 dark:border-darkborder flex-col">
        {sidebarContent}
      </div>
    );
  }

  // Mobile Sidebar
  return (
    <div className="lg:hidden fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onMobileClose}
        aria-label="Close sidebar"
      />

      {/* Sidebar */}
      <div className="relative flex flex-col w-80 max-w-xs bg-white dark:bg-darkgray border-r border-gray-200 dark:border-darkborder">
        {/* Mobile Header */}
        <div className="p-4 border-b border-gray-200 dark:border-darkborder flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/images/logos/logo-light.svg"
              alt="Nex Healthcare"
              className="h-8 w-auto dark:hidden"
            />
            <img
              src="/images/logos/logo-dark.svg"
              alt="Nex Healthcare"
              className="h-8 w-auto hidden dark:block"
            />
          </div>
          <Button variant="ghost" size="sm" onClick={onMobileClose} aria-label="Close sidebar">
            <Icon icon="solar:close-circle-line-duotone" height={20} />
          </Button>
        </div>
        {sidebarContent}
      </div>
    </div>
  );
};

export default HealthcareSidebar;
