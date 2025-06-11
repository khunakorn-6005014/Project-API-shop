// APIProject/shared/auth-lib/index.js
// index.js in auth-lib
import jwt from 'jsonwebtoken';

// Your token verification logic
const verifyToken = (req, res, next) => {
  // Example logic: extract token from headers and verify
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userData = decoded; // assuming decoded token includes userId
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

export default verifyToken;