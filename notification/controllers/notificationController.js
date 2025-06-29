// APIproject/notification/controllers/notificationController.js
import asyncHandler from "express-async-handler";
import Notification from "../models/notification.js";

// Fetch unread notifications for a user
export const getUserNotifications = asyncHandler(async (req, res) => {
  const userId = req.userData.userId;
  console.log("User Data in payment:", userId)
  const notifications = await Notification.find({ userId, status: "unread" });
  res.status(200).json({ success: true, notifications });
});

// Mark a notification as read
export const markNotificationAsRead = asyncHandler(async (req, res) => {
  const { notificationId } = req.body;
  const notif = await Notification.findByIdAndUpdate(notificationId, { status: "read" });
  if (!notif) {
    return res.status(404).json({ success: false, message: "Notification not found." });
  }
  res.status(200).json({ success: true, message: "Notification marked as read." });
});
