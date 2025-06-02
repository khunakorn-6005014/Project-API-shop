//APIproject/product/controller/productController.js
import asyncHandler from "express-async-handler";
import { v4 as uuidv4 } from "uuid";
import Product from "../models/product.js"
import User from "../../users/models/user.js"

export const createProduct = asyncHandler(async (req, res) => {
    try {
        const { name, price, description, amount } = req.body;
        const userId = req.userData.userId;

        if (!name || !price || !description || !amount) {
            return res.status(400).json({ error: "All fields are required!" });
        }

        const user = await User.findById(userId);
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
        await User.findByIdAndUpdate(userId, { $push: { myProducts: newProduct._id } });

        res.status(201).json({ success: true, message: "Product created successfully", product: newProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});