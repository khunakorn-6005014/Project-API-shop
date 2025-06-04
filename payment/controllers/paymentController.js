import asyncHandler from "express-async-handler";
import PaymentService from "../services/paymentService.js";

// Endpoint to process a payment for an order
export const processPayment = asyncHandler(async (req, res) => {
  const { orderId, amount, paymentMethod } = req.body;
  const  userId  = req.userData.userId; // ensure your verifyToken middleware attaches userData
  console.log("User Data in payment:", userId)
  const payment = await PaymentService.processPayment({
    orderId,
    userId,
    amount,
    paymentMethod,
  });
  
  res.status(200).json({
    success: true,
    message: "Payment processed successfully",
    payment,
  });
});
