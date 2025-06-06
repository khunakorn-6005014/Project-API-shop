// APIproject/notifications/controllers/notificationController.js
import asyncHandler from "express-async-handler";
import Notification from "../models/notification.js";

// Fetch unread notifications for a user
export const getUserNotifications = asyncHandler(async (req, res) => {
  const userId = req.userData.userId;
  const notifications = await Notification.find({ userId, status: "unread" });

  res.status(200).json({ success: true, notifications });
});

// Mark a notification as read
export const markNotificationAsRead = asyncHandler(async (req, res) => {
  const { notificationId } = req.body;
  await Notification.findByIdAndUpdate(notificationId, { status: "read" });

  res.status(200).json({ success: true, message: "Notification marked as read." });
});