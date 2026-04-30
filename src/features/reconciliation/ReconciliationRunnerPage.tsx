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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Checkbox,
  ListItemText,
} from "@mui/material";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import IconButton from "@mui/material/IconButton";

import { useApplicationInfo } from "./hooks/useApplicationInfo";
import { AboutDialog } from "./components/AboutDialog";

import { useEffect, useState, useMemo } from "react";

import { fetchReconciliationData } from "../../api/reconciliation.api";

import type {
  FetchReconciliationResponse,
  FetchReconciliationParams,
  ReconciliationStatusKey,
} from "../reconciliation/types";

import { StatusSummaryTable } from "./components/StatusSummaryTable";
import { StatusSummaryChart } from "./components/StatusSummaryChart";
import { ReconciliationDetailTable } from "./components/ReconciliationDetailTable";
import { DonutChart } from "./components/DonutChart";
import { ReconciliationOverview } from "./components/ReconciliationOverview";

import { resolvePrimaryButtonState } from "./logic/primaryButtonStateResolver";
import { useReconciliationRefresh } from "./hooks/useReconciliationRefresh";
import { useReconciliationPolling } from "./hooks/useReconciliationPolling";
import { useReconciliationViewState } from "./hooks/useReconciliationViewState";
import { useReconciliationMetadata } from "./hooks/useReconciliationMetadata";

import { resolveCompanyScope } from "./utils/companyScope";

function toFetchParams(
  yearMonth: string,
  companyCodes?: string[]
): FetchReconciliationParams {
  const [year, month] = yearMonth.split("/");

  return {
    fiscalYear: year,
    fiscalPeriod: month,
    companyCodes,
  };
}

// -------------------------------
// Component
// -------------------------------

