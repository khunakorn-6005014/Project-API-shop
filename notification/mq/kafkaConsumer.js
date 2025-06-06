// APIproject/notifications/mq/kafkaConsumer.js
import { Kafka } from "kafkajs";
import NotificationService from "../services/notificationService.js";

const kafka = new Kafka({
  clientId: "notifications-service",
  brokers: ["kafka:9092"], // Docker/Kubernetes setup
});

const consumer = kafka.consumer({ groupId: "notifications-group" });

await consumer.connect();
await consumer.subscribe({ topics: ["payment.completed", "shipment.delivered", "refund.processed"], fromBeginning: true });

consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    const eventData = JSON.parse(message.value.toString());
    console.log(`Received event ${topic}:`, eventData);

    await NotificationService.createNotification(eventData, topic);
  },
});

console.log("Notifications service is listening for events...");