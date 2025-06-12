// APIproject/shipping/server.js
import express from "express";
import shippingRoutes from "./routes/shippingRoutes.js"; // Adjust path if needed
import cors from "cors";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import { initProducer, shutdownProducer } from './mq/producer.js';
import { initConsumer, shutdownConsumer } from './mq/consumer.js';



dotenv.config();
await initProducer();
await initConsumer();

const app = express(); 

const PORT = process.env.PORT || 3001;
const DB_URL = process.env.MONGO_URI;
console.log("MongoDB URI from .env:", DB_URL);
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB Connection Error:", err));

app.use(express.json());
app.use(cors());
app.use("/shipping", shippingRoutes);
// In shipping/server.js, after initializing express app...
app.get("/test-auth", verifyToken, (req, res) => {
  res.json({ message: "Protected route access verified", userData: req.userData });
});
app.listen(PORT, () =>
  console.log(`Shipping Service running on port ${PORT}`)
);
process.on('SIGINT',  shutdownProducer);
process.on('SIGTERM', shutdownProducer);
process.on('SIGINT',  shutdownConsumer);
process.on('SIGTERM', shutdownConsumer);
