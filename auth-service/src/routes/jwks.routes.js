// auth-service/src/routes/jwks.routes.js
import express from 'express';
import { publicKey, keyId } from '../../config/jwt.config.js';
import { pem2jwk } from 'pem-jwk';

const router = express.Router();

router.get('/.well-known/jwks.json', (req, res) => {
  const jwk = pem2jwk(publicKey);
  jwk.kid = keyId;
  jwk.use = 'sig';
  jwk.alg = 'RS256';
  res.json({ keys: [jwk] });
});

export default router;