import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Paper, Typography, Box } from "@mui/material";

import type { ReconciliationStatusSummaryItem } from "../types";
import type { ReconciliationStatusKey } from "../types";
interface Props {
  data: ReconciliationStatusSummaryItem[];
  selectedStatusKey: ReconciliationStatusKey | null;
  onSelect: (key: ReconciliationStatusKey) => void;
}

function StatusBar(props: any) {
  const { x, y, width, height, payload, selectedStatus, onSelect } = props;

  const isSelected = payload.label === selectedStatus;

  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      rx={2}
      ry={2}
      fill={isSelected ? "#2e7d32" : "#1976d2"}
      style={{ cursor: "pointer" }}
      onClick={() => onSelect(payload.label)}
    />
  );
}

export function StatusSummaryChart({
  data,
  selectedStatusKey,
  onSelect,
}: Props) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        height: 320, // ✅ fixed outer height
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="subtitle2" gutterBottom>
        Reconciliation status distribution
      </Typography>

      {/* ✅ THIS BOX IS THE KEY FIX */}
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ left: 20, right: 20 }}
          >
            <XAxis type="number" />
            <YAxis type="category" dataKey="label" width={160} />

            <Tooltip
              formatter={(value) => [
                value != null ? String(value) : "0",
                "Count",
              ]}
            />

            <Bar
              dataKey="value"
              shape={(barProps) => (
                <StatusBar
                  {...barProps}
                  selectedStatus={selectedStatusKey}
                  onSelect={onSelect}
                />
              )}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
