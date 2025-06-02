export const verifyAdmin = (req, res, next) => {
    if (!req.userData || !req.userData.isAdmin) {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
};