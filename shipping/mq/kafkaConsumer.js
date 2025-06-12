// APIproject/shipping/mq/kafkaConsumer.js
import { Kafka } from "kafkajs";
import ShippingService from "../services/shippingService.js";
import dotenv from 'dotenv';
dotenv.config();

//- Used in Shipping Service
// Will run as an independent service inside Kubernetes
const kafka = new Kafka({
  clientId: "shipping-service",
  brokers: [process.env.KAFKA_BROKER || 'kafka:9092'], // Adjust broker addresses accordingly
});

const consumer = kafka.consumer({ groupId: "shipping-group" });
export async function runConsumer() {
  await consumer.connect();
  await consumer.subscribe({
    topic: process.env.PAYMENT_COMPLETED_TOPIC,
    fromBeginning: false,
  });

 await consumer.run({
  eachMessage: async ({ message }) => {
    const evt = JSON.parse(message.value.toString());
      console.log('← Got payment.completed', evt);
    await ShippingService.createShipment({
      orderId: evt.orderId,
      userId: evt.userId,
    });
  },
});
console.log("Shipping consumer running ,is listening for payment events...");
}
export async function shutdownConsumer() {
  await consumer.disconnect();
}
