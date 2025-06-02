//APIproject/product/models/product.js
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    productId: { type: String, required: true, unique: true },
    name: { 
        type: String, 
        required: true, 
        trim: true },
    price: { 
        type: Number, 
        required: true, 
        min: 0 },
    description: { 
        type: String, 
        trim: true, 
        default: "No description provided" },
    amount: { 
        type: Number, 
        required: true, 
        min: 0 },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" }, // Links product to seller
}, { timestamps: true });

export default mongoose.model("Product", ProductSchema);