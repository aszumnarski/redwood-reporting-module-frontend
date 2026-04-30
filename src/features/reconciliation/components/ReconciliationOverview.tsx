import { Stack, Box, Paper, Typography, Alert } from "@mui/material";

import type { ReconciliationKpis, ReconciliationSystemStatus } from "../types";

// ----------------------------------
// Props
// ----------------------------------

interface ReconciliationOverviewProps {
  kpis: ReconciliationKpis;
  systemStatus?: ReconciliationSystemStatus;
}

// ----------------------------------
// Component
// ----------------------------------

export function ReconciliationOverview({
  kpis,
  systemStatus,
}: ReconciliationOverviewProps) {
  const successRate =
    kpis.inScope > 0
      ? Math.round((kpis.successfullyGenerated / kpis.inScope) * 100)
      : 0;

  return (
    <Paper variant="outlined" sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Overview
      </Typography>

      {/* KPI cards */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <Box sx={{ flex: 1 }}>
          <KpiCard label="In scope" value={kpis.inScope} />
        </Box>

        <Box sx={{ flex: 1 }}>
          <KpiCard
            label="Successfully generated"
            value={kpis.successfullyGenerated}
            valueColor="success.main"
          />
        </Box>

        <Box sx={{ flex: 1 }}>
          <KpiCard label="Success rate" value={`${successRate}%`} />
        </Box>
      </Stack>

      {/* Status messaging */}
      {systemStatus === "RUNNING" && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Reconciliation refresh is currently running. KPI values may change.
        </Alert>
      )}

      {systemStatus === "STALE" && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          Data may be outdated. A refresh is recommended.
        </Alert>
      )}
    </Paper>
  );
}

interface KpiCardProps {
  label: string;
  value: string | number;
  valueColor?: string;
}

function KpiCard({ label, value, valueColor }: KpiCardProps) {
  return (
    <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
      <Stack spacing={0.5} sx={{ alignItems: "center" }}>
        <Typography variant="h4" sx={{ color: valueColor }}>
          {value}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
      </Stack>
    </Paper>
  );
}
