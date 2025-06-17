// APIproject/notifications/mq/kafkaConsumer.js
import { Kafka } from "kafkajs";
import Notification from "../models/notification.js";
import dotenv from 'dotenv';
import client from 'prom-client';
dotenv.config();

const kafka = new Kafka({
  clientId: "notifications-service",
  brokers: [process.env.KAFKA_BROKER || 'kafka:9092'], // Docker/Kubernetes setup
});
const consumer = kafka.consumer({ groupId: "notifications-group" });

// Define the counter for processed messages
const processedMessagesCounter = new client.Counter({
  name: 'processed_messages_total',
  help: 'Total number of processed messages',
});


/**
 * Build the payload for a Notification document based on Kafka topic and event data.
 */
function buildPayload(topic, evt) {
  switch (topic) {
    case "payment.completed":
      return {
        title: "Payment Successful",
        message: `Your payment of $${evt.amount} for order ${evt.orderId} was processed.`,
        type: "payment",
        userId: evt.userId
      };
    case "shipment.delivered":
      return {
        title: "Shipment Delivered",
        message: `Your order ${evt.orderId} has been delivered!`,
        type: "shipping",
        userId: evt.userId
      };
    case "refund.processed":
      return {
        title: "Refund Issued",
        message: `A refund of $${evt.refundAmount} for order ${evt.orderId} was processed.`,
        type: "refund",
        userId: evt.userId
      };
    default:
      return {
        title: `Event ${topic}`,
        message: JSON.stringify(evt),
        type: "payment", // default 
        userId: evt.userId
      };
  }
}

export async function initConsumer() {
  await consumer.connect();
  // Subscribe to key topics
  await consumer.subscribe({ topic: "payment.completed", fromBeginning: true });
  await consumer.subscribe({ topic: "shipment.delivered", fromBeginning: true });
  await consumer.subscribe({ topic: "refund.processed", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      // Parse the incoming message
      const event = JSON.parse(message.value.toString());
      console.log(`Received ${topic} event in Notifications Service:`, event);
      // Process the message as needed...
      // Once processing is successful, increment the counter:
      processedMessagesCounter.inc();

      // Build the payload using 'event' (not "evt", which was undefined)
      const payload = buildPayload(topic, event);
      if (!payload.userId) {
        return console.warn("Skipping saving notification: missing userId");
      }
      // Create a notification document in MongoDB
      try {
        await Notification.create(payload);
      } catch (error) {
        console.error("Error saving notification to MongoDB:", error);
      }
    }
  });
}

export async function shutdownConsumer() {
  await consumer.disconnect();
  console.log('Notification consumer disconnected');
}