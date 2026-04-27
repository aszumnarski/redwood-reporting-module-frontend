import { useEffect, useState } from "react";
import { fetchReconciliationMetadata } from "../../../api/reconciliation.api";
import type { ReconciliationMetadataResponse } from "../types";

export function useReconciliationMetadata() {
  const [data, setData] = useState<ReconciliationMetadataResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadMetadata() {
      try {
        const response = await fetchReconciliationMetadata();
        if (active) {
          setData(response);
        }
      } catch (e) {
        if (active) {
          setError("Failed to load reconciliation metadata: " + e);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadMetadata();

    return () => {
      active = false;
    };
  }, []);

  return {
    data,
    loading,
    error,
  };
}