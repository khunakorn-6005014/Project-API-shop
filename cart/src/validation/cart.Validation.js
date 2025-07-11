export const validateCartAddition = (req, res, next) => {
  const { productId, name, quantity, price } = req.body;
  if (!productId || !name || typeof quantity !== "number" || typeof price !== "number") {
    return res.status(400).json({ success: false, message: "Invalid item data for cart." });
  }
  next();
}