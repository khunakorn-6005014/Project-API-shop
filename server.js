//APIproject/server.js
import express from "express"; 
import cors from "cors";
import { dbconnection } from "./config/db.config.js";
import userRoutes from "./users/routes/userRoute.js";
import productRoutes from "./product/routes/productRoute.js"
import cartRoutes from "./cart/routes/cartRoutes.js"
import paymentRoutes from "./payment/routes/paymentRoute.js"
import shippingRoutes from "./shipping/routes/shippingRoutes.js"
import mongoose from "mongoose";
mongoose.set("bufferCommands", false);
mongoose.set("debug", true);

const app = express();
const PORT = 3000;

dbconnection();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/users", userRoutes);
app.use("/product",productRoutes);
app.use("/cart", cartRoutes);
app.use("/payment", paymentRoutes);
app.use("/shipping", shippingRoutes);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  


//docker build -t user-service .
//docker run -d -p 3000:3000 user-service
//node server.js
////curl -i http://localhost:3000