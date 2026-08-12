import type { ReconciliationCompanyStatusSummary } from "../types";

export function aggregateStatusSummaryByCompanySelection<T extends string>(
  summariesByCompany: ReconciliationCompanyStatusSummary[],
  selectedCompanyCodes: string[],
  selector: (company: ReconciliationCompanyStatusSummary) => {
    key: T;
    count: number;
  }[]
): { key: T; count: number }[] {
  if (!summariesByCompany?.length) {
    return [];
  }

  const selectedSet =
    selectedCompanyCodes.length > 0 ? new Set(selectedCompanyCodes) : undefined;

  const totals = new Map<T, number>();

  for (const companySummary of summariesByCompany) {
    if (selectedSet && !selectedSet.has(companySummary.companyCode)) {
      continue;
    }

    for (const bucket of selector(companySummary)) {
      totals.set(bucket.key, (totals.get(bucket.key) ?? 0) + bucket.count);
    }
  }

  return Array.from(totals.entries()).map(([key, count]) => ({
    key,
    count,
  }));
}
