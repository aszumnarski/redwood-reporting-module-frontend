// features/appInfo/hooks/useApplicationInfo.ts
import { useEffect, useState } from "react";
import { fetchApplicationInfo } from "../../../api/reconciliation.api";
import type { ApplicationInfo } from "../types";

const FALLBACK_INFO: ApplicationInfo = {
  applicationName: "Reconciliation Dashboard",

  uiVersion: "unknown",
  uiBuildTime: "unknown",

  backendVersion: "unknown",
  backendBuildTime: "unknown",

  environment: "unknown",
  supportContact: "unknown",
};



export function useApplicationInfo() {
  const [info, setInfo] = useState<ApplicationInfo>(FALLBACK_INFO);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplicationInfo()
      .then(setInfo)
      .catch(() => setInfo(FALLBACK_INFO))
      .finally(() => setLoading(false));
  }, []);

  return { info, loading };

}
