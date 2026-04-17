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
    preparerTimestamp: string;
    approverTimestamp: string;
    reviewerTimestamp: string;
  
    sapBalance: string;
    currency: string;
    period: string;
    fiscalYear: string;
  
    preparerComment: string;
    approverComment: string;
    reviewerComment: string;
  
    certificationId: string;
    reconciliationType: string;
  
    autoCertificationRule: string;
    autoCertified: string;
  
    dueDate: string;
    accountCategory: string;
  
    analyzedQuantity: string;
    analyzedBalance: string;
    unanalyzedQuantity: string;
    unanalyzedBalance: string;
  
    requestId: string;
  }