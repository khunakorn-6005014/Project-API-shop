// product-service/src/controllers/product.controller.js
import asyncHandler from 'express-async-handler';
import { v4 as uuidv4 } from 'uuid';
import Product from '../models/product.js';
//import User from '../models/User.js';         // assuming you copied the User model
import {publishEvent} from '../mq/producer.js'
function getCaller(req) {
  const callerId = req.headers['x-user-id'] || '';
  // split and remove empty entries
  const raw = req.headers['x-user-roles'] || '';
  const roles = raw
    .split(',')
    .map(r => r.trim())
    .filter(Boolean);
  console.log('callerId is', callerId);
  console.log('roles is', roles);
  return { callerId, roles };
}
export const createProduct = asyncHandler(async (req, res) => {
 try{
  const callerId = req.headers['x-user-id'] || '';
  console.log("callerId in creating product is", callerId)
  // Only allow sellers or elevated roles to create
  if (!callerId) {
    return res.status(401).json({ message: 'Authentication required.' });
  }
  const { name, price, description, amount } = req.body;
  if (!name || price == null || amount == null) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }


  // Create product & link to user
  const newProduct = await Product.create({
    productId: uuidv4(),
    name,
    price,
    description,
    amount,
    userId: callerId
  });
  // Verify user exists
  // const user = await User.findOne({ userId: callerId });
  // if (!user) {
  //   return res.status(404).json({ error: 'User not found.' });
  // }
  // Optionally push into user.myProducts
  // user.myProducts.push(newProduct.productId);
  // await user.save();
await publishEvent(ProductCreated,{
    productId: newProduct.productId,
    name: newProduct.name,
    price: newProduct.price,
    description: newProduct.description,
    amount : newProduct.amount,
    userId: callerId,
    timestamp: new Date(),
});
  res.status(201).json({
    success: true,
    message: 'Product created',
    product: newProduct
  });
   } catch (err) {res.status(500).json({ error: err.message });   
     }
});

export const updateProduct = asyncHandler(async (req, res) => {
  try {
  const { id } = req.params;
  const { callerId, roles } = getCaller(req);
  const elevated = ['admin','editor','moderator'];
  console.log("callerId in updating is", callerId)
  console.log("roles is", roles)
  const isElevated = roles.some(r => elevated.includes(r));
  const product = await Product.findOne({ productId: id });
    if (!callerId) {
    return res.status(401).json({ message: 'Authentication required.' });
  }
    if (!product) {
        return res.status(404).json({ message: "Product not found." });
    }
    if (product.userId !== callerId && !isElevated) {
            return res.status(403).json({ message: "You can only update your own product." });
        }
  const updates = req.body;
  const updatedProduct = await Product.findOneAndUpdate(
              { productId: id }, updates, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found or update failed." });
  }
  await publishEvent(ProductUpdated,{
    productId: updates.productId,
    name:      updates.name,
    price:     updates.price,
    amount:    updates.amount,
    timestamp: new Date(),
  });

  res.json({ message: "Product updated successfully", Product: updatedProduct });
  }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message,
        })
    }
});
export const deletedProduct = asyncHandler(async (req, res) => {
  try {
   const { id } = req.params;
   const { callerId, roles } = getCaller(req);
   const elevated = ['admin','editor','moderator'];
   console.log("callerId in deleting is", callerId)
   console.log("roles is", roles)
   const isElevated = roles.some(r => elevated.includes(r));
    const product = await Product.findOne({ productId: id });
     if (!callerId) {
    return res.status(401).json({ message: 'Authentication required.' });
  }
    if (!product) {
        return res.status(404).json({ message: "Product not found." });
    }
    if (product.userId !== callerId && !isElevated) {
            return res.status(403).json({ message: "You can only update your own product." });
        }
    const deletedProduct = await Product.findOneAndDelete({ productId: id });
         if (!deletedProduct) {
        return res.status(404).json({ message: "Product not found or already deleted." });
         }
    // ✅ Remove product from `myProducts`
        // await User.findOneAndUpdate({ userId: callerId}, { $pull: { myProducts: id } });
        //     res.status(200).json({ success: true, message: "Product deleted successfully.", product : deletedProduct });      
 await publishEvent(ProductRemoved,{
   productId: deletedProduct.productId,
   timestamp: new Date(),
 });       
  } catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message,
        })
    }
});
export const viewProductId = asyncHandler(async (req, res) => {
  try{
    const { id } = req.params;
    const callerId = req.headers['x-user-id'] || '';
    console.log("callerId in viewing product is", callerId)
     if (!callerId) {
    return res.status(401).json({ message: 'Authentication required.' });
  }
    const product = await Product.findOne({ productId: id });
   if (!product) {
        return res.status(404).json({ message: "Product not found." });
    }
    res.status(200).json({ success: true, message: "Product details retrieved.", product });
    }catch (error) {
     res.status(500).json({ success: false, message: error.message });
   }
});
export const getAllProduct = asyncHandler(async (req, res) => {
  let queryObj = { ...req.query };
    ['page', 'sort', 'limit', 'fields']
        .forEach(el => delete queryObj[el]);  // phase 2 - advance filtering
    const strQuery = JSON.stringify(queryObj)
        .replace(/\b(gte|gt|lte|lt)\b/g,
            match =>`$${match}`);
    queryObj = JSON.parse(strQuery);
    console.log("Received Query Params:", req.query);
    console.log("Processed Query Object:",queryObj);
    
    const sort = req.query.sort ?req.query.sort.split(',').join(' ') : "";
    
    const selected = req.query.fields ? req.query.fields.split(',').join(' ') : "";
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
const limit = Math.max(1, parseInt(req.query.limit) || 100);
    const skip = (page - 1) * limit;
    console.log("Sorting By:", sort);
   console.log("Selected Fields:", selected);
//http://localhost/product/Products?page=1&sort=name
    try{
    const { callerId, roles } = getCaller(req);
    const elevated = ['admin','editor','moderator'];
    console.log("callerId in updating is", callerId)
    console.log("roles is", roles)
    const isElevated = roles.some(r => elevated.includes(r));
     if (!callerId) {
    return res.status(401).json({ message: 'Authentication required.' });
  }
    if (!isElevated) {
    return res.status(403).json({ message: 'only admin, editor and moderator can view all product.' });
  }
   const documents = await Product.countDocuments(queryObj);
       if (documents === 0) {
       return res.status(200).json({ success: true, data: [], message: "No products found." });
   }
           if (skip >= documents && documents > 0) {
       return res.status(200).json({
            success: true, data: [], message: "No more products to show on this page." });
         } 
         const product = await Product.find(queryObj).skip(skip)
          .limit(limit)
          .select(selected)
          .sort(sort);
          return res.status(200).json({
              data: product,
              success: true, 
              page,
              limit,
              totalPages: Math.ceil(documents / limit),
              documents,
              message: "product list" });
     }
  catch (error) {
     res.status(500).json({ success: false, message: error.message });
   }
});