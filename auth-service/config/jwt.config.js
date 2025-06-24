// apiproject/auth-service/config/jwt.config.js
import fs from 'fs';
import path from 'path';

export const privateKey = fs.readFileSync(
  path.resolve('config/tls/jwt-private.pem'),
  'utf8'
);
export const publicKey = fs.readFileSync(
  path.resolve('config/tls/jwt-public.pem'),
  'utf8'
);

export const keyId    = 'auth-key-1';       // kid header in JWT
export const algorithm = 'RS256';           // signing algorithm
export const expiresIn = '1h';              // token TTL
export const issuer    = 'https://auth.local'; // your Auth Service URL
export const audience  = 'https://api.local';  // intended audience (API Gateway)