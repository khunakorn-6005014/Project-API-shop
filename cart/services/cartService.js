// APIproject/cart/services/cartService.js
import { v4 as uuidv4 } from "uuid";
import Cart from "../models/cart.js";
import Product from "../../product/models/product.js"
import Order from "../../order/model/order.js"


class CartService {
  // Retrieve or create a cart for the user
  static async getCart(userId) {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ cartId: uuidv4(), userId, items: [] });
      console.log(`Created new cart for userId: ${userId}`);
    }
    return cart;
  }

  // Add an item to the user's cart
  static async addItem(userId, itemData) {
    const { productId, name, quantity, price } = itemData;
     console.log(`Attempting to add product ${productId} to cart for user ${userId}`);
     // Query the product entity for this productId
    const product = await Product.findOne({ productId });
    console.log("Fetched product from Product collection:", product);
   
    if (!product) { // Ensure product exists
      throw new Error("Product not found in inventory.");
    }
    
    if (product.amount <= 0) {// Check if product is out-of-stock
      throw new Error("Product is out of stock.");
    }
    
    if (quantity > product.amount) {// Optionally, check if the requested quantity is available
      throw new Error("Requested quantity exceeds available stock.");
    }

    let cart = await this.getCart(userId);
    // Check if the item already exists in the cart
    const existingItemIndex = cart.items.findIndex(item => item.productId === productId);
    if (existingItemIndex > -1) {
      // Increase the quantity of the existing item
      cart.items[existingItemIndex].quantity += quantity;
      console.log(`Updated quantity for product ${productId} in cart.`);
    } else {
      // Add new item to cart
      cart.items.push({ productId, name, quantity, price });
      console.log(`Added new product ${productId} to cart.`);
    }
    await cart.save();
    console.log("Cart saved/updated successfully.");
    return cart;
  }

  // Update the quantity of an existing item
  static async updateItem(userId, productId, quantity) {
    let cart = await this.getCart(userId);
    const itemIndex = cart.items.findIndex(item => item.productId === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      console.log(`Updated product ${productId} quantity to ${quantity} for user ${userId}`);
      await cart.save();
      console.log("Cart is updated successfully.");
    }
    return cart;
  }

  // Remove an item from the cart
  static async removeItem(userId, productId) {
    let cart = await this.getCart(userId);
    cart.items = cart.items.filter(item => item.productId !== productId);
    console.log(`Removed product ${productId} from cart for user ${userId}`);
    await cart.save();
    console.log("Cart is removed successfully.");
    return cart;
  }

static async checkout(userId) {
    let cart = await this.getCart(userId);

    if (cart.items.length === 0) {
      throw new Error("Cart is empty. Cannot proceed with checkout.");
    }
    // Create order based on cart contents
    const order = await Order.create({
      orderId: uuidv4(),
      userId,
      products: cart.items,     // directly using cart items
      totalAmount: cart.totalAmount,
      status: "pending"
    });

    console.log(`Order ${order.orderId} created for user ${userId}`);

    // Clear the cart after successful checkout
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    return order;
  }
}
export default CartService;