// APIproject/shipping/services/shippingService.js
import { v4 as uuidv4 } from "uuid";
import Shipping from "../models/shipping.js";
import Order from "../order/model/order.js";
import { updateProductStock } from "../product/utils/updateProductStock.js";
import { publishShippingEvent as publishEvent } from "../mq/producer.js";  // ← correct path

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
    await Order.findOneAndUpdate({ orderId }, { status: "awaiting shipment" });

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
    // Find the shipment and ensure that it has been delivered.
    const order = await Order.findOne({ orderId });
    if (!order) throw new Error("Order not found.");
    if (order.userId !== userId) throw new Error("Order does not belong to this user.");    
  // For safety, you might want to only allow certain transitions.
  // Here, we're allowing the update to 'delivered
         
if (newStatus !== "delivered") {
    throw new Error("Only 'delivered' status allowed here.");
 }
const shipment = await Shipping.findOneAndUpdate(
    { orderId, userId },
    { status: newStatus },
    { new: true }
  );
if (!shipment) {
    throw new Error("Shipment not found.");
  }
await publishEvent("shipment.delivered", {
        orderId,
        userId,
        newStatus,
        timestamp: new Date(),
      });

return { success: true, message: "Order deliverd successfully." ,shipment};
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
      await Order.findOneAndUpdate({ orderId }, { status: "completed" });
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

