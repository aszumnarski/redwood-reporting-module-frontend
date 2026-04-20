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
 * Aggregated reconciliation snapshot
 * (what the UI actually works with)
 * --------------------------------
 */
export interface ReconciliationSnapshotRow {
  companyCode: string;

  analyzedBalance: number;
  analyzedCount: number;

  unanalyzedBalance: number;
  unanalyzedCount: number;

  reconciliationFinalized: boolean;

  snapshotGeneratedAt: string;
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
  companyCode?: string; // undefined = All
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
export interface RefreshReconciliationRequest {
  fiscalYear: string;
  fiscalPeriod: string;
  companyCode: string;
}


export interface FetchReconciliationParams {
  fiscalYear: string;
  fiscalPeriod: string;
  companyCode?: string; // undefined = All
}



export interface RefreshReconciliationResponse {
  accepted: boolean;
  status: ReconciliationSystemStatus;
}

export interface ReconciliationStatusSummaryItem{
  label: string;
  value: number;
}