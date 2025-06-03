//APIproject/product/controller/productController.js
import asyncHandler from "express-async-handler";
import { v4 as uuidv4 } from "uuid";
import Product from "../models/product.js"
import User from "../../users/models/user.js"

export const createProduct = asyncHandler(async (req, res) => {
    try {
        const { name, price, description, amount } = req.body;
        const userId = req.userData.userId;
        console.log("User Data in createProduct:", userId);
        if (!name || !price || !description || !amount) {
            return res.status(400).json({ error: "All fields are required!" });
        }

        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        const newProduct = await Product.create({
            productId: uuidv4(),
            name,
            price,
            description,
            amount,
            userId,
        });
        console.log("Product ID Generated:", newProduct.productId);
        await User.findOneAndUpdate({ userId }, { $push: { myProducts: newProduct.productId } });

        res.status(201).json({ success: true, message: "Product created successfully", product: newProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
export const updateProduct = asyncHandler(async (req, res) => {
  try{
    const { id } = req.params;
    const userId = req.userData.userId;
    console.log("User Data in updated:", userId);
    const product = await Product.findOne({ productId: id });
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }
    // Ensure product owner can only update their own product 
  if (product.userId !== userId) {
            return res.status(403).json({ message: "You can only update your own product." });
        }
  const updates = req.body;
  if (!updates || Object.keys(updates).length === 0) {
    return res.status(400).json({ message: "No update data provided." });
  }
  const updatedProduct = await Product.findOneAndUpdate(
            { productId: id }, updates, { new: true });
  if (!updatedProduct) {
    return res.status(404).json({ message: "Product not found or update failed." });
}
  res.status(200).json({ success: true, message: "Product updated successfully", product: updatedProduct });
  }catch(error){
    res.status(500).json({ success: false, message: error.message });
  }
});

export const deletedProduct = asyncHandler(async (req, res) => {
  try{
    const { id } = req.params;
    const userId = req.userData.userId;
    console.log("User Data in deleted:", userId);
     const product = await Product.findOne({ productId: id });
    if (!product) {
            return res.status(404).json({ message: "Product not found." });}
     // Ensure product owner can only deleted their own product
   if (product.userId !== userId) {
            return res.status(403).json({ message: "You can only delete your own product." });
        }
     const deletedProduct = await Product.findOneAndDelete({ productId: id });
     if (!deletedProduct) {
    return res.status(404).json({ message: "Product not found or already deleted." });
     }    
     // ✅ Remove product from `myProducts`
    await User.findOneAndUpdate({ userId }, { $pull: { myProducts: id } });
        res.status(200).json({ success: true, message: "Product deleted successfully.", product : deletedProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
