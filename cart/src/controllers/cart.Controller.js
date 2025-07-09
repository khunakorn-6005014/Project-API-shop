import asyncHandler from "express-async-handler";
import CartService from '../services/cart.Service.js'

// Add an item to the cart
export const addItemToCart = asyncHandler(async (req, res) => {
  const userId = req.headers['x-user-id'] || '';
  const itemData = req.body;
  console.log("User Data in addcart:", userId);
   if (!userId) {
    return res.status(401).json({ message: 'Authentication required.' });
  }
  const cart = await CartService.addItem(userId, itemData);
  res.status(200).json({ success: true, message: "Item added to cart", cart });
});

// Update an item in the cart
export const updateCartItem = asyncHandler(async (req, res) => {
  try{
  const userId = req.headers['x-user-id'] || '';
  const { productId, quantity } = req.body;
  console.log("User Data in updatecart:", userId);
   if (!userId) {
    return res.status(401).json({ message: 'Authentication required.' });
  }
  const cart = await CartService.updateItem(userId, productId, quantity);
  res.status(200).json({ success: true, message: "Item updated in cart", cart });
}catch (error) {
        res.status(500).json({ success: false, message: error.message });
}
});
// Remove an item from the cart
export const removeItemFromCart = asyncHandler(async (req, res) => {
    try{
  const userId = req.headers['x-user-id'] || '';
  const { productId } = req.body; //
  console.log("User Data in removecart:", userId);
   if (!userId) {
    return res.status(401).json({ message: 'Authentication required.' });
  }
  const cart = await CartService.removeItem(userId, productId);
  res.status(200).json({ success: true, message: "Item removed from cart", cart });
}catch (error) {
        res.status(500).json({ success: false, message: error.message });
}
});
// View the user’s cart
export const viewCart = asyncHandler(async (req, res) => {
  try{
  const userId = req.headers['x-user-id'] || '';
  console.log("User Data in viewcart:", userId);
  if (!userId) {
    return res.status(401).json({ message: 'Authentication required.' });
  }
  const cart = await CartService.getCart(userId);
  res.status(200).json({ success: true, cart });
}catch (error) {
        res.status(500).json({ success: false, message: error.message });
}
});
export const checkoutCart = asyncHandler(async (req, res) => {
   try{
  //const { userId } = req.userData;
  const userId = req.headers['x-user-id'] || '';
  console.log(`User is checking out :`,userId);
  if (!userId) {
    return res.status(401).json({ message: 'Authentication required.' });
  }
  const order = await CartService.checkout(userId);
  res.status(200).json({ success: true, message: "Order created successfully", order });
}catch (error) {
        res.status(500).json({ success: false, message: error.message });
}
});

