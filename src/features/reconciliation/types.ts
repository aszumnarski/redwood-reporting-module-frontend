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

  statusKey: ReconciliationStatusKey;
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
  expectedReconciliations: number;
  generatedReconciliations: number;
}

/* --------------------------------
 * Business status summary item
 * -------------------------------- */

export interface FetchReconciliationParams extends ReconciliationPeriod {
  companyCodes?: string[];
}

export interface RefreshReconciliationRequest extends ReconciliationPeriod {
  companyCode: string;
}

/* --------------------------------
 * Snapshot / refresh lifecycle state
 * (technical)
 * -------------------------------- */
export type ReconciliationSystemStatus =
  | "READY"
  | "RUNNING"
  | "ERROR"
  | "STALE";

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
  statusDictionary: Record<ReconciliationStatusKey, string>;
  statusSummariesByCompany: ReconciliationCompanyStatusSummary[];
  rows: ReconciliationRow[];
  systemStatus: ReconciliationCompanySystemStatus[];
}

export interface ReconciliationCompanyStatusSummary {
  companyCode: string;
  summary: ReconciliationStatusSummaryItem[];
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
  // Existing reconciliation workflow statuses
  | "T"
  | "C"
  | "C0"
  | "O"
  | "R"
  | "WA"
  | "WR"
  | "E"
  | "CERT_AUTO"
  | "CERT_MANUAL"
  | "DUE_IN"
  | "DUE_OVER";

export interface ReconciliationStatusSummaryItem {
  key: ReconciliationStatusKey;
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
