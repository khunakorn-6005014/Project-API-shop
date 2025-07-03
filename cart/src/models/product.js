// cart-service/src/models/productInfo.js
import mongoose from 'mongoose';
const productInfoSchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true  },
  name:      { type: String, required: true, trim: true },
  price:     { type: Number, required: true, min: 0 },
  stock:     { type: Number, required: true, min: 0 },
}, { timestamps: true });
export default mongoose.model('ProductInfo', productInfoSchema);