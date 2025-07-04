import app from './app.js';
import config from 'config';
import {shutdownConsumer,startConsumer} from './mq/consumer.js';
import {connectProducer,shutdownProducer} from './mq/producer.js'

await connectProducer();
await startConsumer();


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
