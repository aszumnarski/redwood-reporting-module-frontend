import { useState } from "react";
import { Box, Paper, Typography, Tooltip } from "@mui/material";

export interface DonutSlice {
  key: string;
  label: string;
  value: number;
  color: string;
}

interface Props {
  label: string;
  data: DonutSlice[];
  onSliceClick?: (value: string | null) => void;
}

export function DonutChart({ label, data, onSliceClick }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  const total = data.reduce((sum, d) => sum + d.value, 0);

  let current = 0;
  const gradient = data
    .map((slice) => {
      const percentage = total === 0 ? 0 : (slice.value / total) * 100;
      const start = current;
      const end = current + percentage;
      current = end;
      return `${slice.color} ${start}% ${end}%`;
    })
    .join(", ");

  const background = `conic-gradient(${gradient}, #e0e0e0 0)`;

  const tooltipText = data.map((d) => `${d.label}: ${d.value}`).join("\n");


  const handleSliceClick = (slice: DonutSlice) => {
    const newValue = selected === slice.key ? null : slice.key;
  
    setSelected(newValue);
    onSliceClick?.(newValue);
  };
  

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
        {data.map((slice) => {
          const isSelected = selected === slice.label;

          return (
            <Box
              key={slice.label}
              onClick={() => handleSliceClick(slice)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                cursor: "pointer",
                borderRadius: 1,
                px: 0.5,
                py: 0.25,
                opacity: selected === null || isSelected ? 1 : 0.5,
                bgcolor: isSelected ? "action.selected" : "transparent",
                transition: "all 0.2s ease",
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

              <Typography
                variant="caption"
                sx={{
                  fontWeight: isSelected ? 600 : 400,
                }}
              >
                {slice.label} ({slice.value})
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
}
