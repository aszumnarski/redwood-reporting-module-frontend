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
} from "@mui/material";

import { useState, useEffect } from "react";

import { KPI_DATA, STATUS_SUMMARY_DATA } from "./mockData";

import { ReconciliationDetailTable } from "./components/ReconciliationDetailTable";
import { MOCK_RECONCILIATION_ROWS } from "./mockDetailData";

import { StatusSummaryChart } from "./components/StatusSummaryChart";

import { DonutChart } from "./components/DonutChart";

import { StatusSummaryTable } from "./components/StatusSummaryTable";

function getCurrentYearMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}/${month}`;
}

function splitYearMonth(yearMonth: string) {
  const [year, month] = yearMonth.split("/");
  return {
    fiscalYear: year,
    period: `P${month}`,
  };
}

export function ReportRunnerPage() {
  const [companyCode, setCompanyCode] = useState("All");
  const [yearMonth, setYearMonth] = useState(getCurrentYearMonth());
  const [viewMode, setViewMode] = useState<"table" | "chart">("table");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(
    STATUS_SUMMARY_DATA[0]?.label ?? null
  );

  const [submittedCriteria, setSubmittedCriteria] = useState<{
    companyCode: string;
    yearMonth: string;
    reportDate: string;
  } | null>(null);

  useEffect(() => {
    setSubmittedCriteria({
      companyCode: "All",
      yearMonth: getCurrentYearMonth(),
      reportDate: new Date().toLocaleDateString(),
    });

    setSelectedStatus(STATUS_SUMMARY_DATA[0]?.label ?? null);
  }, []);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Reconciliation Status Dashboard
      </Typography>

      <Paper
        variant="outlined"
        sx={{
          p: 1.5,
          mb: 3,
        }}
      >
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
            onChange={(e) => setCompanyCode(e.target.value)}
            size="small"
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="7092">7092</MenuItem>
            <MenuItem value="7088">7088</MenuItem>
          </TextField>

          {/* Period */}
          <TextField
            select
            label="Period"
            value={yearMonth}
            onChange={(e) => setYearMonth(e.target.value)}
            size="small"
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="2026/01">2026/01</MenuItem>
            <MenuItem value="2026/02">2026/02</MenuItem>
            <MenuItem value="2026/03">2026/03</MenuItem>
            <MenuItem value="2026/04">2026/04</MenuItem>
          </TextField>

          {/* Run button */}
          <Button
            variant="contained"
            size="small"
            onClick={() =>
              setSubmittedCriteria({
                companyCode,
                yearMonth,
                reportDate: new Date().toLocaleDateString(),
              })
            }
            sx={{
              height: 40, // aligns with TextField height
              whiteSpace: "nowrap",
            }}
          >
            Run report
          </Button>
        </Stack>
      </Paper>

      {submittedCriteria &&
        (() => {
          const { fiscalYear, period } = splitYearMonth(
            submittedCriteria.yearMonth
          );

          return (
            <Paper sx={{ p: 3, mt: 4 }} variant="outlined">
              <Typography variant="h6" gutterBottom>
                Selected report criteria
              </Typography>

              <Stack spacing={1}>
                <Typography>
                  <strong>Company Code:</strong> {submittedCriteria.companyCode}
                </Typography>
                <Typography>
                  <strong>Fiscal Year:</strong> {fiscalYear}
                </Typography>
                <Typography>
                  <strong>Period:</strong> {period}
                </Typography>
                <Typography>
                  <strong>Report Date:</strong> {submittedCriteria.reportDate}
                </Typography>
              </Stack>
            </Paper>
          );
        })()}

      {submittedCriteria && (
        <Paper sx={{ p: 3, mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Volume of templates generated
          </Typography>

          <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
            <Paper
              sx={{ p: 3, flex: 1, textAlign: "center" }}
              variant="outlined"
            >
              <Typography variant="h4" color="primary">
                {KPI_DATA.inScope}
              </Typography>
              <Typography color="text.secondary">In scope</Typography>
            </Paper>

            <Paper
              sx={{ p: 3, flex: 1, textAlign: "center" }}
              variant="outlined"
            >
              <Typography variant="h4" color="success.main">
                {KPI_DATA.successfullyGenerated}
              </Typography>
              <Typography color="text.secondary">
                Successfully generated
              </Typography>
            </Paper>
          </Stack>
        </Paper>
      )}
      {submittedCriteria && (
        <Paper sx={{ p: 3, mt: 4 }}>
          {/* Header */}

          <Typography variant="h6" sx={{ mb: 2 }}>
            Status summary
          </Typography>

          {/* Content */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 3,
              alignItems: "flex-start",
            }}
          >
            {/* LEFT SIDE */}
            <Box sx={{ flex: 2, minWidth: 0 }}>
              {/* View toggle belongs here */}
              <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
                <ToggleButtonGroup
                  value={viewMode}
                  exclusive
                  size="small"
                  onChange={(_, value) => value && setViewMode(value)}
                >
                  <ToggleButton value="table">Show table</ToggleButton>
                  <ToggleButton value="chart">Show chart</ToggleButton>
                </ToggleButtonGroup>
              </Box>

              {/* Content */}

              {viewMode === "table" && (
                <StatusSummaryTable
                  data={STATUS_SUMMARY_DATA}
                  selectedStatus={selectedStatus}
                  onSelect={setSelectedStatus}
                />
              )}

              {viewMode === "chart" && (
                <StatusSummaryChart
                  data={STATUS_SUMMARY_DATA}
                  selectedStatus={selectedStatus}
                  onSelect={setSelectedStatus}
                />
              )}
            </Box>

            {/* RIGHT SIDE — DONUTS */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 2,

                position: "sticky",
                top: 0,
              }}
            >
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
      )}

      {selectedStatus && (
        <ReconciliationDetailTable
          status={selectedStatus}
          rows={MOCK_RECONCILIATION_ROWS[selectedStatus] ?? []}
        />
      )}
    </Box>
  );
}
