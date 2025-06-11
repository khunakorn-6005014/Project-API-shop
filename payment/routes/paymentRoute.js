import express from "express";
import { processPayment,refundPayment } from "../controllers/paymentController.js";
import verifyToken from "auth-lib"; // Ensure this exists and works
//import verifyToken from "../../config/auth.middleware.js"

const router = express.Router();

// Route for processing payment
router.post("/pay", verifyToken, processPayment);
router.post("/refund", verifyToken, refundPayment)

export default router;