//flatfinder/config/auth.Middleware.js
import jwt from "jsonwebtoken";
export default (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
      return res.status(401).json({ message: "Invalid or missing token. Authentication Failed" });
    }
    //const token = authHeader.replace("Bearer ", "");
    const token = authHeader.split(" ")[1]; // Safely extract token
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "Server misconfiguration: JWT secret missing" });
    }
    console.log("JWT Secret:", process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userData = decoded;
    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    const message = err.name === "TokenExpiredError" ? "Token expired. Please log in again." : "Invalid token. Authentication Failed";
    return res.status(401).json({ message, error: err.message });
  }
};