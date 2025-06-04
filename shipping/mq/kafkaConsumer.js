// APIproject/shipping/mq/kafkaConsumer.js
import { Kafka } from "kafkajs";
import ShippingService from "../services/shippingService.js";

const kafka = new Kafka({
  clientId: "shipping-service",
  brokers: ["localhost:9092"], // Adjust broker addresses accordingly
});

const consumer = kafka.consumer({ groupId: "shipping-group" });

const connectConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "payment.completed", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const paymentData = JSON.parse(message.value.toString());
      console.log("Received Payment Event in Shipping:", paymentData);

      // Create a shipment based on the payment event details
      await ShippingService.createShipment({
        orderId: paymentData.orderId,
        userId: paymentData.userId,
      });
    },
  });

  console.log("Shipping service is listening for payment events...");
};

export default connectConsumer;