import { useEffect } from "react";

/**
 * Generic polling hook.
 *
 * When enabled is true, pollFn is called every intervalMs.
 * Polling is automatically cleaned up when disabled or unmounted.
 */
export function useReconciliationPolling(
  enabled: boolean,
  pollFn: () => void,
  intervalMs: number
) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const intervalId = setInterval(() => {
      pollFn();
    }, intervalMs);

    // Cleanup when disabled or component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, [enabled, pollFn, intervalMs]);
}
