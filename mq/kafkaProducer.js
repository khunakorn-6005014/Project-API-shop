// APIproject/mq/kafkaProducer.js
import { Kafka } from "kafkajs";
// - Used in Payment Service
// - Will connect automatically inside Payment microservice container

const kafka = new Kafka({
  clientId: "payment-service",
  brokers: ["localhost:9092"], // Using Docker/Kubernetes service name
});

const producer = kafka.producer();
await producer.connect(); // Connect when the container starts
export const publishEvent = async (topic, message) => {
  try {
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
  } catch (error) {
    console.error(`Failed to publish message to topic ${topic}:`, error);
    throw error;
  }
};
export default publishEvent