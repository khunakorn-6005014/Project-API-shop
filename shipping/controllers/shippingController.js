// APIproject/shipping/controllers/shippingController.js
import asyncHandler from "express-async-handler";
import ShippingService from "../services/shippingService.js";
import Shipping from "../models/shipping.js";
import Order from "../order/model/order.js";

// Endpoint to create a shipment with a provided address
export const createShipment = asyncHandler(async (req, res) => {
try{
  // userId is attached by your verifyToken middleware
  const userId = req.userData.userId;
  const { orderId, address ,carrier} = req.body;
  console.log("User Data in shippingCreate:", userId);
  // Validate that address contains the required fields (optional)
  if (!address || !address.street || !address.city || !address.state || !address.postalCode || !address.country || !address.phoneNumber) {
    res.status(400).json({ success: false, message: "Missing required address fields." });
    return;
  }
  
  const shipment = await ShippingService.createShipment({ orderId, userId, address,carrier });
  res.status(200).json({success: true,message: "Shipment created successfully.",shipment,
  });
}catch (error) {
        res.status(500).json({ success: false, message: error.message });
}
});
export const updateShipmentStatus = asyncHandler(async (req, res) => {
try{  
  const userId = req.userData.userId; // or use admin authentication
  const { orderId, newStatus } = req.body;
  const order = await Order.findOne({ orderId });
        if (!order) {
        throw new Error("Order not found.");
      }
      if (order.userId !== userId) {
        throw new Error("Order does not belong to this user.");
      }
  console.log("User Data in updatedShipping:", userId);
  // For safety, you might want to only allow certain transitions.
  // Here, we're allowing the update to 'delivered'
  if (newStatus !== "delivered") {
    return res.status(400).json({ success: false, message: "Only delivered status can be set using this endpoint." });
  }
  const shipment = await Shipping.findOneAndUpdate(
    { orderId, userId },
    { status: newStatus },
    { new: true }
  );
  if (!shipment) {
    return res.status(404).json({ success: false, message: "Shipment not found." });
  }
  res.status(200).json({ success: true, message: "Shipment status updated successfully.", shipment });
}catch (error) {
        res.status(500).json({ success: false, message: error.message });
}
 });


export const userAcceptance = asyncHandler(async (req, res) => {
  try {
    const userId = req.userData.userId;
    const { orderId, decision } = req.body;
    console.log("User Data in userAccept:", userId);
    const result = await ShippingService.handleUserDecision({ orderId, userId, decision });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }  
});
/// 