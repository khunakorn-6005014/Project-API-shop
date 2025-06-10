// APIproject/payment/server.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import paymentRoutes from "./routes/paymentRoute.js"; // Ensure you have this file
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 3001;
const DB_URL = process.env.MONGODB_URL;

mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB Connection Error:", err));

app.use(express.json());
app.use(cors());
app.use("/payment", paymentRoutes);

app.listen(PORT, () =>
  console.log(`Payment Service running on port ${PORT}`)
);