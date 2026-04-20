import type { ReconciliationRow,ReconciliationCompanySystemStatus, ReconciliationStatusSummaryItem } from "./types";

export const MOCK_RECONCILIATION_ROWS: 
  ReconciliationRow[]
 = 
  [
    {
      jobId: "JOB-1001",
      jobStatus: "COMPLETED",
      startTime: "2026-04-01 09:00",
      endTime: "2026-04-01 09:12",
      companyCode: "7092",
      account: "400100",
      accountGroup: "ASSETS",
      preparer: "John Doe",
      preparerResponder: "",
      approver: "Jane Smith",
      approverResponder: "",
      reviewer: "Mike Taylor",
      reviewerResponder: "",
      certificationStatus: "Certified",
      preparerTimestamp: "2026-04-01 09:05",
      approverTimestamp: "2026-04-01 09:08",
      reviewerTimestamp: "2026-04-01 09:10",
      sapBalance: "125000",
      currency: "EUR",
      period: "P04",
      fiscalYear: "2026",
      preparerComment: "",
      approverComment: "",
      reviewerComment: "",
      certificationId: "CERT-001",
      reconciliationType: "AUTO",
      autoCertificationRule: "RULE-01",
      autoCertified: "Y",
      dueDate: "2026-04-05",
      accountCategory: "BALANCE",
      analyzedQuantity: "10",
      analyzedBalance: "100000",
      unanalyzedQuantity: "2",
      unanalyzedBalance: "25000",
      requestId: "REQ-01",
    },
  ];

export const KPI_DATA = {
  inScope: 120,
  successfullyGenerated: 98,
};

export const STATUS_SUMMARY_DATA: ReconciliationStatusSummaryItem[] = [
  { label: "Total reconciliations", value: 120 },
  { label: "Certified", value: 72 },
  { label: "Certified (no open items)", value: 15 },
  { label: "Open", value: 18 },
  { label: "Rejected", value: 5 },
  { label: "With approver", value: 6 },
  { label: "With reviewer", value: 3 },
  { label: "Error", value: 1 },
];


export const MOCK_SYSTEM_STATUS : ReconciliationCompanySystemStatus[] = [
  {
    companyCode: "7092",
    status: "READY",
    generatedAt: "2026-04-01T09:12:00Z",
  },
];
