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
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  
} from "@mui/material";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import IconButton from "@mui/material/IconButton";

import { useApplicationInfo } from "./hooks/useApplicationInfo";
import { AboutDialog } from "./components/AboutDialog";

import { useEffect, useState } from "react";

import { Popover } from "@mui/material";

import { fetchReconciliationData } from "../../api/reconciliation.api";

import type {
  FetchReconciliationResponse,
  FetchReconciliationParams,
  ReconciliationStatusKey,
  ReconciliationStatusSummaryItem,
} from "../reconciliation/types";

import { SystemStatusIcon } from "./components/SystemStatusIcon";
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

  const [systemStatusAnchorEl, setSystemStatusAnchorEl] =
    useState<HTMLElement | null>(null);

  const isSystemStatusOpen = Boolean(systemStatusAnchorEl);

  const handleToggleSystemStatus = (event: React.MouseEvent<HTMLElement>) => {
    setSystemStatusAnchorEl((prev) => (prev ? null : event.currentTarget));
  };

  const handleCloseSystemStatus = () => {
    setSystemStatusAnchorEl(null);
  };

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

  const {
    reconciliationSummary,
    certificationSummary,
    dueDateSummary,
    selectedCompanySystemStatus,
    systemStatusForSelection,
    detailRows,
  } = useReconciliationViewState({
    data,
    selectedCompanyCodes,
    selectedStatusKey,
  });

  const certificationDonutConfig = [
    {
      key: "CERT_AUTO" as const,
      color: "#1976d2",
    },
    {
      key: "CERT_MANUAL" as const,
      color: "#9c27b0",
    },
  ];

  const dueDateDonutConfig = [
    {
      key: "DUE_IN" as const,
      color: "#2e7d32",
    },
    {
      key: "DUE_OVER" as const,
      color: "#d32f2f",
    },
  ];

  function buildDonutData(
    aggregated: ReconciliationStatusSummaryItem[],
    config: { key: ReconciliationStatusKey; color: string }[],
    dictionary: Record<string, string>
  ) {
    return config.map(({ key, color }) => {
      const found = aggregated.find((item) => item.key === key);

      return {
        label: dictionary[key] ?? key,
        value: found?.count ?? 0,
        color,
      };
    });
  }

  const effectiveCompanyCodes = resolveCompanyScope(
    selectedCompanyCodes,
    defaultCompanyCodes
  );

  const isAllCompaniesSelected =
    effectiveCompanyCodes.length === availableCompanyCodes.length;

  const primaryButtonState = resolvePrimaryButtonState({
    isAllCompanies: isAllCompaniesSelected,
    systemStatus: selectedCompanySystemStatus,
  });

  // -------------------------------
  // Effects
  // -------------------------------

  useEffect(() => {
    if (reconciliationSummary.length > 0 && selectedStatusKey === null) {
      setSelectedStatusKey(reconciliationSummary[0].key);
    }
  }, [reconciliationSummary, selectedStatusKey]);

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
      const period =
        typeof defaultPeriod.fiscalPeriod === "number"
          ? String(defaultPeriod.fiscalPeriod).padStart(2, "0")
          : defaultPeriod.fiscalPeriod.replace("P", "");

      const value = `${defaultPeriod.fiscalYear}/${period}`;

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

  const statusDictionary: Partial<Record<ReconciliationStatusKey, string>> =
    data?.statusDictionary ?? {};

  const certificationDonutData = buildDonutData(
    certificationSummary,
    certificationDonutConfig,
    statusDictionary
  );

  const dueDateDonutData = buildDonutData(
    dueDateSummary,
    dueDateDonutConfig,
    statusDictionary
  );

  const isSingleCompanyUser = availableCompanyCodes.length === 1;

  const isSomeCompaniesSelected =
    selectedCompanyCodes.length > 0 && !isAllCompaniesSelected;

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
                  isAllCompaniesSelected
                    ? "All companies"
                    : selectedCompanyCodes.join(", "),
              },
            }}
          >
            {!isSingleCompanyUser && (
              <MenuItem disableRipple>
                <Checkbox
                  checked={isAllCompaniesSelected}
                  indeterminate={isSomeCompaniesSelected}
                  onClick={(e) => {
                    e.stopPropagation();

                    // Only act when not already all selected
                    if (!isAllCompaniesSelected) {
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
              const period =
                typeof p.fiscalPeriod === "number"
                  ? String(p.fiscalPeriod).padStart(2, "0")
                  : p.fiscalPeriod.replace("P", "");

              const value = `${p.fiscalYear}/${period}`;

              return (
                <MenuItem key={value} value={value}>
                  {value}
                </MenuItem>
              );
            })}
          </TextField>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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

            {selectedCompanySystemStatus && (
              <IconButton
                onClick={handleToggleSystemStatus}
                aria-label="Show system refresh status"
                size="small"
              >
                <SystemStatusIcon status={selectedCompanySystemStatus} />
              </IconButton>
            )}
          </Box>
          <Popover
            open={isSystemStatusOpen}
            anchorEl={systemStatusAnchorEl}
            onClose={handleCloseSystemStatus}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            disableRestoreFocus
          >
            <Box sx={{ p: 2, minWidth: 420 }}>
              <Typography variant="subtitle2" gutterBottom>
                System refresh status
              </Typography>

              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Company</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Last refresh</TableCell>
                    <TableCell>Error</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {systemStatusForSelection.map((row) => (
                    <TableRow key={row.companyCode}>
                      <TableCell>{row.companyCode}</TableCell>
                      <TableCell>{row.status}</TableCell>
                      <TableCell>{row.generatedAt ?? "—"}</TableCell>
                      <TableCell>{row.errorMessage ?? "—"}</TableCell>
                    </TableRow>
                  ))}

                  {systemStatusForSelection.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4}>
                        <Typography variant="body2" color="text.secondary">
                          No system status available
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
          </Popover>
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
                    data={reconciliationSummary}
                    selectedStatusKey={selectedStatusKey}
                    statusDictionary={statusDictionary}
                    onSelect={(item) => setSelectedStatusKey(item)}
                  />
                )}

                {viewMode === "chart" && (
                  <StatusSummaryChart
                    data={reconciliationSummary}
                    selectedStatusKey={selectedStatusKey}
                    statusDictionary={statusDictionary}
                    onSelect={(item) => setSelectedStatusKey(item)}
                  />
                )}
              </Box>

              {/* RIGHT */}

              <Box sx={{ flex: 1 }}>
                <DonutChart
                  label="Certification overview"
                  data={certificationDonutData}
                />

                <DonutChart label="Due date overview" data={dueDateDonutData} />
              </Box>
            </Box>
          </Paper>

          {/* Details */}

          {selectedStatusKey && (
            <ReconciliationDetailTable
              statusKey={selectedStatusKey}
              rows={detailRows}
              statusDictionary={statusDictionary}
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
