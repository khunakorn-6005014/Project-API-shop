import app from './app.js';
import config from 'config';
import {shutdownConsumer,initConsumer} from './mq/consumer.js';
import {connectProducer,shutdownProducer} from './mq/producer.js'
async function start() {


 try {
    await connectProducer();
    console.log('Kafka producer connected.');
    await initConsumer();
    console.log('Kafka consumer initialized.');
  } catch (err) {
    console.error('Kafka connection error:', err);
    process.exit(1);
  }

const port = config.get('server.port') || 3007;
app.listen(port, () => {
  console.log(`order Service listening on port ${port}`);
});
 const shutdown = async () => {
    console.log("🛑 Shutting down...");
    await shutdownProducer();
    await shutdownConsumer();
    server.close(() => process.exit(0));
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}
start().catch(err => {
  console.error('Fatal startup error', err);
  process.exit(1);
});