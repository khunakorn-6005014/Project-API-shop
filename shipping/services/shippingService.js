// APIproject/shipping/services/shippingService.js
import { v4 as uuidv4 } from "uuid";
import Shipping from "../models/shipping.js";
import Order from "../../order/models/order.js";

class ShippingService {
  // Creates a shipment for the given order and user
  static async createShipment({ orderId, userId }) {
    const trackingNumber = uuidv4().slice(0, 12); // Simulated tracking number

    const shipment = await Shipping.create({
      shipmentId: uuidv4(),
      orderId,
      userId,
      trackingNumber,
      carrier: "FedEx", // You can enhance this later to choose dynamically
      status: "awaiting shipment",
      expectedDeliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    });

    // Update order status to reflect shipment initiation
    await Order.findOneAndUpdate({ orderId }, { status: "awaiting shipment" });

    return shipment;
  }
}

export default ShippingService;