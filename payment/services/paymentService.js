// APIproject/payment/services/paymentService.js
import { v4 as uuidv4 } from "uuid";
import Order from "../models/orderInfo.js";
import Payment from "../models/payment.js";
import { publishEvent } from "../mq/producer.js";

class PaymentService {
  // Simulate processing payment and update order status
  // Existing processPayment method remains unchanged
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
      await publishEvent(process.env.PAYMENT_COMPLETED_TOPIC, {
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
     // If the order has not already been marked as "returned", then update it
  // Otherwise, leave the order status as is (i.e., still "returned")
  if (order.status !== "returned") {
    await Order.findOneAndUpdate({ orderId }, { status: "refunded" });
  }
     // Publish refund processed event:
  await publishEvent("refund.processed", {
    orderId,
    userId,
    refundAmount,
    timestamp: new Date(),
  });

  return refund;
}

}
export default PaymentService;
 // // If the order exists and has products, update each product's inventory.
    // // For each product in the order, add back the refunded quantity.
    // if (order && order.products && order.products.length) {
    //   for (const productItem of order.products) {
    //     await Product.findOneAndUpdate(
    //       { productId: productItem.productId },
    //       { $inc: { amount: productItem.quantity } } // Increment stock by the refunded quantity
    //     );
    //   }
    // }(not use it because use base of Deduction on Customer Acceptance:
  