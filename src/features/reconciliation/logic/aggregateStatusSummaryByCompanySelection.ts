import type {
  ReconciliationCompanyStatusSummary,
  ReconciliationStatusSummaryItem,
  ReconciliationStatusKey,
} from "../types";
export function aggregateStatusSummaryByCompanySelection(
  summariesByCompany: ReconciliationCompanyStatusSummary[],
  selectedCompanyCodes: string[]
): ReconciliationStatusSummaryItem[] {
  if (!summariesByCompany || summariesByCompany.length === 0) {
    return [];
  }

  const selectedSet =
    selectedCompanyCodes.length > 0 ? new Set(selectedCompanyCodes) : undefined;

  const totals = new Map<ReconciliationStatusKey, number>();

  for (const companySummary of summariesByCompany) {
    if (selectedSet && !selectedSet.has(companySummary.companyCode)) {
      continue;
    }

    for (const bucket of companySummary.summary) {
      const existing = totals.get(bucket.key) ?? 0;
      totals.set(bucket.key, existing + bucket.count);
    }
  }

  return Array.from(totals.entries()).map(([key, count]) => ({
    key,
    count,
  }));
}
