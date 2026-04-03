import { useEffect, useState } from "react";

interface UseIdleDetectionOptions {
  timeout?: number; // timeout in milliseconds
  events?: string[]; // events to listen for
  onIdle?: () => void; // callback when user becomes idle
  onActive?: () => void; // callback when user becomes active
}

/**
 * Custom hook for detecting user idle state
 * Returns whether user is currently idle
 */
export const useIdleDetection = ({
  timeout = 60000, // 1 minute default
  events = [
    "mousedown",
    "mousemove",
    "keypress",
    "scroll",
    "touchstart",
    "click",
    "keydown",
    "wheel",
  ],
  onIdle,
  onActive,
}: UseIdleDetectionOptions = {}) => {
  const [isIdle, setIsIdle] = useState(false);
  const [lastActivity, setLastActivity] = useState(() => Date.now());

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const startTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsIdle(true);
        onIdle?.();
      }, timeout);
    };

    const resetTimer = () => {
      // Accept all events, whether trusted (user-initiated) or untrusted (programmatic/automation)
      setLastActivity(Date.now());
      if (isIdle) {
        setIsIdle(false);
        onActive?.();
      }
      startTimer(); // Restart the timer on every activity
    };

    // Add event listeners
    events.forEach((event) => {
      document.addEventListener(event, resetTimer, true);
    });

    // Initial timer setup
    startTimer();

    // Cleanup
    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, resetTimer, true);
      });
      clearTimeout(timeoutId);
    };
  }, [timeout, events, onIdle, onActive, isIdle]);

  return {
    isIdle,
    lastActivity,
  };
};
