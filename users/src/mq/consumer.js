// src/mq/consumer.js
import { Kafka } from 'kafkajs';
import User from '../models/user.model.js';
import dotenv from 'dotenv';
dotenv.config();

const kafka = new Kafka({
  clientId: "user-service",
  brokers: [process.env.KAFKA_BROKER || 'kafka:9092'], // Adjust broker addresses accordingly
});
const consumer = kafka.consumer({ groupId: 'user-service' });

export async function startConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'ProductCreated' });
  await consumer.subscribe({ topic: 'ProductRemoved' });
   console.log('User consumer subscribed to product.create or removed');
  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const payload = JSON.parse(message.value.toString());
      const { productId, timestamp } = payload;
     console.log('payload:',payload)
      if (!payload.user) {
         return res.status(404).json({ error: 'User not found.' });
         }
      if (topic === 'ProductCreated') {
        await User.updateOne(
          { userId: payload.userId || null }, // if userId is in payload
          { $push: { myProducts: productId } }
        );
      }
      if (topic === 'ProductRemoved') {
        await User.updateOne(
          { myProducts: productId },
          { $pull: { myProducts: productId } }
        );
      }
    }
  });
}

export async function shutdownConsumer() {
  await consumer.disconnect();
  console.log('Shipping consumer disconnected');
}