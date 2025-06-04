import express from "express";
import { processPayment } from "../controllers/paymentController.js";
import verifyToken from "../../config/auth.middleware.js" // Ensure this exists and works

const router = express.Router();

// Route for processing payment
router.post("/", verifyToken, processPayment);

export default router;