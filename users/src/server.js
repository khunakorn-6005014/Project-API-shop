import app from './app.js';
import config from 'config';
import {shutdownConsumer, startConsumer} from './mq/consumer.js'
await startConsumer();
const port = config.get('server.port') || 3004;
app.listen(port, () => {
  console.log(`User Service listening on port ${port}`);
});
 const shutdown = async () => {
    console.log("🛑 Shutting down...");
    // await shutdownProducer();
    await shutdownConsumer();
    server.close(() => process.exit(0));
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
