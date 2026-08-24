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
  certificationCategory: CertificationCategory;
  dueDateCategory: DueDateCategory;
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

  masterKey: string;
  masterTable: string;

  removedFromMaster: boolean;
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
  generatedButRemovedFromMaster: number;
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
  certificationDictionary: Record<CertificationCategory, string>;
  dueDateDictionary: Record<DueDateCategory, string>;
  statusSummariesByCompany: ReconciliationCompanyStatusSummary[];
  rows: ReconciliationRow[];
  systemStatus: ReconciliationCompanySystemStatus[];
}

export interface ReconciliationCompanyStatusSummary {
  companyCode: string;
  summary: ReconciliationStatusSummaryItem[];
  certification: ReconciliationCertificationSummaryItem[];
  dueDates: ReconciliationDueDateSummaryItem[];
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
  | "E"
  | "NYG";

  export type CertificationCategory =
  | "AUTO_CERTIFIED"
  | "MANUAL_CERTIFIED"
  | "NOT_COMPLETED";

  export type DueDateCategory =
  | "OVERDUE"
  | "IN_DUE_DATE"
  | "NOT_APPLICABLE";

export interface ReconciliationStatusSummaryItem {
  key: ReconciliationStatusKey;
  count: number;
}

export interface ReconciliationDueDateSummaryItem {
  key: DueDateCategory;
  count: number;
}

export interface ReconciliationCertificationSummaryItem {
  key: CertificationCategory;
  count: number;
}

export interface ReconciliationMetadataResponse {
  availableCompanyCodes: string[];

  defaultCompanyCodes: string[];

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
