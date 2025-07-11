// APIproject/notification/server.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import notificationRoutes from "./routes/notificationRoutes.js";
import dotenv from 'dotenv';
import client from 'prom-client';
import { initConsumer,shutdownConsumer } from "./mq/kafkaConsumer.js";


dotenv.config();
async function start() {
 const app = express(); 
 const PORT = process.env.PORT_NOTI || 3003;
 const DB_URL = process.env.MONGO_URI;
 console.log("MongoDB URI from .env:", DB_URL);
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB Connection Error:", err));
initConsumer();

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

app.use('/', notificationRoutes);

app.listen(PORT, () =>
  console.log(`Notifications Service running on port ${PORT}`)
);
process.on('SIGINT',  async () => { await shutdownConsumer(); process.exit(); });
process.on('SIGTERM', async () => { await shutdownConsumer(); process.exit(); });

}
start().catch(err => {
  console.error('Fatal startup error', err);
  process.exit(1);
});