// src/mq/consumer.js
import { Kafka } from 'kafkajs';
import ProductInfo from '../models/productInfo.js';
import dotenv from 'dotenv';
dotenv.config();
const kafka = new Kafka({
  clientId: "cart-service",
  brokers: [process.env.KAFKA_BROKER || 'kafka:9092'], // Adjust broker addresses accordingly
});
const consumer = kafka.consumer({ groupId: 'cart-service' });

export async function startConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'ProductCreated' });
  await consumer.subscribe({ topic: 'ProductUpdated' });
  await consumer.subscribe({ topic: 'ProductRemoved' });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const data = JSON.parse(message.value.toString());

      if (topic === 'ProductCreated' || topic === 'ProductUpdated') {
        await ProductInfo.findOneAndUpdate(
          { productId: data.productId },
          {
            productId: data.productId,
            name:      data.name,
            price:     data.price,
            stock:     data.amount
          },
          { upsert: true }
        );
      }

      if (topic === 'ProductRemoved') {
        await ProductInfo.deleteOne({ productId: data.productId });
      }
    }
  });
}

export async function shutdownConsumer() {
  await consumer.disconnect();
  console.log('Shipping consumer disconnected');
}