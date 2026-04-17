import { CssBaseline, Box } from "@mui/material";
import { ReportingModule } from "./modules/ReportingModule";

function App() {
  return (
    <>
      <CssBaseline />
      <Box sx={{ p: 2 }}>   {/* ✅ intentional “breathing room” */}
        <ReportingModule />
      </Box>

    </>
  );
}

export default App
