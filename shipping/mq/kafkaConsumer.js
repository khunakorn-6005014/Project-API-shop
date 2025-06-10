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

await consumer.connect();
await consumer.subscribe({ topic: "payment.completed", fromBeginning: true });

consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    const paymentData = JSON.parse(message.value.toString());
    console.log("Received Payment Event in Shipping:", paymentData);

    await ShippingService.createShipment({
      orderId: paymentData.orderId,
      userId: paymentData.userId,
    });
  },
});
console.log("Shipping service is listening for payment events...");
