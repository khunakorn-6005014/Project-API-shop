// APIproject/payment/mq/kafkaProducer.js
import { Kafka } from "kafkajs";
import dotenv from 'dotenv';
dotenv.config();

// - Used in Payment Service
// - Will connect automatically inside Payment microservice container

const kafka = new Kafka({
  clientId: "payment-service",
  brokers: [process.env.KAFKA_BROKER || 'kafka:9092'], // ✅ Use Kafka container name in Docker
});//- want it to use "kafka:9092" because Docker networking resolves the container named kafka

const producer = kafka.producer();
export async function initProducer() {
  try {
    await producer.connect();// Connect when the container starts
    console.log("Kafka producer connected.");
  } catch (error) {
    console.error("Error connecting Kafka producer:", error);
    // Add retry logic if necessary
  }
}
export const publishEvent = async (topic, payload) => {
  try {
    await producer.send({
      topic,
      messages: [
        {
          // using orderId as a key could be useful for partitioning if needed
          key: payload.orderId,
        value: JSON.stringify(payload),
        },
      ],
    });
    console.log(`Published event to ${topic}`, payload);
  } catch (error) {
    console.error(`Failed to publish message to topic ${topic}:`, error);
    throw error;
  }
};
export async function shutdownProducer() {
  await producer.disconnect();
  console.log('Payment producer disconnected');
}

export default publishEvent