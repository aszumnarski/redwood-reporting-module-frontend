import { Box, Paper, Typography } from "@mui/material";

interface Props {
  label: string;
  value: number;
  color: string;
}

export function DonutChart({ label, value, color }: Props) {
  return (
    <Paper sx={{ p: 2 }} variant="outlined">
      <Typography variant="subtitle2" gutterBottom>
        {label}
      </Typography>

      <Box
        sx={{
          width: 140,
          height: 140,
          mx: "auto",
          borderRadius: "50%",
          background: `conic-gradient(${color} ${value}%, #e0e0e0 0)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: 90,
            height: 90,
            borderRadius: "50%",
            bgcolor: "background.paper",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h6">
            {value}%
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}