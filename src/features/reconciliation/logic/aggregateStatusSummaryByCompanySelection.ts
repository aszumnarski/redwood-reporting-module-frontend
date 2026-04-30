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

  const totals = new Map<
    ReconciliationStatusKey,
    { label: string; count: number }
  >();

  for (const companySummary of summariesByCompany) {
    if (selectedSet && !selectedSet.has(companySummary.companyCode)) {
      continue;
    }

    for (const bucket of companySummary.summary) {
      const existing = totals.get(bucket.key);

      if (existing) {
        existing.count += bucket.count;
      } else {
        totals.set(bucket.key, {
          label: bucket.label,
          count: bucket.count,
        });
      }
    }
  }

  return Array.from(totals.entries()).map(([key, value]) => ({
    key,
    label: value.label,
    count: value.count,
  }));
}
