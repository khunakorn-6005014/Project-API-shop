import { Kafka } from "kafkajs";
import dotenv from 'dotenv';
import Product from '../models/product.js'

dotenv.config();
const kafka = new Kafka({
  clientId: "product-service",
  brokers: [process.env.KAFKA_BROKER || 'kafka:9092'], // Adjust broker addresses accordingly
});
const consumer = kafka.consumer({ groupId: "product-group" });

export async function initConsumer() {

  await consumer.connect();
  await consumer.subscribe({ topic: 'decrement.product', fromBeginning: false });
    await consumer.subscribe({ topic: 'increment.product', fromBeginning: false });
await consumer.run({
    eachMessage: async ({ message }) => {
      const event = JSON.parse(message.value.toString());
       if (topic === 'increment.product'){
        await Product.findOneAndUpdate(
          { productId: event.productId },
          { $inc: { amount: event.quantity } },
           { new: true }
    );
      }
      if (topic === 'decrement.product'){
        await Product.findOneAndUpdate(
          { productId: event.productId },
          { $inc: { amount: -event.quantity } },
           { new: true }
    ); 
      }
    },
  });
}     
                         
export async function shutdownConsumer() {
  await consumer.disconnect();
  console.log('Shipping consumer disconnected');
}
