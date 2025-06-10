// APIproject/notification/server.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { getUserNotifications, markNotificationAsRead } from "./controllers/notificationController.js"; // Adjust path if needed
import dotenv from 'dotenv';
dotenv.config();
const app = express(); 

const PORT = process.env.PORT || 3001;
const DB_URL = process.env.MONGODB_URL;

mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB Connection Error:", err));
console.log("MongoDB URL from .env:", process.env.MONGODB_URL);

app.use(express.json());
app.use(cors());
app.use("/notifications", getUserNotifications);
app.use("/notifications/read", markNotificationAsRead);

app.listen(PORT, () =>
  console.log(`Notifications Service running on port ${PORT}`)
);