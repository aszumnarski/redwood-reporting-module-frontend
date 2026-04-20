import type { ReconciliationSystemStatus } from "../types"


export function resolvePrimaryButtonState(
    context: ButtonStateContext
  ): PrimaryButtonState {
  
    // 1️⃣ ALL companies → READ-ONLY
    if (context.isAllCompanies) {
      return {
        label: "Run report",
        action: "GET",
        disabled: false,
        requiresConfirmation: false,
        tooltip: "Fetch current reconciliation data",
      };
    }
  
    // 2️⃣ Refresh currently running
    if (context.systemStatus === "RUNNING") {
      return {
        label: "Refreshing…",
        action: "NONE",
        disabled: true,
        requiresConfirmation: false,
        tooltip: "Refresh in progress",
      };
    }
  
    // 3️⃣ Last refresh failed
    if (context.systemStatus === "ERROR") {
      return {
        label: "Retry refresh",
        action: "REFRESH",
        disabled: false,
        requiresConfirmation: true,
        tooltip: "Previous refresh failed. Retry?",
      };
    }
  
    // 4️⃣ Data stale → refresh recommended
    if (context.refreshRecommended) {
      return {
        label: "Refresh data",
        action: "REFRESH",
        disabled: false,
        requiresConfirmation: true,
        tooltip: "Data may be outdated. Refresh recommended.",
      };
    }
  
    // 5️⃣ Default: data ready & fresh
    return {
      label: "Run report",
      action: "GET",
      disabled: false,
      requiresConfirmation: false,
      tooltip: "Data is up to date",
    };
  }
 
  
  export interface PrimaryButtonState {
    label: string;
    action: PrimaryButtonAction;
    disabled: boolean;
    requiresConfirmation: boolean;
    tooltip?: string;
  }
  
  export interface ButtonStateContext {
    isAllCompanies: boolean;
    systemStatus?: ReconciliationSystemStatus; // undefined for ALL
    refreshRecommended: boolean;
  }
  
  export type PrimaryButtonAction = "GET" | "REFRESH" | "NONE";