import express from "express";
import { addItemToCart, updateCartItem, removeItemFromCart, viewCart,checkoutCart } from "../controllers/cart.Controller.js"
import { validateCartAddition } from  '../validation/cart.Validation.js';
const router = express.Router();
router.post("/add", validateCartAddition, addItemToCart);// Route to add an item to the cart
router.post("/update", updateCartItem);// Route to update an item in the cart
router.post("/remove",  removeItemFromCart);// Route to remove an item from the cart
router.get("/",  viewCart);// Route to view the current user's cart
router.post("/checkout",  checkoutCart);//
export default router;