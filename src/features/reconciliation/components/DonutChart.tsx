import { Box, Paper, Typography, Tooltip } from "@mui/material";

export interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

interface Props {
  label: string;
  data: DonutSlice[];
}

export function DonutChart({ label, data }: Props) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  let current = 0;
  const gradient = data
    .map(slice => {
      const percentage = total === 0 ? 0 : (slice.value / total) * 100;
      const start = current;
      const end = current + percentage;
      current = end;
      return `${slice.color} ${start}% ${end}%`;
    })
    .join(", ");

  const background = `conic-gradient(${gradient}, #e0e0e0 0)`;

  const tooltipText = data
    .map(d => `${d.label}: ${d.value}`)
    .join("\n");
//console.log({data})
  return (
    <Paper sx={{ p: 2 }} variant="outlined">
      <Typography variant="subtitle2" gutterBottom>
        {label}
      </Typography>

      <Tooltip title={<pre style={{ margin: 0 }}>{tooltipText}</pre>}>
        <Box
          sx={{
            width: 140,
            height: 140,
            mx: "auto",
            borderRadius: "50%",
            background,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "default",
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
              flexDirection: "column",
            }}
          >
            <Typography variant="h6">{total}</Typography>
            <Typography variant="caption" color="text.secondary">
              total
            </Typography>
          </Box>
        </Box>
      </Tooltip>
      
<Box
  sx={{
    mt: 2,
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 1.5,
  }}
>
  {data.map((slice) => (
    <Box
      key={slice.label}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.75,
      }}
    >
      <Box
        sx={{
          width: 12,
          height: 12,
          borderRadius: "50%",
          bgcolor: slice.color,
        }}
      />
      <Typography variant="caption">
        {slice.label} ({slice.value})
      </Typography>
    </Box>
  ))}
</Box>

    </Paper>
  );
}