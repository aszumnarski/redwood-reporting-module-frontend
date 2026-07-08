import { useState, useCallback } from "react";
import { requestReconciliationRefresh } from "../../../api/reconciliation.api";

interface SubmitRefreshParams {
  companyCode: string;
  fiscalYear: string;
  fiscalPeriod: string;
}

export function useReconciliationRefresh() {
  // UI-only transport guard (per company)
  const [submittingByCompany, setSubmittingByCompany] = useState<
    Record<string, boolean>
  >({});

  const isSubmitting = useCallback(
    (companyCode: string) => submittingByCompany[companyCode] === true,
    [submittingByCompany]
  );

  const submitRefresh = useCallback(
    async ({ companyCode, fiscalYear, fiscalPeriod }: SubmitRefreshParams) => {
      setSubmittingByCompany((prev) => ({
        ...prev,
        [companyCode]: true,
      }));

      try {
        await requestReconciliationRefresh(
          fiscalYear,
          fiscalPeriod,
          [companyCode],
        );
      } finally {
        setSubmittingByCompany((prev) => {
          const next = { ...prev };
          delete next[companyCode];
          return next;
        });
      }
    },
    []
  );

  return {
    isSubmitting,
    submitRefresh,
  };
}
