// APIproject/notification/server.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import notificationRoutes from "./routes/notificationRoutes.js";
import dotenv from 'dotenv';
import { initConsumer,shutdownConsumer } from "./mq/consumer.js";


dotenv.config();
async function start() {
 const app = express(); 
 const PORT = process.env.PORT;
 const DB_URL = process.env.MONGO_URI;
 console.log("MongoDB URI from .env:", DB_URL);
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB Connection Error:", err));
initConsumer();

app.use(express.json());
app.use(cors());
app.use("/notifications", notificationRoutes);

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