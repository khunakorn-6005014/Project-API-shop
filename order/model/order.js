//APIproject/product/models/product.js
import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true }, // Use UUID for flexibility
    userId: { type: String, ref: "User" }, // Who placed the order
    products: [{ 
        productId: String, 
        quantity: Number, 
        price: Number 
    }], // List of purchased items
    status: { type: String, enum: ["pending", "paid", "shipped", "delivered","payment_failed","refunded"], default: "pending" },
    totalAmount: { type: Number, required: true }, // Final total price
    paymentId: { type: String, ref: "Payment" }, // Link to payment details
    shippingId: { type: String, ref: "Shipping" }, // Link to shipping details
    notificationId: { type: String, ref: "Notification" }, // Link to user notifications
}, { timestamps: true });

export default mongoose.model("Order", OrderSchema);