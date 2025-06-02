//APIproject/user/routes/userRoutes.js
import express from "express"; 
import { login, register, userProfile,getAllusers,deleteUser,updateUser,upgradeToAdmin} from "../controller/userController.js";
import { verifyAdmin} from "../middleware/authAdmin.js";
import verifyToken from "../../config/auth.middleware.js"

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.get("/profile/:id", verifyToken, userProfile);
router.get("/users", verifyToken,verifyAdmin, getAllusers);
router.delete("/profile/:id", verifyToken, deleteUser);
router.put("/profile/:id", verifyToken, updateUser);
router.put("/admin/:id", verifyToken, upgradeToAdmin);
export default router;
//http://localhost:3000/users/login
//http://localhost:3000/users/register
//http://localhost:3000/users/admin/:id
//http://localhost:3000/users/users?page=1&sort=email
//http://localhost:3000/users/profile/
//