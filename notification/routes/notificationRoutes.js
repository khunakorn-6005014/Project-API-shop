import express from "express";
import { getUserNotifications, markNotificationAsRead } from "../controllers/notificationController.js";
<<<<<<< HEAD
import verifyToken from "../node_modules/auth-lib/index.js"; // Ensure this exists and works

const router = express.Router();

router.get("/",verifyToken, getUserNotifications );
router.post("/read",verifyToken, markNotificationAsRead);
=======

const router = express.Router();

router.get("/", getUserNotifications);
router.post("/read", markNotificationAsRead);
>>>>>>> e2a817be2b092f7acb90a462b3c22d55d64ea9fb

export default router;