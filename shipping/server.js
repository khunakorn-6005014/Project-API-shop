// APIproject/shipping/server.js

import mongoose from "mongoose";
import dotenv from 'dotenv';
import app from "./app.js";

//kafka
import { initProducer, shutdownProducer } from './mq/producer.js';
import { initConsumer, shutdownConsumer } from './mq/consumer.js';

dotenv.config();
async function start() {
const PORT = process.env.PORT_SHIP || 3002;
const DB_URL = process.env.MONGO_URI;
console.log("MongoDB URI from .env:", DB_URL);
await mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB Connection Error:", err));

await initProducer();
await initConsumer();

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



