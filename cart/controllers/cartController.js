// APIproject/cart/controllers/cartController.js
import asyncHandler from "express-async-handler";
import CartService from "../services/cartService.js";

// Add an item to the cart
export const addItemToCart = asyncHandler(async (req, res) => {
  const userId = req.userData.userId;
  const itemData = req.body;
  console.log("User Data in addcart:", userId);
  const cart = await CartService.addItem(userId, itemData);
  res.status(200).json({ success: true, message: "Item added to cart", cart });
});

// Update an item in the cart
export const updateCartItem = asyncHandler(async (req, res) => {
  const userId = req.userData.userId;
  const { productId, quantity } = req.body;
  console.log("User Data in updatecart:", userId);
  const cart = await CartService.updateItem(userId, productId, quantity);
  res.status(200).json({ success: true, message: "Item updated in cart", cart });
});

// Remove an item from the cart
export const removeItemFromCart = asyncHandler(async (req, res) => {
  const userId = req.userData.userId;
  const { productId } = req.body; //
  console.log("User Data in removecart:", userId);
  const cart = await CartService.removeItem(userId, productId);
  res.status(200).json({ success: true, message: "Item removed from cart", cart });
});

// View the user’s cart
export const viewCart = asyncHandler(async (req, res) => {
  const userId = req.userData.userId;
  console.log("User Data in viewcart:", userId);
  const cart = await CartService.getCart(userId);
  res.status(200).json({ success: true, cart });
});