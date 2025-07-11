// APIproject/api-gateway/src/middlewares/jwtValidation.js
import { expressjwt } from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import  config from 'config';

const jwtValidation = expressjwt({
  // Dynamically provide a signing key based on the kid in the header and the keys provided by the JWKS endpoint
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: config.get('auth.jwksUri')
  }),
  algorithms: config.get('auth.algorithms'),
  credentialsRequired: true,
  requestProperty: 'user'
});

export default jwtValidation;