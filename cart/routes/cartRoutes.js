// APIproject/cart/routes/cartRoutes.js
import express from "express";
import { addItemToCart, updateCartItem, removeItemFromCart, viewCart } from "../controllers/cartController.js";
import { validateCartAddition } from "..//validation/cartValidation.js";
import verifyToken from "../../config/auth.middleware.js" // Ensure you have token verification middleware

const router = express.Router();
router.post("/add", verifyToken, validateCartAddition, addItemToCart);// Route to add an item to the cart
router.post("/update", verifyToken, updateCartItem);// Route to update an item in the cart
router.post("/remove", verifyToken, removeItemFromCart);// Route to remove an item from the cart
router.get("/", verifyToken, viewCart);// Route to view the current user's cart
export default router;