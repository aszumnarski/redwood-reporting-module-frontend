import { CssBaseline, Box } from "@mui/material";
import { ReportingModule } from "./modules/ReportingModule";
import { useEffect } from "react";
import { useBackendHealth } from "./features/reconciliation/hooks/useBackendHealth";

function App() {
  const backendHealthy = useBackendHealth();

  useEffect(() => {
    if (backendHealthy === true) {
      console.log("✅ Backend reachable");
    }
    if (backendHealthy === false) {
      console.error("❌ Backend unreachable");
    }
  }, [backendHealthy]);

  return (
    <>
      <CssBaseline />
      <Box sx={{ p: 2 }}>
        <ReportingModule />
      </Box>
    </>
  );
}


export default App
