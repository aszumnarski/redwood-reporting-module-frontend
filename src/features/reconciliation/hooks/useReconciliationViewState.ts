import { useMemo } from "react";
import { useAggregatedStatusSummary } from "./useAggregatedStatusSummary";
import type {
  FetchReconciliationResponse,
  ReconciliationRow,
  ReconciliationStatusKey,
  ReconciliationSystemStatus,
} from "../types";

interface UseReconciliationViewStateParams {
  data: FetchReconciliationResponse | null;
  selectedCompanyCodes: string[];
  selectedStatusKey: ReconciliationStatusKey | null;
}

/**
 * Encapsulates all reconciliation-specific view derivation logic.
 * This hook is PURE: no side effects, no API calls, no UI state.
 */
export function useReconciliationViewState({
  data,
  selectedCompanyCodes,
  selectedStatusKey,
}: UseReconciliationViewStateParams) {
  const aggregatedStatusSummary = useAggregatedStatusSummary({
    statusSummariesByCompany: data?.statusSummariesByCompany,
    selectedCompanyCodes,
  });

  const selectedCompanySystemStatus = useMemo<
    ReconciliationSystemStatus | undefined
  >(() => {
    if (!data || selectedCompanyCodes.length === 0) {
      return undefined;
    }

    const statuses = data.systemStatus
      .filter((s) => selectedCompanyCodes.includes(s.companyCode))
      .map((s) => s.status);

    if (statuses.includes("RUNNING")) return "RUNNING";
    if (statuses.includes("ERROR")) return "ERROR";
    if (statuses.includes("STALE")) return "STALE";

    return "READY";
  }, [data, selectedCompanyCodes]);

  const detailRows: ReconciliationRow[] = useMemo(() => {
    if (!data || !selectedStatusKey) return [];

    return filterRowsByStatus(data.rows, selectedStatusKey);
  }, [data, selectedStatusKey]);

  return {
    aggregatedStatusSummary,
    selectedCompanySystemStatus,
    detailRows,
  };
}

function filterRowsByStatus(
  rows: ReconciliationRow[],
  statusKey: ReconciliationStatusKey
): ReconciliationRow[] {
  switch (statusKey) {
    case "T":
      return rows;

    case "C":
      return rows.filter((r) => r.certificationStatus === "Certified");

    case "C0":
      return rows.filter(
        (r) =>
          r.certificationStatus === "Certified" &&
          Number(r.unanalyzedQuantity) === 0
      );

    case "O":
      return rows.filter((r) => r.certificationStatus === "Open");

    case "R":
      return rows.filter((r) => r.certificationStatus === "Rejected");

    case "WA":
      return rows.filter(
        (r) =>
          r.certificationStatus === "Open" &&
          Boolean(r.approver) &&
          !r.approverResponder
      );

    case "WR":
      return rows.filter(
        (r) =>
          r.certificationStatus === "Open" &&
          Boolean(r.reviewer) &&
          !r.reviewerResponder
      );

    case "E":
      return rows.filter((r) => r.jobStatus === "ERROR");

    default:
      return [];
  }
}
