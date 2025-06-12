// APIproject/payment/mq/consumer.js
import { Kafka } from 'kafkajs';
import dotenv from 'dotenv';
import PaymentService from '../services/paymentService.js';
dotenv.config();

const kafka = new Kafka({
  clientId: "payment-service",
  brokers: [process.env.KAFKA_BROKER || 'kafka:9092'], // ✅ Use Kafka container name in Docker
});//- want it to use "kafka:9092" because Docker networking resolves the container named kafka

const consumer = kafka.consumer({ groupId: 'payment-group' });

export async function initConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'shipment.returned', fromBeginning: false });
  console.log('Payment consumer subscribed to shipment.returned');

  await consumer.run({
    eachMessage: async ({ message }) => {
      const event = JSON.parse(message.value.toString());
      console.log('Payment ← got shipment.returned', event);
      try {
        await PaymentService.refundPayment(event);
        console.log('Refund processed for order', event.orderId);
      } catch (err) {
        console.error('Refund failed for order', event.orderId, err);
      }
    },
  });
}

export async function shutdownConsumer() {
  await consumer.disconnect();
  console.log('Payment consumer disconnected');
}
