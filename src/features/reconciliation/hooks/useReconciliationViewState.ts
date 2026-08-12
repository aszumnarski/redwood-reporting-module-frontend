import { useMemo } from "react";

import type {
  FetchReconciliationResponse,
  ReconciliationRow,
  ReconciliationStatusKey,
  ReconciliationSystemStatus,
} from "../types";

import { aggregateStatusSummaryByCompanySelection } from "../logic/aggregateStatusSummaryByCompanySelection";

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

  const reconciliationSummary =
  aggregateStatusSummaryByCompanySelection(
    data?.statusSummariesByCompany ?? [],
    selectedCompanyCodes,
    company => company.summary
  );
  
  const certificationSummary =
  aggregateStatusSummaryByCompanySelection(
    data?.statusSummariesByCompany ?? [],
    selectedCompanyCodes,
    company => company.certification
  );
  
  const dueDateSummary =
  aggregateStatusSummaryByCompanySelection(
    data?.statusSummariesByCompany ?? [],
    selectedCompanyCodes,
    company => company.dueDates
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
