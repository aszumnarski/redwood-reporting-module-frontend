import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";

import type { ReconciliationSystemStatus } from "../types";

interface Props {
  status?: ReconciliationSystemStatus;
}

export function SystemStatusIcon({ status }: Props) {
  if (!status) {
    return null;
  }

  switch (status) {
    case "READY":
      return <CheckCircleIcon color="success" />;

    case "RUNNING":
      return <AutorenewIcon color="primary" />;

    case "ERROR":
      return <ErrorIcon color="error" />;

    case "STALE":
      return <WarningIcon color="warning" />;

    default:
      return null;
  }
}