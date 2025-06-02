//APIproject/users/middleware/authAdmin.js
const isAdmin = (user) => user?.isAdmin === true;
export const verifyAdmin = (req, res, next) => {
    console.log("Admin Verification - User Data:", req.userData);
    console.log("Admin Status Type:", typeof req.userData.isAdmin);
    if (!req.userData) {
        return res.status(401).json({ message: "Unauthorized. Please log in." });
    }
    if (!isAdmin(req.userData)) {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
};