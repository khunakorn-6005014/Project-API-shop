import { v4 as uuidv4 } from "uuid";
import Order from "../../order/model/order.js";
import Payment from "../models/payment.js";

class PaymentService {
  // Simulate processing payment and update order status
static async processPayment({ orderId, userId, amount, paymentMethod }) {
      const order = await Order.findOne({ orderId });
      if (!order) {
      throw new Error("Order not found.");
    }
    if (order.userId !== userId) {
      throw new Error("Order does not belong to this user.");
    }
    if (order.totalAmount !== amount) {
      throw new Error("Payment amount does not match order total.");
    }
      // Simulate a payment gateway call
      const transactionId = uuidv4(); // Simulated transaction ID
      // Create a payment record
      const payment = await Payment.create({
        paymentId: uuidv4(),
        orderId,
        userId,
        amount,
        paymentMethod,
        status: "completed", // For now, assume the payment succeeds
        transactionId,
      });
      // Update the corresponding order status to "paid"
      //even in status paid but custommer can still refund 
      await Order.findOneAndUpdate({ orderId }, { status: "paid" });
       // Publish payment completed event:
      await publishEvent("payment.completed", {
        orderId,
        userId,
        amount,
        paymentMethod,
        transactionId,
        timestamp: new Date(),
      });
      return payment;
  }
  // Refund processing: update payment record, order status, and restore inventory
 static async refundPayment({ orderId, userId ,refundAmount }) {
    // Create a refund record in Payment with a "refunded" status
     const order = await Order.findOne({ orderId });
    if (!order) {
      throw new Error("Order not found.");
    }
    if (order.userId !== userId) {
      throw new Error("Order does not belong to this user.");
    }
    if (order.totalAmount !== refundAmount) {
      throw new Error("Refund amount does not match order total.");
    }
    const refund = await Payment.create({
      paymentId: uuidv4(),
      orderId,
      userId,
      amount: refundAmount,
      paymentMethod: "refund",  // Indicates this is a refund operation
      status: "refunded",
      transactionId: uuidv4(),
    });
    // Update the corresponding order to "refunded"
    await Order.findOneAndUpdate({ orderId },{ status: "refunded" });
  }
} 
export default PaymentService;

