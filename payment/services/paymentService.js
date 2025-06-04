import { v4 as uuidv4 } from "uuid";
import Order from "../../order/model/order.js";
import Payment from "../models/payment.js";

class PaymentService {
  // Simulate processing payment and update order status
  static async processPayment({ orderId, userId, amount, paymentMethod }) {
    // Simulate a payment gateway call (this can later be replaced or integrated with a real gateway)
    const transactionId = uuidv4();  // Simulated transaction ID
    
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
}

export default PaymentService;

