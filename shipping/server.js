// APIproject/shipping/server.js
import express from "express";
import shippingRoutes from "./routes/shippingRoutes.js"; // Adjust path if needed
import cors from "cors";
import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 3001;
const DB_URL = process.env.MONGODB_URL;

mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB Connection Error:", err));

app.use(express.json());
app.use(cors());
app.use("/shipping", shippingRoutes);

app.listen(PORT, () =>
  console.log(`Shipping Service running on port ${PORT}`)
);