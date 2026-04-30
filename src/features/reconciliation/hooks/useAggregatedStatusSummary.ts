import { useMemo } from "react";

import { aggregateStatusSummaryByCompanySelection } from "../logic/aggregateStatusSummaryByCompanySelection";

import type {
  ReconciliationCompanyStatusSummary,
  ReconciliationStatusSummaryItem,
} from "../types";

interface UseAggregatedStatusSummaryParams {
  statusSummariesByCompany?: ReconciliationCompanyStatusSummary[];
  selectedCompanyCodes: string[];
}

export function useAggregatedStatusSummary({
  statusSummariesByCompany = [],
  selectedCompanyCodes,
}: UseAggregatedStatusSummaryParams): ReconciliationStatusSummaryItem[] {

  return useMemo(() => {
    return aggregateStatusSummaryByCompanySelection(
      statusSummariesByCompany,
      selectedCompanyCodes
    );
  }, [statusSummariesByCompany, selectedCompanyCodes]);
}