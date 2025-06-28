// product-service/src/app.js
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import productRoutes from './routes/product.routes.js';

dotenv.config();
const DB_URL = process.env.MONGO_URI;
console.log("MongoDB URI from .env:", DB_URL);
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB Connection Error:", err));

const app = express();

app.use(express.json());

app.use(cors());
// 3) mount routes at root (gateway strips /product)
app.use('/', productRoutes);
export default app;