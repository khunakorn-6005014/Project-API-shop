import app from './app.js';
import config from 'config';
const port = config.get('server.port') || 3006;
app.listen(port, () => {
  console.log(`User Service listening on port ${port}`);
});