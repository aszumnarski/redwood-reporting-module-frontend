import express from "express";
import systemRoutes from "./routes/system.js";
import reconciliationRoutes from "./routes/reconciliation.js";

const app = express();
const PORT = 3001;

app.use("/api/system", systemRoutes);
app.use("/api/reconciliation", reconciliationRoutes);

app.listen(PORT, () => {
  console.log(`Mock backend running on http://localhost:${PORT}`);
});