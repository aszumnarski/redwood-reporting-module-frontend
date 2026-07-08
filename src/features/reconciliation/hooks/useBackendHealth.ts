import { useEffect, useState } from "react";
import { fetchHealth } from "../../../api/reconciliation.api";

export function useBackendHealth() {
  const [healthy, setHealthy] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchHealth()
      .then(() => {
        if (!cancelled) setHealthy(true);
      })
      .catch(() => {
        if (!cancelled) setHealthy(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return healthy;
}