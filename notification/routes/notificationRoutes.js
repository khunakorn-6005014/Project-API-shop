import express from "express";
import { getUserNotifications, markNotificationAsRead } from "../controllers/notificationController.js";
import verifyToken from "../node_modules/auth-lib/index.js"; // Ensure this exists and works

const router = express.Router();

router.get("/",verifyToken, getUserNotifications );
router.post("/read",verifyToken, markNotificationAsRead);

export default router;