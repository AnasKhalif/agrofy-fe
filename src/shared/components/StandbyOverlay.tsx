import { FC, useEffect, useState } from 'react';
import { useStandby } from '@/app/contexts/StandbyContext';
import { useAuth } from '@/app/auth';
import Bgimg from '@/assets/images/backgrounds/standby-bg.png';

/**
 * StandbyOverlay component
 * Full-screen overlay shown when user is in standby mode
 * Clicking anywhere waits 1 second before showing PIN entry screen
 * If user has no passcode, exits immediately with animation
 * Features: Live clock, weather widget (placeholder), and motivational quote
 */
const StandbyOverlay: FC = () => {
  const { standbyState, showPinEntry, exitStandby } = useStandby();
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  // Check if user has passcode
  const hasPasscode = Boolean(user?.profile?.passcode && user?.profile?.passcode != '000000');

  useEffect(() => {
    if (standbyState !== 'standby') {
      setIsTransitioning(false);
      setIsAnimatingIn(false);
      setIsAnimatingOut(false);
      return;
    }

    // Trigger animation when component mounts
    setIsAnimatingIn(true);

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [standbyState]);

  const handleClick = () => {
    if (isTransitioning || isAnimatingOut) return; // Prevent multiple clicks

    setIsTransitioning(true);

    if (hasPasscode) {
      // User has passcode - show PIN entry screen
      // No animation here, PinEntryScreen will handle its own animation
      setTimeout(() => {
        showPinEntry();
      }, 10);
    } else {
      // User has no passcode - exit immediately with slide-up animation
      setIsAnimatingOut(true);
      setTimeout(() => {
        exitStandby();
      }, 500); // Wait for animation to complete
    }
  };

  if (standbyState !== 'standby' && !isTransitioning && !isAnimatingOut) {
    return null;
  }

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return {
      time: `${displayHours}:${minutes.toString().padStart(2, '0')}`,
      period: ampm,
    };
  };

  // const formatDate = (date: Date) => {
  //   const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  //   const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  //   return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
  // };

  const { time, period } = formatTime(currentTime);
  // const dateString = formatDate(currentTime);

  return (
    <div
      className={`fixed inset-0 z-[9999] cursor-pointer ${
        isAnimatingOut
          ? 'animate-slide-out'
          : isAnimatingIn
          ? 'animate-slide-in'
          : '-translate-y-full'
      }`}
      onClick={handleClick}
      role="button"
      aria-label="Click to unlock"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
      style={{
        backgroundImage: `url(${Bgimg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay gradient for better text visibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />

      {/* Content Container */}
      <div className="relative h-full w-full flex flex-col justify-between p-8">
        {/* Top Left - Clock */}
        <div className="flex items-start justify-between p-8 mt-6">
          <div className="px-6">
            <div className="flex items-baseline gap-2">
              <span className="text-9xl font-bold text-white">{time}</span>
              <span className="text-7xl font-bold text-white">{period}</span>
            </div>
            <div className="rounded-md bg-[#E5ECFB] flex justify-center items-center px-4 py-2 mt-2">
              <span className="text-blue-700 font-semibold text-base">Kembali ke dashboard</span>
            </div>
            {/* <div className="text-sm text-white mt-1">{dateString}</div> */}
          </div>
        </div>

        {/* Bottom Center - Motivational Quote */}
        <div className="flex justify-start mb-12 pl-4">
          <div className="max-w-3xl px-6">
            <p className="text-white text-3xl md:text-3xl font-semibold drop-shadow-lg mb-1">
              Let your smile change the world.
            </p>
            <p className="text-white text-3xl font-semibold drop-shadow-md">
              Don't let the world change your smile.
            </p>
          </div>
        </div>
      </div>

      {/* Add slide-in and slide-out animations */}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateY(-100%);
          }
          to {
            transform: translateY(0);
          }
        }
        @keyframes slideOut {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(-100%);
          }
        }
        .animate-slide-in {
          animation: slideIn 0.5s ease-in-out forwards;
        }
        .animate-slide-out {
          animation: slideOut 0.5s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

export default StandbyOverlay;
