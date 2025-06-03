//APIproject/cart/models/cart.js
import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
    cartId: { 
        type: String, 
        required: true, 
        unique: true }, // UUID for flexibility
    userId: { 
        type: String, 
        ref: "User" }, // Link to user
    items: [{
        productId: String, 
        name: String,  
        quantity: { 
            type: Number, default: 1 },  
        price: Number  
    }],
    totalAmount: { 
        type: Number, 
        default: 0 }, // Auto-calculated total
}, { timestamps: true });

// Automatically recalculate totalAmount on each save
CartSchema.pre("save", function (next) {
  this.totalAmount = this.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  next();
});



export default mongoose.model("Cart",CartSchema)