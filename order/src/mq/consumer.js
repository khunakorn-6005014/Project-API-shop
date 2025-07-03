import { Kafka } from 'kafkajs';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from "uuid";
import Order from '../models/order.js'
import { publishEvent } from './producer.js';
dotenv.config();

const kafka = new Kafka({
  clientId: "order-service",
  brokers: [process.env.KAFKA_BROKER || 'kafka:9092'], // Adjust broker addresses accordingly
});

const consumer = kafka.consumer({ groupId: "order-group" });
export async function initConsumer() {
await consumer.connect();
await consumer.subscribe({ topic: 'CartCheckout' });
await consumer.subscribe({ topic: 'payment.completed' });
await consumer.run({
  eachMessage: async ({ topic, message }) => {
    const payload = JSON.parse(message.value.toString());

    if (topic === 'CartCheckout') {
      // 1) create new Order in “pending” state
      const NewOrder = await Order.create({
        orderId:     uuidv4(),
        userId:      payload.userId,
        products:    payload.products,
        totalAmount: payload.totalAmount,
        status:      payload.status,

        // createdAt: new Date(payload.timestamp)
      });
      console.log(`Order ${NewOrder.orderId} created for user ${NewOrder.userId}`);
       await publishEvent(orderCreated,{
           orderId: NewOrder.orderId,
           userId: NewOrder.userId,
           products: NewOrder.products,
           totalAmount: NewOrder.totalAmount,
           status: NewOrder.status,
           timestamp: new Date(),
       });
    }

    if (topic === 'payment.completed') {
      // 2) update that Order to “paid”
      await Order.findOneAndUpdate(
        { orderId: payload.orderId },
        { status: 'paid'
            // ,  paidAt: new Date(payload.timestamp) 
        }
      );
    }
  }
});
}


export async function shutdownConsumer() {
  await consumer.disconnect();
  console.log('Shipping consumer disconnected');
}