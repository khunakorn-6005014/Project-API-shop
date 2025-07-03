import asyncHandler from 'express-async-handler';
import Order from '../models/order.js'
import { v4 as uuidv4 } from 'uuid';

// Utility: who is calling and what roles they have
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

export const viewOrderId = asyncHandler(async (req, res) => {
  try{
    const { id } = req.params;
    const callerId = req.headers['x-user-id'] || '';
    console.log("callerId in viewing product is", callerId)
     if (!callerId) {
    return res.status(401).json({ message: 'Authentication required.' });
  }
  const order = await Order.findOne({ productId: id });
     if (!order) {
        return res.status(404).json({ message: "Order not found." });
    }
    res.status(200).json({ success: true, message: "Order details retrieved.", Order });


    }catch (error) {
     res.status(500).json({ success: false, message: error.message });
   }
});