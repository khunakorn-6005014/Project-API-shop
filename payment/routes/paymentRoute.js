// APIproject/payment/routes/paymentRoute.js
import express from "express";
import { processPayment,refundPayment } from "../controllers/paymentController.js";
import verifyToken from "../node_modules/auth-lib/index.js"; // Ensure this exists and works
//import verifyToken from "../../config/auth.mi.js"

const router = express.Router();

// Route for processing payment
router.post("/pay", verifyToken, processPayment);
router.post("/refund", verifyToken, refundPayment)

export default router;