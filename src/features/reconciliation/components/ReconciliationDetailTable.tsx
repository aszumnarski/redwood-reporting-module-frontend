import { useState } from "react";
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
  Typography,
} from "@mui/material";
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

  return (
    <Paper sx={{ p: 3, mt: 4 }} variant="outlined">
      <Typography variant="h6" gutterBottom>
        Reconciliation details – {statusDictionary[statusKey]}
      </Typography>

      <TableContainer sx={{ maxHeight: 500 }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Job ID</TableCell>
              <TableCell>Certification Status</TableCell>
              <TableCell>Job Status</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Account</TableCell>
              <TableCell>Account Group</TableCell>
              <TableCell>Preparer</TableCell>
              <TableCell>Approver</TableCell>
              <TableCell>Reviewer</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Currency</TableCell>
              <TableCell align="right">SAP Balance</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row) => (
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

            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={12} align="center">
                  No reconciliations found for this status
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

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
