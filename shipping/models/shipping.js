// APIproject/shipping/models/shipping.js
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const ShippingSchema = new mongoose.Schema({
  shipmentId: { 
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
  address: { 
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    phoneNumber: { type: String, required: true },
  },
  trackingNumber: { 
    type: String, 
    unique: true 
  },
  carrier: { 
    type: String, 
    enum: ["DHL", "FedEx", "UPS", "USPS", "LocalCourier"], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ["awaiting shipment", "shipped", "out for delivery", "delivered", "returned"],
    default: "awaiting shipment" 
  },
  expectedDeliveryDate: { 
    type: Date 
  }
}, { timestamps: true });

export default mongoose.model("Shipping", ShippingSchema);