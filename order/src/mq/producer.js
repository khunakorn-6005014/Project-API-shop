import { Kafka } from 'kafkajs';
import dotenv from 'dotenv';
dotenv.config();
const kafka = new Kafka({
  clientId: "order-service",
  brokers: [process.env.KAFKA_BROKER || 'kafka:9092'], // Adjust broker addresses accordingly
});
const producer = kafka.producer();
export async function connectProducer() {
    try {
    await producer.connect();// Connect when the container starts
    console.log("Kafka producer connected.");
  } catch (error) {
    console.error("Error connecting Kafka producer:", error);
    // Add retry logic if necessary
  }
}
//connectProducer().catch(console.error);

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
  console.log('product producer disconnected');
}

export default publishEvent