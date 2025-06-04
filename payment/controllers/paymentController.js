// APIproject/payment/controllers/paymentController.js
import asyncHandler from "express-async-handler";
import PaymentService from "../services/paymentService.js";

// Endpoint to process a payment for an order
export const processPayment = asyncHandler(async (req, res) => {
 try{
  const  userId  = req.userData.userId; // ensure your verifyToken middleware attaches userData
  console.log("User Data in payment:", userId)
  const payment = await PaymentService.processPayment({
    orderId,
    userId,
    amount,
    paymentMethod,
  });
  res.status(200).json({success: true, message: "Payment processed successfully",payment});
 }catch(error){
    res.status(500).json({ success: false, message: error.message });
    await Payment.create({
        paymentId: uuidv4(),
        orderId,
        userId,
        amount,
        paymentMethod,
        status: "failed",   
      });// Optionally, capture the error message/details
      await Order.findOneAndUpdate({ orderId }, { status: "payment_failed" });
      throw new Error("Payment failed: " + error.message);
  }
});
export const refundPayment = asyncHandler(async (req, res) => {
 try{
  const  userId  = req.userData.userId; // ensure your verifyToken middleware attaches userData
  console.log("User Data in payment:", userId);
  const payment = await PaymentService.refundPayment({
    orderId,
    userId
     });
  res.status(200).json({success: true,message: "Payment refunded successfully",payment});
 }
 catch(error){
  res.status(500).json({ success: false, message: error.message });
 }
    });