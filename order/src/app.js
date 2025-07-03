import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import orderRoutes from './routes/order.routes.js'

dotenv.config();
const DB_URL = process.env.MONGO_URI;
console.log("MongoDB URI from .env:", DB_URL);
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB Connection Error:", err));

const app = express();

app.use(express.json());

app.use(cors());
app.use('/'.orderRoutes)
export default app;