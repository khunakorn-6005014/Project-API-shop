// APIproject/payment/routes/paymentRoute.js
import express from "express";
import { processPayment,refundPayment } from "../controllers/paymentController.js";
//import verifyToken from "../../config/auth.mi.js"

const router = express.Router();

// Route for processing payment
router.post("/pay",  processPayment);
router.post("/refund", refundPayment)

export default router;