// APIproject/payment/mq/consumer.js
import { Kafka } from 'kafkajs';
import dotenv from 'dotenv';
import PaymentService from '../services/paymentService.js';
import OrderInfo from '../models/orderInfo.js'
import { v4 as uuidv4 } from "uuid";
dotenv.config();

const kafka = new Kafka({
  clientId: "payment-service",
  brokers: [process.env.KAFKA_BROKER || 'kafka:9092'], // ✅ Use Kafka container name in Docker
});//- want it to use "kafka:9092" because Docker networking resolves the container named kafka

const consumer = kafka.consumer({ groupId: 'payment-group' });

export async function initConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'shipment.returned', fromBeginning: false });
  await consumer.subscribe({ topic: 'CartCheckout' });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const event = JSON.parse(message.value.toString());
      console.log('Payment ← got shipment.returned', event);
      if (topic === 'shipment.returned'){
      try {
        await PaymentService.refundPayment(event);
        console.log('Refund processed for order', event.orderId);
      } catch (err) {
        console.error('Refund failed for order', event.orderId, err);
      };}
      if (topic === 'CartCheckout'){
             await OrderInfo.create({
               orderId:     uuidv4(),
               userId:      payload.userId,
               products:    payload.products,
               totalAmount: payload.totalAmount,
               status:      payload.status,

             });
      }

    },
  });
}

export async function shutdownConsumer() {
  await consumer.disconnect();
  console.log('Payment consumer disconnected');
}
