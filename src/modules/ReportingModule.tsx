import { Box, Paper, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { ReconciliationRunnerPage } from "../features/reconciliation/ReconciliationRunnerPage";

function JournalVoucherPage() {
  return (
    <Box sx={{ p: 3 }}>
      Journal Voucher module (coming soon)
    </Box>
  );
}

type ModuleKey = "reconciliation" | "journalVoucher";

const MODULES: {
  key: ModuleKey;
  label: string;
  component: React.ReactNode;
}[] = [
  {
    key: "reconciliation",
    label: "Reconciliation",
    component: <ReconciliationRunnerPage />,
  },
  {
    key: "journalVoucher",
    label: "Journal Voucher",
    component: <JournalVoucherPage />,
  },
];

const USER_MODULE_ACCESS: ModuleKey[] = [
  "reconciliation",
  "journalVoucher",
];

export function ReportingModule() {
  const availableModules = MODULES.filter(m =>
    USER_MODULE_ACCESS.includes(m.key)
  );

  const [activeModule, setActiveModule] = useState<ModuleKey>(
    availableModules[0].key
  );

  const activeComponent = availableModules.find(
    m => m.key === activeModule
  )?.component;

  return (
    <Box sx={{ width: "100%" }}> {/* ✅ force full-width module */}
      {/* Module Tabs Row */}
      <Paper
        sx={{
          mb: 3,
          width: "100%",
          maxWidth: "none",   // ✅ THIS LINE IS CRITICAL
        }}
        elevation={1}
      >
        <Tabs
          value={activeModule}
          onChange={(_, value) => setActiveModule(value)}
          textColor="primary"
          indicatorColor="primary"
          variant="scrollable"   // ✅ prevents tabs from constraining width
        >
          {availableModules.map(module => (
            <Tab
              key={module.key}
              label={module.label}
              value={module.key}
            />
          ))}
        </Tabs>
      </Paper>

      {/* Active Module Content */}
      <Box sx={{ width: "100%" }}>
        {activeComponent}
      </Box>
    </Box>
  );
}