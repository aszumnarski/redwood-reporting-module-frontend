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

export function useReconciliationViewState({
  data,
  selectedCompanyCodes,
  selectedStatusKey,
}: UseReconciliationViewStateParams) {
  const aggregatedStatusSummary = useAggregatedStatusSummary({
    statusSummariesByCompany: data?.statusSummariesByCompany,
    selectedCompanyCodes,
  });

  
const reconciliationSummary = aggregatedStatusSummary.filter(item =>
  ["T", "C", "C0", "O", "R", "WA", "WR", "E", "NYG"].includes(item.key)
);

const certificationSummary = aggregatedStatusSummary.filter(item =>
  ["CERT_AUTO", "CERT_MANUAL"].includes(item.key)
);

const dueDateSummary = aggregatedStatusSummary.filter(item =>
  ["DUE_IN", "DUE_OVER"].includes(item.key)
);


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

  const systemStatusForSelection = useMemo(() => {
    if (!data) return [];

    return data.systemStatus.filter((s) =>
      selectedCompanyCodes.includes(s.companyCode)
    );
  }, [data, selectedCompanyCodes]);

  const detailRows: ReconciliationRow[] = useMemo(() => {
    if (!data || !selectedStatusKey) return [];

    return filterRowsByStatus(data.rows, selectedStatusKey);
  }, [data, selectedStatusKey]);


  return {
    reconciliationSummary,
    certificationSummary,
    dueDateSummary,
    selectedCompanySystemStatus,
    systemStatusForSelection,
    detailRows,
  };
  
}

function filterRowsByStatus(
  rows: ReconciliationRow[],
  statusKey: ReconciliationStatusKey
): ReconciliationRow[] {
  if (statusKey === "T") return rows;
  return rows.filter((r) => r.statusKey === statusKey);  
}
