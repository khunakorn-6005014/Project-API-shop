// APIproject/shipping/mq/kafkaConsumer.js
import { Kafka } from "kafkajs";
import dotenv from 'dotenv';
import orderData from '../models/orderData.js';
dotenv.config();

//- Used in Shipping Service
// Will run as an independent service inside Kubernetes
const kafka = new Kafka({
  clientId: "shipping-service",
  brokers: [process.env.KAFKA_BROKER || 'kafka:9092'], // Adjust broker addresses accordingly
});

const consumer = kafka.consumer({ groupId: "shipping-group" });
export async function initConsumer() {

  await consumer.connect();
  await consumer.subscribe({ topic: 'payment.completed', fromBeginning: false });
  console.log('Shipping consumer subscribed to payment.completed');
  await consumer.subscribe({ topic: 'orderCreated' });
await consumer.run({
    eachMessage: async ({ message }) => {
      const event = JSON.parse(message.value.toString());
       if (topic === 'shipment.returned'){
      try {console.log('Shipping ← got payment.completed', event);
        } catch (err) {
          console.error('Shipment creation failed for order', event.orderId, err);
       };
      }
      if (topic === 'orderCreated'){
          await orderData.create ({
               orderId:     event.orderId,
               userId:      event.userId,
               products:    event.products,
               totalAmount: event.totalAmount,
               status:      event.status,
             }); 
      }
    },
  });
}     
                         
export async function shutdownConsumer() {
  await consumer.disconnect();
  console.log('Shipping consumer disconnected');
}
