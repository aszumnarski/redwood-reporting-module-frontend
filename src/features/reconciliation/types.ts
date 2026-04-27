export interface ReconciliationRow {
  jobId: string;
  jobStatus: string;
  startTime: string;
  endTime: string;

  companyCode: string;
  account: string;
  accountGroup: string;

  preparer: string;
  preparerResponder: string;
  approver: string;
  approverResponder: string;
  reviewer: string;
  reviewerResponder: string;

  certificationStatus: string;
  preparerTimestamp?: string;
  approverTimestamp?: string;
  reviewerTimestamp?: string;

  sapBalance: string;
  currency: string;
  period: string;
  fiscalYear: string;

  preparerComment?: string;
  approverComment?: string;
  reviewerComment?: string;

  certificationId: string;
  reconciliationType: string;

  autoCertificationRule: string;
  autoCertified?: string;

  dueDate: string;
  accountCategory: string;

  analyzedQuantity: string;
  analyzedBalance: string;
  unanalyzedQuantity: string;
  unanalyzedBalance: string;

  requestId: string;
}

/**
 * --------------------------------
 * Reconciliation period identifier
 * --------------------------------
 */

export interface ReconciliationPeriod {
  fiscalYear: string;
  fiscalPeriod: string; // e.g. P04
}

/* --------------------------------
 * KPI summary (business level)
 * -------------------------------- */
export interface ReconciliationKpis {
  inScope: number;
  successfullyGenerated: number;
}

/* --------------------------------
 * Business status summary item
 * -------------------------------- */

export interface FetchReconciliationParams extends ReconciliationPeriod {
  companyCodes?: string[]; // undefined = All
}

export interface RefreshReconciliationRequest extends ReconciliationPeriod {
  companyCode: string;
}

/* --------------------------------
 * Snapshot / refresh lifecycle state
 * (technical)
 * -------------------------------- */
export type ReconciliationSystemStatus = "READY" | "RUNNING" | "ERROR";

export interface ReconciliationCompanySystemStatus {
  companyCode: string;
  status: ReconciliationSystemStatus;
  generatedAt?: string;
  errorMessage?: string;
}

/**
 * --------------------------------
 * API response: GET /reconciliation
 * --------------------------------
 */

export interface FetchReconciliationResponse {

  period: ReconciliationPeriod;
  kpis: ReconciliationKpis;
  statusSummary: ReconciliationStatusSummaryItem[];
  rows: ReconciliationRow[];
  systemStatus: ReconciliationCompanySystemStatus[];
}

/**
 * --------------------------------
 * API request / response: refresh
 * --------------------------------
 */
export interface RefreshReconciliationResponse {
  accepted: boolean;
  status: ReconciliationSystemStatus;
}

export type ReconciliationStatusKey =
  | "T"
  | "C"
  | "C0"
  | "O"
  | "R"
  | "WA"
  | "WR"
  | "E";

export interface ReconciliationStatusSummaryItem {
  key: ReconciliationStatusKey;
  label: string;
  count: number;
}

export interface ReconciliationMetadataResponse {
  availableCompanyCodes: string[];

  defaultCompanyCodes: string[]; // usually all

  availablePeriods: ReconciliationPeriod[];

  defaultPeriod: ReconciliationPeriod;
}

export interface ApplicationInfo {
  applicationName: string;

  uiVersion: string;
  uiBuildTime: string;

  backendVersion: string;
  backendBuildTime: string;

  environment: string;

  supportContact: string;
}



export const UI_INFO = {
  applicationName: "Reconciliation Dashboard",
  uiVersion: import.meta.env.VITE_APP_VERSION ?? "unknown",
  uiBuildTime: import.meta.env.VITE_APP_BUILD_TIME ?? "unknown",
};


console.log("VITE_APP_VERSION", import.meta.env.VITE_APP_VERSION);
console.log("VITE_APP_BUILD_TIME", import.meta.env.VITE_APP_BUILD_TI);


export interface BackendInfo {
  backendVersion: string;
  backendBuildTime: string;
  environment: string;
  supportContact: string;
}

