// APIproject/shipping/services/shippingService.js
import { v4 as uuidv4 } from "uuid";
import Shipping from "../models/shipping.js";
import Order from "../models/orderData.js";
import { updateProductStock } from "../utils/updateProductStock.js";
import { publishShippingEvent as publishEvent } from "../mq/producer.js";  // ← correct path

// Helper function to wrap a promise with a timeout
function withTimeout(promise, ms, errorMsg) {
  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error(errorMsg)), ms);
  });
  return Promise.race([promise, timeout]);
}
class ShippingService {
  // Creates a shipment for the given order and user
  /**
   * Creates a shipment for the given order and user.
   * The caller must supply the shipping address details.
   * 
   * @param {Object} params
   * @param {String} params.orderId
   * @param {String} params.userId
   * @param {Object} params.address 
   * @param {Object} params.carrier
   * - The address details (street, city, state, postalCode, country, phoneNumber).
   * @returns {Promise<Object>} The shipment record.
   */
  // @param lines are not executable code; 
  // they're just descriptions. Meanwhile, the function parameters 
  // (like { orderId, userId, address }) are defined by the signature.
 static async createShipment({ orderId, userId, address,carrier }) {
     const order = await Order.findOne({ orderId });
           if (!order) {
           throw new Error("Order not found.");
         }
         if (order.userId !== userId) {
           throw new Error("Order does not belong to this user.");
         }
   
    const trackingNumber = uuidv4().slice(0, 12); // Simulated tracking number
    const shipment = await Shipping.create({
      shipmentId: uuidv4(),
      orderId,
      userId,
      trackingNumber,
      carrier , // Default carrier; can be dynamic later.
      address, // This is the user-provided address.
      status: "awaiting shipment",
      expectedDeliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now.
    });
     console.log(" the shipping details:", shipment);
  // Update order status to reflect shipment initiation.
       //await Order.findOneAndUpdate({ orderId }, { status: "awaiting shipment" })  ;
    await publishEvent("awaiting.shipment",{
       orderId,
       userId,
       status: "awaiting shipment",
       timestamp: new Date(),
    });
    return shipment;
  }
   // updated a shipment for the given order and user
  /**
   * @param {Object} params
   * @param {String} params.orderId
   * @param {String} params.userId
   * @param {String} params.newStatus
   * @returns {Promise<Object>} A response message.
   */
  static async updateDeliverStatus ({ orderId, userId, newStatus }) {
    // Verify order and ownership
    const order = await Order.findOne({ orderId });
    if (!order) throw new Error("Order not found.");
    if (order.userId !== userId) throw new Error("Order does not belong to this user.");
    
    // Enforce that status must be "delivered" no matter what, ignoring newStatus parameter:
    if (newStatus !== "delivered") {
      throw new Error("Only 'delivered' status allowed here.");
    }
    
    // Explicitly set status to "delivered"
    const shipment = await Shipping.findOneAndUpdate(
      { orderId, userId },
      { status: "delivered" },
      { new: true }
    );
    if (!shipment) throw new Error("Shipment not found.");
    
    // Wrap the publishEvent call in a timeout to avoid hang-ups.
 await withTimeout(
  publishEvent("shipment.delivered", {
    orderId,
    userId,
    status: "delivered",
    timestamp: new Date(),
  }),
      5000, // set a 5-second timeout (adjust as needed)
      "Timeout: Publishing 'shipment.delivered' event took too long."
    );
    
    return { success: true, message: "Order delivered successfully.", shipment };
  }
  /**
   * Handles the user decision once the shipment has been delivered.
   * If accepted, the inventory is decremented permanently.
   * If returned, the refund process is triggered.
   * 
   * @param {Object} params
   * @param {String} params.orderId
   * @param {String} params.userId
   * @param {String} params.decision - Either "accept" or "return".
   * @returns {Promise<Object>} A response message.
   */
  static async handleUserDecision({ orderId, userId, decision }) {
    // Find the shipment and ensure that it has been delivered.
    const order = await Order.findOne({ orderId });
    if (!order) throw new Error("Order not found.");
    if (order.userId !== userId) throw new Error("Order does not belong to this user.");

    const shipment = await Shipping.findOne({ orderId, userId });
    if (!shipment || shipment.status !== "delivered") {
      throw new Error("Shipment must be delivered before accept/return.");
    }

    if (decision === "accept") {
      //await Order.findOneAndUpdate({ orderId }, { status: "completed" });
      console.log("user accept product")
      await publishEvent("completed.shipment",{
       orderId,
       userId,
       status: "completed",
       timestamp: new Date(),
    });
      // Decrement inventory permanently.
       for (const productItem of order.products) {
        await updateProductStock(productItem.productId, productItem.quantity, "decrement");
      }
    } else if (decision === "return") {
      await Order.findOneAndUpdate({ orderId }, { status: "returned" });
      // publish a refund request event
      await publishEvent("shipment.returned", {
        orderId,
        userId,
        status: "returned",
        refundAmount: order.totalAmount,
        timestamp: new Date(),
      });
    }
    else {
      throw new Error("Decision must be 'accept' or 'return'.");
    }

    return { success: true, message: `Order ${decision}d successfully.` };
  }
}
export default ShippingService;