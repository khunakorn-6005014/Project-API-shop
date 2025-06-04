// APIproject/payment/services/paymentService.js
import { v4 as uuidv4 } from "uuid";
import Order from "../../order/model/order.js";
import Payment from "../models/payment.js";

class PaymentService {
  // Simulate processing payment and update order status
  // Existing processPayment method remains unchanged
  static async processPayment({ orderId, userId, amount, paymentMethod }) {
    
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
      await Order.findOneAndUpdate({ orderId }, { status: "paid" });
      return payment;
  }
  // Refund processing: update payment record, order status, and restore inventory
  static async refundPayment({ orderId, userId }) {
    // Create a refund record in Payment with a "refunded" status
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
    return refund;
  }
}

export default PaymentService;
