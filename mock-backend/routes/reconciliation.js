import { Router } from "express";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const metadata = loadJson("metadata.json");
const report = loadJson("report.json");

function loadJson(fileName) {
  const filePath = join(__dirname, "..", "data", fileName);
  const raw = readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

/**
 * GET /api/reconciliation
 * ?year=2026&period=P04&companyCode=7092
 */
router.get("/report", (req, res) => {
  res.json(report);
});

/**
 * POST /api/reconciliation/refresh
 */
router.post("/regenerate", (req, res) => {
  res.json({
    accepted: true,
    status: "RUNNING",
  });
});

/**
 * GET /api/reconciliation/metadata
 */
router.get("/metadata", (req, res) => {
  res.json(metadata);
});

export default router;
