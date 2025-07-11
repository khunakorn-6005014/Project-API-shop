// APIproject/shipping/controllers/shippingController.js
import asyncHandler from "express-async-handler";
import ShippingService from "../services/shippingService.js";

function getCaller(req) {
  const callerId = req.headers['x-user-id'] || '';
  // split and remove empty entries
  const raw = req.headers['x-user-roles'] || '';
  const roles = raw
    .split(',')
    .map(r => r.trim())
    .filter(Boolean);
  console.log('callerId is', callerId);
  console.log('roles is', roles);
  return { callerId, roles };
}
// Endpoint to create a shipment with a provided address
export const createShipment = asyncHandler(async (req, res) => {
try{
  // userId is attached by your verifyToken middleware
  const { callerId, roles } = getCaller(req);
  const elevated = ['admin','editor','moderator'];
  console.log("callerId in updating is", callerId)
  console.log("roles is", roles)
  if (!callerId) {
    return res.status(401).json({ message: 'Authentication required.' });
  }
   const isElevated = roles.some(r => elevated.includes(r));
  if (!isElevated) {
            return res.status(403).json({ message: "only admin, editor and moderator can" });
        }
  const userId = callerId;   
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
  const { callerId, roles } = getCaller(req);
  const elevated = ['admin','editor','moderator'];
  console.log("callerId in updating is", callerId)
  console.log("roles is", roles)
  if (!callerId) {
    return res.status(401).json({ message: 'Authentication required.' });
  }
   const isElevated = roles.some(r => elevated.includes(r));
  if (!isElevated) {
            return res.status(403).json({ message: "only admin, editor and moderator can" });
        }
  const userId = callerId;
  const { orderId, newStatus } = req.body;
    console.log("User Data in updatedShipping:", userId);
    
  const result = await ShippingService.updateDeliverStatus({ orderId, userId, newStatus });
  res.status(200).json({ success: true, message: "Shipment status updated to deliverd successfully.", result });
}catch (error) {
        res.status(500).json({ success: false, message: error.message });
}
 });



export const userAcceptance = asyncHandler(async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || '';
    const { orderId, decision } = req.body;
    console.log("User Data in userAccept:", userId);
    const result = await ShippingService.handleUserDecision({ orderId, userId, decision });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }  
});