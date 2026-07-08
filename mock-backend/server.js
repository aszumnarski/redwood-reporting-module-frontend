import express from "express";
import systemRoutes from "./routes/system.js";
import reconciliationRoutes from "./routes/reconciliation.js";

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const health = JSON.parse(
  readFileSync(join(__dirname, "data", "health.json"), "utf-8")
)



const app = express();
const PORT = 3001;

app.use("/rest/system", systemRoutes);
app.use("/rest/reconciliation", reconciliationRoutes);


app.get("/rest/health", (req, res) => {
  res.json(health);
});

app.listen(PORT, () => {
  console.log(`Mock backend running on http://localhost:${PORT}`);
});