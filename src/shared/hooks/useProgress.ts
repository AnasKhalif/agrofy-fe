import { useEffect, useState } from 'react';
import { progressService } from '@/app/services/progressService';

/**
 * Hook to subscribe to global API loading state
 * @returns boolean indicating if any API requests are in progress
 */
export const useProgress = (): boolean => {
  const [isLoading, setIsLoading] = useState(progressService.isLoading());

  useEffect(() => {
    const unsubscribe = progressService.subscribe(setIsLoading);
    return unsubscribe;
  }, []);

  return isLoading;
};
