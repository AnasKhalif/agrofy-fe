import { useState, useCallback } from 'react';

/**
 * Return type for useBoolean hook
 */
export interface UseBooleanReturn {
  /** Current boolean value */
  value: boolean;
  /** Set value to a specific boolean */
  setValue: (value: boolean) => void;
  /** Set value to true */
  setTrue: () => void;
  /** Set value to false */
  setFalse: () => void;
  /** Toggle between true and false */
  toggle: () => void;
}

/**
 * Custom hook for managing boolean state with utility functions
 *
 * Provides a cleaner API for managing boolean states compared to raw useState.
 * All setter functions are memoized to prevent unnecessary re-renders.
 *
 * @param initialValue - Initial boolean value (default: false)
 * @returns Object with value and control functions
 *
 * @example
 * Basic usage with dialog
 * ```tsx
 * const dialog = useBoolean(false);
 *
 * <Button onClick={dialog.setTrue}>Open Dialog</Button>
 * <Dialog open={dialog.value} onClose={dialog.setFalse}>
 *   <DialogContent>...</DialogContent>
 * </Dialog>
 * ```
 *
 * @example
 * Toggle functionality
 * ```tsx
 * const drawer = useBoolean();
 *
 * <Button onClick={drawer.toggle}>Toggle Drawer</Button>
 * <Drawer open={drawer.value} onClose={drawer.setFalse}>
 *   <DrawerContent>...</DrawerContent>
 * </Drawer>
 * ```
 *
 * @example
 * Loading state
 * ```tsx
 * const loading = useBoolean(false);
 *
 * const handleSubmit = async () => {
 *   loading.setTrue();
 *   try {
 *     await apiCall();
 *   } finally {
 *     loading.setFalse();
 *   }
 * };
 *
 * <Button onClick={handleSubmit} disabled={loading.value}>
 *   {loading.value ? 'Loading...' : 'Submit'}
 * </Button>
 * ```
 */
export function useBoolean(initialValue: boolean = false): UseBooleanReturn {
  const [value, setValue] = useState(initialValue);

  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  const toggle = useCallback(() => setValue((prev) => !prev), []);

  return {
    value,
    setValue,
    setTrue,
    setFalse,
    toggle,
  };
}
