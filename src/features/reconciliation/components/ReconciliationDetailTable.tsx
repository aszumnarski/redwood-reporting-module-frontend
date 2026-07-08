import { useMemo, useState } from "react";
import {
  Box,
  Drawer,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  TableSortLabel,
  Popover,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";

import type { ReconciliationRow, ReconciliationStatusKey } from "../types";
import { ReconciliationRowDetails } from "./ReconciliationRowDetails";

interface Props {
  rows: ReconciliationRow[];
  statusKey: ReconciliationStatusKey;
  statusDictionary: Partial<Record<ReconciliationStatusKey, string>>;
}

export function ReconciliationDetailTable({
  rows,
  statusKey,
  statusDictionary,
}: Props) {
  const [drawerRow, setDrawerRow] = useState<ReconciliationRow | null>(null);
  const [sortField, setSortField] = useState<keyof ReconciliationRow | null>(
    null
  );

  const [activeFilterField, setActiveFilterField] = useState<
    keyof ReconciliationRow | null
  >(null);

  const [filters, setFilters] = useState<
    Partial<Record<keyof ReconciliationRow, string>>
  >({});

  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const filteredRows = useMemo(() => {
    return rows.filter((row) =>
      Object.entries(filters).every(([field, filterValue]) => {
        if (!filterValue) {
          return true;
        }

        const value = row[field as keyof ReconciliationRow];

        return String(value).toLowerCase().includes(filterValue.toLowerCase());
      })
    );
  }, [rows, filters]);

  const getFilterLabel = (field: keyof ReconciliationRow | null) => {
    switch (field) {
      case "companyCode":
        return "Company";

      case "account":
        return "Account";

      default:
        return "Filter";
    }
  };

  const [filterAnchor, setFilterAnchor] = useState<HTMLElement | null>(null);

  const openFilter = (
    event: React.MouseEvent<HTMLElement>,
    field: keyof ReconciliationRow
  ) => {
    setFilterAnchor(event.currentTarget);
    setActiveFilterField(field);
  };

  const sortedRows = useMemo(() => {
    if (!sortField) {
      return filteredRows;
    }

    const result = [...filteredRows];

    result.sort((a, b) => {
      const valueA = a[sortField];
      const valueB = b[sortField];

      if (valueA == null && valueB == null) return 0;
      if (valueA == null) return 1;
      if (valueB == null) return -1;

      let comparison: number;

      const numberA = Number(valueA);
      const numberB = Number(valueB);

      const areNumbers = !Number.isNaN(numberA) && !Number.isNaN(numberB);

      if (areNumbers) {
        comparison = numberA - numberB;
      } else {
        comparison = String(valueA).localeCompare(String(valueB), undefined, {
          sensitivity: "base",
        });
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    return result;
  }, [filteredRows, sortField, sortDirection]);

  const handleSort = (field: keyof ReconciliationRow) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const renderSortableHeader = (
    label: string,
    field: keyof ReconciliationRow
  ) => (
    <TableSortLabel
      active={sortField === field}
      direction={sortField === field ? sortDirection : "asc"}
      onClick={() => handleSort(field)}
    >
      {label}
    </TableSortLabel>
  );

  const renderFilterIcon = (field: keyof ReconciliationRow) => (
    <IconButton
      size="small"
      onClick={(event) => {
        event.stopPropagation();
        openFilter(event, field);
      }}
    >
      <FilterListIcon
        fontSize="small"
        color={filters[field] ? "primary" : "inherit"}
      />
    </IconButton>
  );

  return (
    <Paper sx={{ p: 3, mt: 4 }} variant="outlined">
      <Typography variant="h6" gutterBottom>
        Reconciliation details – {statusDictionary[statusKey]}
      </Typography>

      <TableContainer sx={{ maxHeight: 500 }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>{renderSortableHeader("Job ID", "jobId")}</TableCell>
              <TableCell>Certification Status</TableCell>
              <TableCell>Job Status</TableCell>

              <TableCell>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {renderSortableHeader("Company", "companyCode")}
                  {renderFilterIcon("companyCode")}
                </Box>
              </TableCell>

              <TableCell>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {renderSortableHeader("Account", "account")}
                  {renderFilterIcon("account")}
                </Box>
              </TableCell>

              <TableCell>Account Group</TableCell>
              <TableCell>Preparer</TableCell>
              <TableCell>Approver</TableCell>
              <TableCell>Reviewer</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Currency</TableCell>
              <TableCell>
                {renderSortableHeader("SAP Balance", "sapBalance")}
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedRows.map((row) => (
              <TableRow
                key={row.jobId}
                hover
                sx={{
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "action.hover" },
                }}
                onClick={() => setDrawerRow(row)}
              >
                <TableCell>{row.jobId}</TableCell>
                <TableCell>
                  {statusDictionary[row.statusKey] ?? row.statusKey}
                </TableCell>
                <TableCell>{row.jobStatus}</TableCell>
                <TableCell>{row.companyCode}</TableCell>
                <TableCell>{row.account}</TableCell>
                <TableCell>{row.accountGroup}</TableCell>
                <TableCell>{row.preparer}</TableCell>
                <TableCell>{row.approver}</TableCell>
                <TableCell>{row.reviewer}</TableCell>
                <TableCell>{row.dueDate}</TableCell>
                <TableCell>{row.currency}</TableCell>
                <TableCell align="right">{row.sapBalance}</TableCell>
              </TableRow>
            ))}

            {sortedRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={12} align="center">
                  No reconciliations found for this status
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Popover
        open={Boolean(filterAnchor)}
        anchorEl={filterAnchor}
        onClose={() => {
          setFilterAnchor(null);
          setActiveFilterField(null);
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box
          sx={{
            p: 2,
            width: 250,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >

<TextField
  fullWidth
  label={getFilterLabel(activeFilterField)}
  value={
    activeFilterField
      ? filters[activeFilterField] ?? ""
      : ""
  }
  onChange={(event) => {
    if (!activeFilterField) {
      return;
    }

    setFilters((prev) => ({
      ...prev,
      [activeFilterField]: event.target.value,
    }));
  }}
/>

        </Box>
      </Popover>

      {/* RIGHT-SIDE DETAILS DRAWER */}

      <Drawer
        anchor="right"
        open={Boolean(drawerRow)}
        onClose={() => setDrawerRow(null)}
        sx={{
          "& .MuiDrawer-paper": {
            width: 520,
            maxWidth: "100vw",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {/* HEADER */}
        <Stack
          direction="row"
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
            py: 1.5,
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Typography variant="subtitle1">Reconciliation details</Typography>
          <IconButton onClick={() => setDrawerRow(null)}>
            <CloseIcon />
          </IconButton>
        </Stack>

        {/* CONTENT */}
        <Box sx={{ flex: 1, overflowY: "auto" }}>
          {drawerRow && (
            <ReconciliationRowDetails
              row={drawerRow}
              statusDictionary={statusDictionary}
            />
          )}
        </Box>
      </Drawer>
    </Paper>
  );
}
