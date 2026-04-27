import { Router } from "express";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const reconciliationRuntime = loadJson("reconciliation-runtime.json");
const reconciliationConfig = loadJson("reconciliation-config.json");
const statusSummary = loadJson("reconciliation-summary.json");
const rows = loadJson("reconciliation-rows.json");

function loadJson(fileName) {
  const filePath = join(__dirname, "..", "data", fileName);
  const raw = readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

/**
 * GET /api/reconciliation
 * ?year=2026&period=P04&companyCode=7092
 */
router.get("/", (req, res) => {
  res.json({
    period: {
      fiscalYear: Number(req.query.year),
      fiscalPeriod: req.query.period,
    },
    kpis: reconciliationRuntime.kpis,
    statusSummary,
    rows,
    systemStatus: reconciliationRuntime.systemStatus,
  });
});

/**
 * POST /api/reconciliation/refresh
 */
router.post("/refresh", (req, res) => {
  res.json({
    accepted: true,
    status: "RUNNING",
  });
});

/**
 * GET /api/reconciliation/metadata
 */
router.get("/metadata", (req, res) => {
  res.json(reconciliationConfig);
});

export default router;
