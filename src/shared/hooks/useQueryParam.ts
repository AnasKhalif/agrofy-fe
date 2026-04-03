import { useEffect, useState } from 'react';

export const getQueryParam = (key: string): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
  } catch {
    return null;
  }
};

export const setQueryParam = (
  key: string,
  value: string | null | undefined,
  options?: { replace?: boolean }
) => {
  if (typeof window === 'undefined') return;
  try {
    const params = new URLSearchParams(window.location.search);
    if (value === null || typeof value === 'undefined') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    if (options?.replace === false) {
      window.history.pushState(null, '', newUrl);
    } else {
      window.history.replaceState(null, '', newUrl);
    }
  } catch {
    // ignore
  }
};

// Hook for a single query param: returns [value, setValue]
export const useQueryParam = (key: string, defaultValue?: string) => {
  const read = () => {
    const v = getQueryParam(key);
    if (v === null || v === undefined) return defaultValue ?? null;
    return v;
  };

  const [value, setValue] = useState<string | null>(read);

  useEffect(() => {
    // keep value in sync with URL on back/forward
    const onPop = () => {
      setValue(read());
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [key]);

  const setAndSync = (v: string | null | undefined, opts?: { replace?: boolean }) => {
    const next = v === undefined ? null : v;
    setValue(next);
    setQueryParam(key, next, opts);
  };

  return [value, setAndSync] as const;
};

export default useQueryParam;
