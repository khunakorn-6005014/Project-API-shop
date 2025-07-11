// auth-service/src/server.js
import app from './app.js';
import config from 'config';

const port = config.get('server.port') || 3000;
app.listen(port, () => {
  console.log(`Auth Service running on port ${port}`);
});