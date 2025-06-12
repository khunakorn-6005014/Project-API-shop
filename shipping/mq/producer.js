// APIproject/payment/mq/producer.js
import { Kafka } from 'kafkajs';
import dotenv from 'dotenv';
dotenv.config();

const kafka = new Kafka({
  clientId: "payment-service",
  brokers: [process.env.KAFKA_BROKER || 'kafka:9092'], // ✅ Use Kafka container name in Docker
});//- want it to use "kafka:9092" because Docker networking resolves the container named kafka

const producer = kafka.producer();

export async function initProducer() {
  await producer.connect();
  console.log('Shipping producer connected to Kafka');
}

export async function publishShippingEvent(topic, payload) {
  await producer.send({
    topic,
    messages: [{ key: payload.orderId, value: JSON.stringify(payload) }],
  });
  console.log(`Shipping → published ${topic}`, payload);
}

export async function shutdownProducer() {
  await producer.disconnect();
  console.log('Shipping producer disconnected');
}

