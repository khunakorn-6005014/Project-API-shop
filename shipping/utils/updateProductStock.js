//import Product from "../models/product.js";
import {publishShippingEvent as publishEvent } from "../mq/producer.js";  // ← correct path
/**
 * Updates a product's stock.
 * @param {String} productId - The ID of the product.
 * @param {Number} quantity - The quantity to change.
 * @param {String} operation - "decrement" to reduce or "increment" to add back.
 * @returns {Promise<Object>} - The updated product document.
 *///The JSDoc @param tags in the comments are purely for documentation
export const updateProductStock = async (productId, quantity, operation) => {
  if (operation === "decrement") {
    // return await Product.findOneAndUpdate(
    //   { productId },
    //   { $inc: { amount: -quantity } },
    //   { new: true }
    // );
     await publishEvent("decrement.product",{
            productId,
            quantity,
            timestamp: new Date(),
         });
  } else if (operation === "increment") {
    // return await Product.findOneAndUpdate(
    //   { productId },
    //   { $inc: { amount: quantity } },
    //   { new: true }
    // );
    await publishEvent("increment.product",{
            productId,
            quantity,
            timestamp: new Date(),
         });
  } else {
    throw new Error("Invalid operation provided. Use 'decrement' or 'increment'.");
  }
};