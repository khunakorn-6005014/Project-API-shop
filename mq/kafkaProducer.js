// APIproject/mq/kafkaProducer.js
import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "payment-service",
  brokers: ["localhost:9092"], // Adjust with your Kafka broker(s) addresses
});

const producer = kafka.producer();

export const connectProducer = async () => {
  await producer.connect();
  console.log("Kafka Producer connected");
};

export const publishEvent = async (topic, message) => {
  await producer.send({
    topic,
    messages: [
      {
        // using orderId as a key could be useful for partitioning if needed
        key: message.orderId,
        value: JSON.stringify(message),
      },
    ],
  });
  console.log(`Message published to topic ${topic}:`, message);
};

export default producer;