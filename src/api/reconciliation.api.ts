import type { FetchReconciliationResponse,FetchReconciliationParams,RefreshReconciliationRequest,RefreshReconciliationResponse } from "../features/reconciliation/types";

import {
  MOCK_RECONCILIATION_ROWS,
  KPI_DATA,
  STATUS_SUMMARY_DATA,
  MOCK_SYSTEM_STATUS,
} from "../features/reconciliation/mockDetailData";

export async function fetchReconciliationData(params: FetchReconciliationParams): Promise<FetchReconciliationResponse> {
  return Promise.resolve({
    period: {
      fiscalYear: params.fiscalYear,
      fiscalPeriod: params.fiscalPeriod,
    },
    kpis: KPI_DATA,
    statusSummary: STATUS_SUMMARY_DATA,
    rows: MOCK_RECONCILIATION_ROWS,
    systemStatus: MOCK_SYSTEM_STATUS,
  });
}


export async function requestReconciliationRefresh(
    request: RefreshReconciliationRequest
  ): Promise<RefreshReconciliationResponse> {
  
    console.log("Refresh requested:", request);
  
    return Promise.resolve({
      accepted: true,
      status: "RUNNING",
    });
  }
  
