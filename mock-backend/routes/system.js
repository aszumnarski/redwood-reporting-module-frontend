import { Router } from "express";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const router = Router();

// ESM-safe __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load JSON manually (works everywhere)
const systemInfoPath = join(__dirname, "../data/system-info.json");
const systemInfo = JSON.parse(readFileSync(systemInfoPath, "utf-8"));

router.get("/info", (req, res) => {
  res.json(systemInfo);
});

export default router;
