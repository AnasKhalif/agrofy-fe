import { FC, useState } from 'react';
import { Outlet } from "react-router";
import HealthcareSidebar from './healthcare/sidebar/HealthcareSidebar';
import HealthcareTopbar from './healthcare/header/HealthcareTopbar';
import ScrollToTop from '@/shared/components/theme-ui/ScrollToTop';
import { useIdleDetection } from '@/app/hooks/useIdleDetection';
import { useAuth } from '@/app/auth';
import { StandbyProvider, useStandby } from '@/app/contexts/StandbyContext';
import StandbyOverlay from '@/shared/components/StandbyOverlay';
import PinEntryScreen from '@/shared/components/PinEntryScreen';
import TopProgressBar from '@/shared/components/common/TopProgressBar';
import { useProgress } from '@/shared/hooks/useProgress';

/**
 * HealthcareLayout - Clean layout matching Figma design
 * Structure:
 * - Sidebar on the left (with logo at top)
 * - Topbar on the right (spanning remaining width)
 * - Main content below topbar
 */
const HealthcareLayoutContent: FC = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { setStandby } = useStandby();
  const isLoading = useProgress();

  const handleMobileSidebarToggle = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const handleMobileSidebarClose = () => {
    setIsMobileSidebarOpen(false);
  };

  // Idle detection hook - only active for authenticated users
  const { isIdle } = useIdleDetection({
    timeout: 1_800_000, // 10 minutes
    onIdle: () => {
      if (isAuthenticated) {
        console.log('User became idle ' + new Date().toISOString());
        setStandby(true); // Trigger standby mode when user becomes idle
      }
    },
  });

  return (
    <>
      <TopProgressBar isLoading={isLoading} />
      <div className="flex w-full h-screen overflow-hidden bg-gray-50 dark:bg-darkgray">
        {/* Sidebar - Fixed on the left */}
        <HealthcareSidebar
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={handleMobileSidebarClose}
          onStandByMode={() => setStandby(true)}
        />

        {/* Right side - Topbar + Main Content */}
        <div className="flex flex-col flex-1 w-full h-screen overflow-hidden">
          {/* Topbar - Fixed at top of right side */}
          <HealthcareTopbar onMobileMenuClick={handleMobileSidebarToggle} />

          {/* Main Content Area - Scrollable */}
          <div className="flex-1 overflow-y-auto bg-lightgray dark:bg-dark">
            <div className="p-4 lg:p-6 lg:px-6">
              <ScrollToTop>
                <Outlet />
              </ScrollToTop>
            </div>
          </div>
        </div>
      </div>
      
      {/* Standby Overlay */}
      <StandbyOverlay />

      {/* PIN Entry Screen */}
      <PinEntryScreen pinLength={6}/>

      {/* Idle State Indicator - for debugging */}
      {isAuthenticated && isIdle && (
        <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
          User is idle
        </div>
      )}
    </>
  );
};

const HealthcareLayout: FC = () => {
  return (
    <StandbyProvider>
      <HealthcareLayoutContent />
    </StandbyProvider>
  );
};

export default HealthcareLayout;
