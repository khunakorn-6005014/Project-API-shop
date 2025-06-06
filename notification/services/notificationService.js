// APIproject/notifications/services/notificationService.js
import Notification from "../models/notification.js";

class NotificationService {
  static async createNotification(eventData, eventType) {
    const messageTemplates = {
      "payment.completed": `Your payment of $${eventData.amount} was successful.`,
      "shipment.delivered": `Your order (ID: ${eventData.orderId}) has been delivered.`,
      "refund.processed": `Your refund of $${eventData.refundAmount} has been processed.`,
    };

    await Notification.create({
      userId: eventData.userId,
      type: eventType.replace(".processed", "").replace(".completed", ""),
      message: messageTemplates[eventType],
    });

    console.log(`Notification created for user ${eventData.userId}: ${messageTemplates[eventType]}`);
  }
}

export default NotificationService;