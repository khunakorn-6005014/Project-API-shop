// APIproject/cart/utils/cartUtils.js
export const calculateTotalAmount = (items) => {
  return items.reduce((sum, item) => sum + item.quantity * item.price, 0);
};
//