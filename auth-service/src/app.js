// auth-service/src/app.js
import express from 'express';
import authRoutes from './routes/auth.routes.js';
import jwksRoutes from './routes/jwks.routes.js';
import cors from "cors";
import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();
const DB_URL = process.env.MONGO_URI;
console.log("MongoDB URI from .env:", DB_URL);
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB Connection Error:", err));

const app = express();
app.use(express.json());
app.use(cors())
// Public endpoints
app.use('/auth', authRoutes);
app.use('/', jwksRoutes);

export default app;