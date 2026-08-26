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
  certificationDictionary: Record<string, string>;
  dueDateDictionary: Record<string, string>;
}



const COLUMN_LABELS: Record<string, string> = {
  jobId: "Job ID",
  statusKey: "Certification Status",
  companyCode: "Company",
  sapBalance: "SAP Balance",
  accountGroup: "Account Group",
};

const prettify = (field: string) =>
  field.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());

export function ReconciliationDetailTable({
  rows,
  statusKey,
  statusDictionary,
  certificationDictionary,
  dueDateDictionary,
}: Props) {
  const [drawerRow, setDrawerRow] = useState<ReconciliationRow | null>(null);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState(() => {
    const saved = localStorage.getItem("reconciliation-detail-columns");
  
    return saved ? JSON.parse(saved) : {};
  });
  const columns = useMemo<GridColDef[]>(() => {
    if (!rows.length) {
      return [];
    }

    const allFields = Array.from(
      new Set(rows.flatMap((row) => Object.keys(row)))
    );

    return allFields.map((field) => {
      const column: GridColDef = {
        field,
        headerName: COLUMN_LABELS[field] ?? prettify(field),
        minWidth: 120,
        flex: 1,
      };

      if (field === "statusKey") {
        column.valueGetter = (_value, row) =>
          statusDictionary[row.statusKey] ?? row.statusKey;
      }
      if (field === "certificationCategory") {
        column.valueGetter = (_value, row) =>
          certificationDictionary[row.certificationCategory] ??
          row.certificationCategory;
      }

      if (field === "dueDateCategory") {
        column.valueGetter = (_value, row) =>
          dueDateDictionary[row.dueDateCategory] ?? row.dueDateCategory;
      }

      const numericFields = [
        "sapBalance",
        "analyzedBalance",
        "unanalyzedBalance",
        "analyzedQuantity",
        "unanalyzedQuantity",
      ];

      if (numericFields.includes(field)) {
        column.align = "right";
        column.headerAlign = "right";

        column.valueFormatter = (value) => {
          if (value == null || value === "" || value === "n/a") {
            return value;
          }

          const number = Number(value);

          return Number.isNaN(number) ? value : number.toLocaleString();
        };
      }

      return column;
    });
  }, [rows]);

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
          columnVisibilityModel={columnVisibilityModel}
          onColumnVisibilityModelChange={(model) => {
            setColumnVisibilityModel(model);

            localStorage.setItem(
              "reconciliation-detail-columns",
              JSON.stringify(model)
            );
          }}
          getRowClassName={(params) =>
            params.row.removedFromMaster ? "removed-from-master" : ""
          }
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

            "& .removed-from-master": {
              backgroundColor: "#fff4cc",
            },

            "& .removed-from-master:hover": {
              backgroundColor: "#ffeaa7",
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
