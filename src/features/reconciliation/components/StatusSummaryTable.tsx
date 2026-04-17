import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
  } from "@mui/material";
  
  interface StatusSummaryItem {
    label: string;
    value: number;
  }
  
  interface Props {
    data: StatusSummaryItem[];
    selectedStatus: string | null;
    onSelect: (status: string) => void;
  }
  
  export function StatusSummaryTable({
    data,
    selectedStatus,
    onSelect,
  }: Props) {
    return (
      <TableContainer>
        <Table size="small">
          <TableBody>
            {data.map((row) => (
              <TableRow
                key={row.label}
                hover
                selected={selectedStatus === row.label}
                onClick={() => onSelect(row.label)}
                sx={{ cursor: "pointer" }}
              >
                <TableCell>{row.label}</TableCell>
                <TableCell align="right">{row.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

/** 
  <TableContainer>
  <Table size="small">
    <TableBody>
      {STATUS_SUMMARY_DATA.map((row) => (
        <TableRow
          key={row.label}
          hover
          selected={selectedStatus === row.label}
          onClick={() => setSelectedStatus(row.label)}
          sx={{ cursor: "pointer" }}
        >
          <TableCell>{row.label}</TableCell>
          <TableCell align="right">{row.value}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>

*/