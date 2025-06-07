// APIproject/payment/models/payment.js
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const PaymentSchema = new mongoose.Schema({
  paymentId: { 
    type: String, 
    required: true, 
    unique: true, 
    default: () => uuidv4() 
  },
  orderId: { 
    type: String, 
    ref: "Order", 
    required: true 
  },
  userId: { 
    type: String, 
    ref: "User", 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  paymentMethod: { 
    type: String, 
    enum: ["credit_card", "paypal", "bank_transfer","refund"], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ["pending", "completed", "failed","refunded"], 
    default: "pending" 
  },
  transactionId: { 
    type: String, 
    unique: true 
  }
}, { timestamps: true });

export default mongoose.model("Payment", PaymentSchema);