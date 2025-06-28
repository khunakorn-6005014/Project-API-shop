// APIproject/shipping/server.js
import express from "express";
import shippingRoutes from "./routes/shippingRoutes.js"; // Adjust path if needed
import cors from "cors";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import client from 'prom-client';

//kafka
import { initProducer, shutdownProducer } from './mq/producer.js';
import { initConsumer, shutdownConsumer } from './mq/consumer.js';

dotenv.config();
async function start() {
const PORT = process.env.PORT_SHIP || 3002;
const DB_URL = process.env.MONGO_URI;
console.log("MongoDB URI from .env:", DB_URL);
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB Connection Error:", err));

await initProducer();
await initConsumer();

const app = express(); 
app.use("/shipping", shippingRoutes);
app.use(express.json());
app.use(cors());
// Collect default Node.js metrics (memory, CPU, IEC gc, etc.)
client.collectDefaultMetrics();

// Create a custom histogram to measure HTTP request durations.
const httpRequestDurationMs = new client.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [50, 100, 200, 300, 400, 500, 750, 1000, 2000],
});
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    httpRequestDurationMs
      .labels(req.method, req.route ? req.route.path : req.path, res.statusCode)
      .observe(duration);
  });
  next();
});

// Expose the /metrics endpoint for Prometheus to scrape.
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// ----------------------


// In shipping/server.js, after initializing express app...
app.listen(PORT, () =>
  console.log(`Shipping Service running on port ${PORT}`)
);
// Graceful shutdown
  const shutdown = async () => {
    console.log("🛑 Shutting down...");
    await shutdownProducer();
    await shutdownConsumer();
    server.close(() => process.exit(0));
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}
//  process.on('SIGINT',  async () => { await shutdownProducer(); await shutdownConsumer(); process.exit(); });
//   process.on('SIGTERM', async () => { await shutdownProducer(); await shutdownConsumer(); process.exit(); });

// Only start when this file is run directly
start().catch(err => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});



