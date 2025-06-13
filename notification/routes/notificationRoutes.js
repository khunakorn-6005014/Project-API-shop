import express from "express";
import { getUserNotifications, markNotificationAsRead } from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", getUserNotifications);
router.post("/read", markNotificationAsRead);

export default router;