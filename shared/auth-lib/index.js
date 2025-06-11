// APIProject/shared/auth-lib/index.js
import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  console.log("auth-lib: verifyToken middleware invoked");  // Debug log

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
    return res.status(401).json({ message: "Invalid or missing token. Authentication Failed" });
  }
  
  const token = authHeader.split(" ")[1];
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: "Server misconfiguration: JWT secret missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userData = decoded;
    console.log("auth-lib: token verified", decoded);  // Debug log
    next();
  } catch (err) {
    console.error("auth-lib: token verification error", err);
    const message = err.name === "TokenExpiredError" ? "Token expired. Please log in again." : "Invalid token. Authentication Failed";
    return res.status(401).json({ message, error: err.message });
  }
};

export default verifyToken;