export function ReconciliationRunnerPage() {
  // -------- Filter state (what user selects) --------
  const [selectedCompanyCodes, setSelectedCompanyCodes] = useState<string[]>(
    []
  );

  const [yearMonth, setYearMonth] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "chart">("table");

  // -------- API state --------
  const [data, setData] = useState<FetchReconciliationResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const {
    data: metadata,
    loading: metadataLoading,
    error: metadataError,
  } = useReconciliationMetadata();

  // -------- UI-only state --------

  const [selectedStatusKey, setSelectedStatusKey] =
    useState<ReconciliationStatusKey | null>(null);

  const [confirmRefreshOpen, setConfirmRefreshOpen] = useState(false);

  const { isSubmitting, submitRefresh } = useReconciliationRefresh();

  const availableCompanyCodes = metadata?.availableCompanyCodes ?? [];
  const availablePeriods = metadata?.availablePeriods ?? [];
  const defaultCompanyCodes = metadata?.defaultCompanyCodes ?? [];
  const defaultPeriod = metadata?.defaultPeriod;

  const { info: appInfo } = useApplicationInfo();
  const [aboutOpen, setAboutOpen] = useState(false);

  const isRefreshSubmittingForSelectedCompanies = selectedCompanyCodes.some(
    (code) => isSubmitting(code)
  );

  const { aggregatedStatusSummary, selectedCompanySystemStatus, detailRows } =
    useReconciliationViewState({
      data,
      selectedCompanyCodes,
      selectedStatusKey,
    });

  const statusLabelByKey = useMemo(() => {
    return Object.fromEntries(
      aggregatedStatusSummary.map((s) => [s.key, s.label])
    );
  }, [aggregatedStatusSummary]);

  const selectedStatusLabel =
    selectedStatusKey != null ? statusLabelByKey[selectedStatusKey] : undefined;

  const effectiveCompanyCodes = resolveCompanyScope(
    selectedCompanyCodes,
    availableCompanyCodes
  );

  const primaryButtonState = resolvePrimaryButtonState({
    isAllCompanies: effectiveCompanyCodes === undefined,
    systemStatus: selectedCompanySystemStatus,
  });

  // -------------------------------
  // Effects
  // -------------------------------

  useEffect(() => {
    if (aggregatedStatusSummary.length > 0 && selectedStatusKey === null) {
      setSelectedStatusKey(aggregatedStatusSummary[0].key);
    }
  }, [aggregatedStatusSummary, selectedStatusKey]);

  useEffect(() => {
    if (selectedCompanyCodes.length > 0) return;
    if (availableCompanyCodes.length === 0) return;

    // Prefer backend-defined defaults if present
    const initialSelection =
      defaultCompanyCodes.length > 0
        ? defaultCompanyCodes
        : availableCompanyCodes;

    setSelectedCompanyCodes(initialSelection);
  }, [availableCompanyCodes, defaultCompanyCodes, selectedCompanyCodes]);

  useEffect(() => {
    console.log("period defaults", defaultPeriod);
    if (!yearMonth && defaultPeriod) {
      const value = `${
        defaultPeriod.fiscalYear
      }/${defaultPeriod.fiscalPeriod.replace("P", "")}`;
      setYearMonth(value);
    }
  }, [defaultPeriod, yearMonth]);

  useEffect(() => {
    console.log("effect check", { yearMonth, selectedCompanyCodes });
    if (yearMonth && selectedCompanyCodes.length > 0) {
      runReport();
    }
  }, [yearMonth, selectedCompanyCodes]);

  // -------------------------------
  // Actions
  // -------------------------------

  async function runReport() {
    console.log("runReport called", {
      yearMonth,
      selectedCompanyCodes,
      effectiveCompanyCodes,
    });

    if (!yearMonth) return;

    const params = toFetchParams(yearMonth, effectiveCompanyCodes);

    setSelectedStatusKey(null);
    setLoading(true);
    setError(null);

    try {
      const response = await fetchReconciliationData(params);
      setData(response);
    } catch (e) {
      setError("Failed to load reconciliation data: " + e);
    } finally {
      setLoading(false);
    }
  }

  const isSingleCompanyUser = availableCompanyCodes.length === 1;

  const isSomeCompaniesSelected =
    selectedCompanyCodes.length > 0 &&
    selectedCompanyCodes.length < availableCompanyCodes.length;

  // -------------------------------
  // Polling when backend is RUNNING
  // -------------------------------

  const shouldPoll = selectedCompanySystemStatus === "RUNNING";

  useReconciliationPolling(shouldPoll, runReport, 5000);

  // -------------------------------
  // Render
  // -------------------------------

  if (metadataLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (metadataError) {
    return (
      <Typography color="error">
        Failed to load reconciliation metadata
      </Typography>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h5">Reconciliation Status Dashboard</Typography>

        <IconButton onClick={() => setAboutOpen(true)}>
          <InfoOutlinedIcon />
        </IconButton>
      </Box>

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
            label="Company Codes"
            size="small"
            sx={{ minWidth: 320 }}
            value={selectedCompanyCodes}
            disabled={isSingleCompanyUser}
            slotProps={{
              select: {
                multiple: true,
                renderValue: () =>
                  effectiveCompanyCodes === undefined
                    ? "All companies"
                    : selectedCompanyCodes.join(", "),
              },
            }}
          >
            {!isSingleCompanyUser && (
              <MenuItem disableRipple>
                <Checkbox
                  checked={effectiveCompanyCodes === undefined}
                  indeterminate={isSomeCompaniesSelected}
                  onClick={(e) => {
                    e.stopPropagation();

                    // Only act when not already all selected
                    if (effectiveCompanyCodes !== undefined) {
                      setSelectedCompanyCodes(availableCompanyCodes);
                    }
                  }}
                />

                <ListItemText primary="All companies" />
              </MenuItem>
            )}

            {availableCompanyCodes.map((code) => {
              const isChecked = selectedCompanyCodes.includes(code);
              const isOnlySelected =
                selectedCompanyCodes.length === 1 && isChecked;

              return (
                <MenuItem key={code}>
                  <Checkbox
                    checked={isChecked}
                    onClick={(e) => {
                      e.stopPropagation();

                      if (isChecked && selectedCompanyCodes.length === 1) {
                        // prevent empty selection
                        return;
                      }

                      if (isChecked) {
                        setSelectedCompanyCodes(
                          selectedCompanyCodes.filter((c) => c !== code)
                        );
                      } else {
                        setSelectedCompanyCodes([
                          ...selectedCompanyCodes,
                          code,
                        ]);
                      }
                    }}
                  />

                  <ListItemText primary={code} />

                  {/* ONLY action */}
                  {!isSingleCompanyUser && !isOnlySelected && (
                    <Box sx={{ ml: "auto" }}>
                      <Button
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation(); // ✅ critical
                          setSelectedCompanyCodes([code]);
                        }}
                      >
                        Only
                      </Button>
                    </Box>
                  )}
                </MenuItem>
              );
            })}
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
            {availablePeriods.map((p) => {
              const value = `${p.fiscalYear}/${p.fiscalPeriod.replace(
                "P",
                ""
              )}`;
              return (
                <MenuItem key={value} value={value}>
                  {value}
                </MenuItem>
              );
            })}
          </TextField>

          <Button
            variant="contained"
            size="small"
            disabled={
              primaryButtonState.disabled ||
              isRefreshSubmittingForSelectedCompanies
            }
            title={
              isRefreshSubmittingForSelectedCompanies
                ? "Starting refresh…"
                : primaryButtonState.tooltip
            }
            onClick={() => {
              if (primaryButtonState.action === "GET") {
                runReport();
              }

              if (primaryButtonState.action === "REFRESH") {
                if (primaryButtonState.requiresConfirmation) {
                  setConfirmRefreshOpen(true);
                }
              }
            }}
          >
            {isRefreshSubmittingForSelectedCompanies
              ? "Starting refresh…"
              : primaryButtonState.label}
          </Button>
        </Stack>
      </Paper>

      {selectedCompanySystemStatus === "RUNNING" && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Reconciliation data refresh is currently running. The view will update
          automatically once the refresh is complete.
        </Alert>
      )}

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
          {/* ✅ Overview */}
          <ReconciliationOverview
            kpis={data.kpis}
            systemStatus={selectedCompanySystemStatus}
          />

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
                    data={aggregatedStatusSummary}
                    selectedStatusKey={selectedStatusKey}
                    onSelect={(item) => setSelectedStatusKey(item)}
                  />
                )}

                {viewMode === "chart" && (
                  <StatusSummaryChart
                    data={aggregatedStatusSummary}
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
          {selectedStatusKey && selectedStatusLabel && (
            <ReconciliationDetailTable
              status={selectedStatusLabel}
              rows={detailRows}
            />
          )}
        </>
      )}

      {appInfo && (
        <AboutDialog
          open={aboutOpen}
          onClose={() => setAboutOpen(false)}
          info={appInfo}
        />
      )}

      <Dialog
        open={confirmRefreshOpen}
        onClose={() => setConfirmRefreshOpen(false)}
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
          <Button onClick={() => setConfirmRefreshOpen(false)} color="inherit">
            Cancel
          </Button>

          <Button
            variant="contained"
            disabled={isRefreshSubmittingForSelectedCompanies}
            onClick={async () => {
              if (!data || selectedCompanyCodes.length === 0) return;

              setConfirmRefreshOpen(false);

              // Submit refresh for EACH selected company
              for (const code of selectedCompanyCodes) {
                await submitRefresh({
                  companyCode: code,
                  fiscalYear: data.period.fiscalYear,
                  fiscalPeriod: data.period.fiscalPeriod,
                });
              }

              runReport();
            }}
          >
            Refresh data
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
