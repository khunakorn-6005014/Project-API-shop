//APIproject/product/models/product.js
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    productId: { type: String, required: true, unique: true },
    name: String,
    price: Number,
    description: String,
    amount: Number,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Links product to seller
}, { timestamps: true });

export default mongoose.model("Product", ProductSchema);