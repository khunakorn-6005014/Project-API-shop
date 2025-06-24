// APIproject/api-gateway/src/server.js
import app from './app.js';
import https from 'https';
import config from 'config';
import fs from 'fs'; 

if (config.get('server.useHttps')) {
  const tlsOptions = {
    key: fs.readFileSync(config.get('server.tls.keyPath')),
    cert: fs.readFileSync(config.get('server.tls.certPath'))
  };

  https.createServer(tlsOptions, app).listen(port, () => {
    console.log(`API Gateway is listening securely on port ${port}`);
  });
} else {
  app.listen(port, () => {
    console.log(`API Gateway is listening on port ${port}`);
  });
}
