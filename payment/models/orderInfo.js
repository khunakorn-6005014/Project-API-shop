import mongoose from "mongoose";

const OrderInfoSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true }, // Use UUID for flexibility
    userId: { type: String, ref: "User" }, // Who placed the order
    products: [{ 
        productId: String, 
        quantity: Number, 
        price: Number 
    }], // List of purchased items
    status: { type: String, enum: [
      "pending",         // Order created, awaiting payment.
      "paid",            // Payment successful.
      "payment_failed",  // Payment failed.
      "awaiting_shipment", // Shipment has been created.
      "shipped",         // Shipment dispatched.
      "delivered",       // Shipment delivered.
      "completed",       // Customer accepted the shipment.
      "returned",        // Customer rejected the shipment.
      "refunded"         // Refund processed.
    ]
, default: "pending" },
    totalAmount: { type: Number, required: true }, // Final total price
}, { timestamps: true });

export default mongoose.model("OrderInfo", OrderInfoSchema);