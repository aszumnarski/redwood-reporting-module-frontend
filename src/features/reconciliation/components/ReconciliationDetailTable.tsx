import { useMemo, useState } from "react";

import {
  Box,
  Drawer,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

import {
  DataGrid,
  type GridColDef,
  type GridRowParams,
} from "@mui/x-data-grid";

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

  const columns = useMemo<GridColDef<ReconciliationRow>[]>(
    () => [
      {
        field: "jobId",
        headerName: "Job ID",
        width: 120,
      },
      {
        field: "statusKey",
        headerName: "Certification Status",
        width: 220,
        valueGetter: (_value, row) =>
          statusDictionary[row.statusKey] ?? row.statusKey,
      },
      {
        field: "jobStatus",
        headerName: "Job Status",
        width: 150,
      },
      {
        field: "companyCode",
        headerName: "Company",
        width: 130,
      },
      {
        field: "account",
        headerName: "Account",
        width: 130,
      },
      {
        field: "accountGroup",
        headerName: "Account Group",
        width: 180,
      },
      {
        field: "preparer",
        headerName: "Preparer",
        width: 180,
      },
      {
        field: "approver",
        headerName: "Approver",
        width: 180,
      },
      {
        field: "reviewer",
        headerName: "Reviewer",
        width: 180,
      },
      {
        field: "dueDate",
        headerName: "Due Date",
        width: 140,
      },
      {
        field: "currency",
        headerName: "Currency",
        width: 110,
      },
      {
        field: "sapBalance",
        headerName: "SAP Balance",
        type: "number",
        width: 160,
        align: "right",
        headerAlign: "right",
      },
    ],
    [statusDictionary]
  );

  return (
    <Paper sx={{ p: 3, mt: 4 }} variant="outlined">
      <Typography variant="h6" gutterBottom>
        Reconciliation details – {statusDictionary[statusKey]}
      </Typography>

      <Box sx={{ height: 600 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.masterKey}
          disableRowSelectionOnClick
          showToolbar
          density="compact"
          pageSizeOptions={[25, 50, 100]}
          initialState={{
            pagination: {
              paginationModel: {
                page: 0,
                pageSize: 50,
              },
            },
          }}
          onRowClick={(params: GridRowParams) =>
            setDrawerRow(params.row as ReconciliationRow)
          }
          sx={{
            "& .MuiDataGrid-row": {
              cursor: "pointer",
            },
          }}
        />
      </Box>

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
