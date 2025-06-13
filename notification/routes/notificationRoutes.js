import express from "express";
import { getNotifications, markNotificationAsRead } from "../controllers/notificationController.js";
import verifyToken from "../node_modules/auth-lib/index.js"; // Ensure this exists and works

const router = express.Router();

router.get("/",verifyToken, getNotifications);
router.post("/read",verifyToken, markNotificationAsRead);

export default router;