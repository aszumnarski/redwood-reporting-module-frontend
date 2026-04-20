import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";

import type { ReconciliationStatusSummaryItem } from "../types";
import type { ReconciliationStatusKey } from "../types";
interface Props {
  data: ReconciliationStatusSummaryItem[];
  selectedStatusKey: ReconciliationStatusKey | null;
  onSelect: (key: ReconciliationStatusKey) => void;
}

export function StatusSummaryTable({
  data,
  selectedStatusKey,
  onSelect,
}: Props) {
  return (
    <TableContainer>
      <Table size="small">
        <TableBody>
          {data.map((row) => (
            <TableRow
              key={row.key}
              hover
              selected={row.key === selectedStatusKey}
              onClick={() => onSelect(row.key)}
              sx={{ cursor: "pointer" }}
            >
              <TableCell>{row.label}</TableCell>
              <TableCell align="right">{row.count}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
