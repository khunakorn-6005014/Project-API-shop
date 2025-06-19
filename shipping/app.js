//APIproject/shipping/app.js
import express from "express";
import cors from "cors";
import client from "prom-client";
import shippingRoutes from "./routes/shippingRoutes.js";

const app = express();
app.use(express.json());
app.use(cors());

// metrics
// Collect default Node.js metrics (memory, CPU, IEC gc, etc.)
client.collectDefaultMetrics();
// Create a custom histogram to measure HTTP request durations.
const httpRequestDurationMs = new client.Histogram({
  name: "http_request_duration_ms",
  help: "Duration of HTTP requests in ms",
  labelNames: ["method", "route", "status_code"],
  buckets: [50, 100, 200, 300, 400, 500, 750, 1000, 2000],
});
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    httpRequestDurationMs
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .observe(duration);
  });
  next();
});

// Prometheus scrape endpoint
// Expose the /metrics endpoint for Prometheus to scrape.
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

// your business routes
app.use("/shipping", shippingRoutes);

export default app;