import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  MenuItem,
  CircularProgress,
} from "@mui/material";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

import { Alert } from "@mui/material";

import { useEffect, useState } from "react";

import {
  fetchReconciliationData,
  requestReconciliationRefresh,
} from "../../api/reconciliation.api";

import type {
  FetchReconciliationResponse,
  FetchReconciliationParams,
  ReconciliationRow,
  ReconciliationStatusKey,
} from "../reconciliation/types";

import { StatusSummaryTable } from "./components/StatusSummaryTable";
import { StatusSummaryChart } from "./components/StatusSummaryChart";
import { ReconciliationDetailTable } from "./components/ReconciliationDetailTable";
import { DonutChart } from "./components/DonutChart";

import { resolvePrimaryButtonState } from "./logic/primaryButtonStateResolver";

function getCurrentYearMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function toFetchParams(
  yearMonth: string,
  companyCode: string
): FetchReconciliationParams {
  const [year, month] = yearMonth.split("/");

  return {
    fiscalYear: year,
    fiscalPeriod: `P${month}`,
    companyCode: companyCode === "All" ? undefined : companyCode,
  };
}

// -------------------------------
// Component
// -------------------------------

export function ReconciliationRunnerPage() {
  // -------- Filter state (what user selects) --------
  const [companyCode, setCompanyCode] = useState<string>("All");
  const [yearMonth, setYearMonth] = useState<string>(getCurrentYearMonth());
  const [viewMode, setViewMode] = useState<"table" | "chart">("table");

  // -------- API state (single source of truth) --------
  const [data, setData] = useState<FetchReconciliationResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // -------- UI-only state --------

  const [selectedStatusKey, setSelectedStatusKey] = useState<ReconciliationStatusKey | null>(null);
  const [refreshSubmitting, setRefreshSubmitting] = useState(false);
  const [confirmRefreshOpen, setConfirmRefreshOpen] = useState(false);

  useEffect(() => {
    if (data && data.statusSummary.length > 0 && selectedStatusKey === null) {
      setSelectedStatusKey(data.statusSummary[0].key);
    }
  }, [data, selectedStatusKey]);

  // -------------------------------
  // Initial load (optional)
  // -------------------------------
  useEffect(() => {
    runReport(); // auto-run for current period
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------------------------------
  // Actions
  // -------------------------------

  function openConfirmRefreshModal() {
    setConfirmRefreshOpen(true);
  }

  function closeConfirmRefreshModal() {
    setConfirmRefreshOpen(false);
  }

  async function runReport() {
    const params = toFetchParams(yearMonth, companyCode);
    setSelectedStatusKey(null);
    setLoading(true);
    setError(null);

    try {
      const response = await fetchReconciliationData(params);

      setData(response);

      // reset selection when new data arrives
      setSelectedStatusKey(null);
    } catch (e) {
      setError("Failed to load reconciliation data");
    } finally {
      setLoading(false);
    }
  }

  console.log("selectedStatusKey:", selectedStatusKey);

  function filterRowsByStatus(
    rows: ReconciliationRow[],
    selectedStatusKey: string
  ): ReconciliationRow[] {
    switch (selectedStatusKey) {
      case "T":
        return rows;

      case "C":
        return rows.filter((row) => row.certificationStatus === "Certified");

      case "C0":
        return rows.filter(
          (row) =>
            row.certificationStatus === "Certified" &&
            Number(row.unanalyzedQuantity) === 0
        );

      case "O":
        return rows.filter((row) => row.certificationStatus === "Open");

      case "R":
        return rows.filter((row) => row.certificationStatus === "Rejected");

      case "WA":
        return rows.filter(
          (row) =>
            row.certificationStatus === "Open" &&
            Boolean(row.approver) &&
            !row.approverResponder
        );

      case "WR":
        return rows.filter(
          (row) =>
            row.certificationStatus === "Open" &&
            Boolean(row.reviewer) &&
            !row.reviewerResponder
        );

      case "E":
        return rows.filter((row) => row.jobStatus === "ERROR");

      default:
        return [];
    }
  }

  const detailRows =
    data && selectedStatusKey ? filterRowsByStatus(data.rows, selectedStatusKey) : [];

  const selectedCompanySystemStatus =
    !data || companyCode === "All"
      ? undefined
      : data.systemStatus.find((s) => s.companyCode === companyCode)?.status;

  const shouldPoll = selectedCompanySystemStatus === "RUNNING";

  const refreshRecommended = Boolean(
    data && companyCode !== "All" && selectedCompanySystemStatus === "READY"
  );

  const primaryButtonState = resolvePrimaryButtonState({
    isAllCompanies: companyCode === "All",
    systemStatus: selectedCompanySystemStatus,
    refreshRecommended,
  });

  useEffect(() => {
    if (!shouldPoll) return;

    const POLL_INTERVAL_MS = 5000; // 5 seconds

    const intervalId = setInterval(() => {
      runReport();
    }, POLL_INTERVAL_MS);

    return () => {
      clearInterval(intervalId);
    };
  }, [shouldPoll]);

  // -------------------------------
  // Render
  // -------------------------------

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Reconciliation Status Dashboard
      </Typography>

      {/* ==============================
          Filters
         ============================== */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          sx={{
            alignItems: { md: "center" },
          }}
        >
          {/* Company Code */}
          <TextField
            select
            label="Company Code"
            value={companyCode}
            size="small"
            onChange={(e) => setCompanyCode(e.target.value)}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="1000">1000</MenuItem>
            <MenuItem value="2000">2000</MenuItem>
          </TextField>

          {/* Period */}
          <TextField
            select
            label="Period"
            value={yearMonth}
            size="small"
            onChange={(e) => setYearMonth(e.target.value)}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="2026/01">2026/01</MenuItem>
            <MenuItem value="2026/02">2026/02</MenuItem>
            <MenuItem value="2026/03">2026/03</MenuItem>
            <MenuItem value="2026/04">2026/04</MenuItem>
          </TextField>

          <Button
            variant="contained"
            size="small"
            disabled={primaryButtonState.disabled}
            title={primaryButtonState.tooltip}
            onClick={() => {
              if (primaryButtonState.action === "GET") {
                runReport();
              }

              if (primaryButtonState.action === "REFRESH") {
                if (primaryButtonState.requiresConfirmation) {
                  openConfirmRefreshModal();
                }
              }
            }}
          >
            {primaryButtonState.label}
          </Button>
          {selectedCompanySystemStatus === "RUNNING" && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Reconciliation data refresh is currently running. The view will
              update automatically once the refresh is complete.
            </Alert>
          )}
        </Stack>
      </Paper>

      {/* ==============================
          Loading / Error
         ============================== */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {/* ==============================
          Main content
         ============================== */}
      {data && (
        <>
          {/* Status summary */}
          <Paper variant="outlined" sx={{ p: 3, mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Status summary
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 3,
              }}
            >
              {/* LEFT */}
              <Box sx={{ flex: 2 }}>
                <Box
                  sx={{
                    mb: 2,
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <ToggleButtonGroup
                    value={viewMode}
                    exclusive
                    size="small"
                    onChange={(_, value) => value && setViewMode(value)}
                  >
                    <ToggleButton value="table">Table</ToggleButton>
                    <ToggleButton value="chart">Chart</ToggleButton>
                  </ToggleButtonGroup>
                </Box>

                {viewMode === "table" && (
                  <StatusSummaryTable
                    data={data.statusSummary}
                    selectedStatusKey={selectedStatusKey}
                    onSelect={(item) => setSelectedStatusKey(item)}
                  />
                )}

                {viewMode === "chart" && (
                  <StatusSummaryChart
                    data={data.statusSummary}
                    selectedStatusKey={selectedStatusKey}
                    onSelect={(item) => setSelectedStatusKey(item)}
                  />
                )}
              </Box>

              {/* RIGHT */}
              <Box sx={{ flex: 1 }}>
                <DonutChart
                  label="Certification overview"
                  value={68}
                  color="#1976d2"
                />
                <DonutChart
                  label="Due date overview"
                  value={82}
                  color="#2e7d32"
                />
              </Box>
            </Box>
          </Paper>

          {/* Details */}
          {selectedStatusKey && (
            <ReconciliationDetailTable
              status={selectedStatusKey}
              rows={detailRows}
            />
          )}
        </>
      )}

      <Dialog
        open={confirmRefreshOpen}
        onClose={closeConfirmRefreshModal}
        aria-labelledby="confirm-refresh-title"
        aria-describedby="confirm-refresh-description"
      >
        <DialogTitle id="confirm-refresh-title">
          Refresh reconciliation data?
        </DialogTitle>

        <DialogContent>
          <DialogContentText id="confirm-refresh-description">
            This operation may take up to <strong>10 minutes</strong>.
            <br />
            <br />
            During this time, reconciliation data will be recalculated and
            refresh will be unavailable for this company.
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeConfirmRefreshModal} color="inherit">
            Cancel
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={async () => {
              if (!data) return;
              setRefreshSubmitting(true);
              closeConfirmRefreshModal();

              try {
                await requestReconciliationRefresh({
                  fiscalYear: data.period.fiscalYear,
                  fiscalPeriod: data.period.fiscalPeriod,
                  companyCode,
                });

                runReport();
              } catch (e) {
                console.error("Failed to start refresh", e);
              } finally {
                setRefreshSubmitting(false);
              }
            }}
          >
            Refresh data
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
