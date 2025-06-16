// APIproject/notifications/models/notification.js
import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    ref: "User", required: true },
  title: {
    type:String,required: true },
  message:{
    type: String, required: true },
  type: { 
    type: String, 
    enum: ["payment", "shipping", "refund"], required: true },
  status: { 
    type: String, enum: ["unread", "read"], default: "unread" },
  createdAt: { 
    type: Date, default: Date.now }
});

export default mongoose.model("Notification", NotificationSchema);