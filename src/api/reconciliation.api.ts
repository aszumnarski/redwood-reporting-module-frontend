import type {
  FetchReconciliationResponse,
  FetchReconciliationParams,
  RefreshReconciliationResponse,
  ReconciliationMetadataResponse,
  ApplicationInfo,
} from "../features/reconciliation/types";

import.meta.env.MODE; // "development" | "production"
import.meta.env.DEV; // boolean
import.meta.env.PROD; // boolean

import { getApiBase } from "./apiBase";


export async function fetchReconciliationData(
  params: FetchReconciliationParams
): Promise<FetchReconciliationResponse> {

  const query = new URLSearchParams();

  if (params.fiscalYear != null) {
    query.set("fiscalYear", String(params.fiscalYear));
  }

  if (params.fiscalPeriod != null) {
    query.set("fiscalPeriod", String(params.fiscalPeriod));
  }

  if (params.companyCodes?.length) {
    query.set("companyCodes", params.companyCodes.join(","));
  }
  console.log("API Base:", getApiBase());
  const url =
    `${getApiBase()}/reconciliation/report` +
    (query.toString() ? `?${query.toString()}` : "");

  const response = await fetch(url, {
    method: "GET",
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch reconciliation data: ${response.status}`);
  }

  return response.json();
}



export async function requestReconciliationRefresh(
  fiscalYear: string,
  fiscalPeriod: string,
  companyCodes: string[]
): Promise<RefreshReconciliationResponse> {
  console.log("API Base:", getApiBase());
  const response = await fetch(
    `${getApiBase()}/reconciliation/regenerate`,
    {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        fiscalYear,
        fiscalPeriod,
        companyCodes,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to request reconciliation refresh: ${response.status}`
    );
  }

  return response.json();
}


export async function fetchReconciliationMetadata(): Promise<ReconciliationMetadataResponse> {
  const response = await fetch(`${getApiBase()}/reconciliation/metadata`, {
    method: "GET",
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
    },
  });

  if (import.meta.env.DEV) {
    console.log("Backend debug:", response.headers.get("X-Debug-Flow"));
  }

  if (!response.ok) {
    throw new Error(
      `Failed to fetch reconciliation metadata: ${response.status}`
    );
  }

  return response.json();
}

export async function fetchApplicationInfo(): Promise<ApplicationInfo> {
  const response = await fetch(`${getApiBase()}/system/info`, {
    method: "GET",
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
    },
  });

  if (import.meta.env.DEV) {
    console.log("Backend debug:", response.headers.get("X-Debug-Flow"));
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch application info: ${response.status}`);
  }

  return response.json();
}

export async function fetchHealth(): Promise<void> {
  const response = await fetch(`${getApiBase()}/health`, {
    method: "GET",
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Health check failed: ${response.status}`);
  }

  if (import.meta.env.DEV) {
    console.log("Backend debug:", response.headers.get("X-Debug-Flow"));
  }
}
