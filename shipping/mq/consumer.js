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
export async function initConsumer() {

  await consumer.connect();
  await consumer.subscribe({ topic: 'payment.completed', fromBeginning: false });
  console.log('Shipping consumer subscribed to payment.completed');

await consumer.run({
    eachMessage: async ({ message }) => {
      const event = JSON.parse(message.value.toString());
      console.log('Shipping ← got payment.completed', event);
      // try {
      //   await ShippingService.createShipment({ orderId: event.orderId, userId: event.userId });
      //   console.log('Shipment created for order', event.orderId);
      // } catch (err) {
      //   console.error('Shipment creation failed for order', event.orderId, err);
      // }
    },
  });
}

export async function shutdownConsumer() {
  await consumer.disconnect();
  console.log('Shipping consumer disconnected');
}
