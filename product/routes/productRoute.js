import express from "express"
const router = express.Router();
import { createProduct } from "../controller/productController.js";

router.post("/new-product",createProduct)
export default router;