/**
 * useDebounce — Debounce a value by a delay
 *
 * Layer: shared/hooks (Generic — no business logic)
 */

import { useEffect, useState } from 'react';

/**
 * Returns a debounced value that only updates after the specified delay.
 *
 * @param value - The value to debounce
 * @param delayMs - Debounce delay in milliseconds (default: 300ms)
 */
export function useDebounce<T>(value: T, delayMs = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debouncedValue;
}
