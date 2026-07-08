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
  statusDictionary: Partial<Record<ReconciliationStatusKey, string>>;
  onSelect: (key: ReconciliationStatusKey) => void;
}

function StatusBar(props: any) {
  const { x, y, width, height, payload, selectedStatus, onSelect } = props;

  const statusKey = payload.key as ReconciliationStatusKey;
  const isSelected = statusKey === selectedStatus;

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
      onClick={() => onSelect(statusKey)}
    />
  );
}

export function StatusSummaryChart({
  data,
  selectedStatusKey,
  statusDictionary,
  onSelect,
}: Props) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        height: 320,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="subtitle2" gutterBottom>
        Reconciliation status distribution
      </Typography>

      <Box sx={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ left: 20, right: 20 }}
          >
            <XAxis type="number" />

            <YAxis
              type="category"
              dataKey="key"
              width={160}
              tickFormatter={(value) =>
                statusDictionary[value as ReconciliationStatusKey] ??
                String(value)
              }
            />

            <Tooltip
              formatter={(value) => [String(value ?? 0), "Count"]}
              labelFormatter={(label) =>
                statusDictionary[label as ReconciliationStatusKey] ??
                String(label)
              }
            />

            <Bar
              dataKey="count"
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
