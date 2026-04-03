import { useEffect, useState } from 'react';

interface TopProgressBarProps {
  isLoading: boolean;
}

/**
 * TopProgressBar - A top-of-page progress bar with YouTube-style animation
 * Shows an indeterminate progress animation that moves from left to right continuously
 */
const TopProgressBar = ({ isLoading }: TopProgressBarProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setIsVisible(true);
    } else {
      // Delay hiding to show completion
      const timeout = setTimeout(() => setIsVisible(false), 400);
      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-transparent overflow-hidden">
      <div
        className={`h-full transition-opacity duration-300 ${
          isLoading ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          animation: isLoading ? 'progressMove 1.5s ease-in-out infinite' : 'none',
          background: 'linear-gradient(90deg, transparent 0%, #3b82f6 5%, #3b82f6 95%, transparent 100%)',
          width: '100%',
          transformOrigin: 'left',
        }}
      />
      <style>{`
        @keyframes progressMove {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(0%);
          }
          80% {
            transform: translateX(75%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

export default TopProgressBar;
