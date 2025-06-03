//APIproject/product/routes/productRoutes.js
import express from "express"
import verifyToken from "../../config/auth.middleware.js"
import { createProduct } from "../controller/productController.js";

const router = express.Router();
router.post("/new-product", verifyToken,createProduct)
export default router;