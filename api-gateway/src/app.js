// APIproject/api-gateway/src/app.js
import express from 'express';
import helmet from 'helmet';
import jwtValidation from './middlewares/jwtValidation.js';
import rateLimiter from './middlewares/rateLimit.js';
import proxyRoutes from './routes/proxy.routes.js';

const app = express();

app.use(helmet());// Security headers
app.use(express.json());// Parse JSON requests
app.get('/', (req, res) => {
  res.json({ status: 'API Gateway up', timestamp: Date.now() });
});

app.use(rateLimiter);// Apply global rate limiting for all incoming requests
app.use(jwtValidation);// Validate JWT for all requests (using our JWKS-based middleware)
 
app.use((req, res, next) => {
  console.log("Decoded JWT:", req.user);
  if (req.user) {
    req.headers['X-User-Id'] = req.user.userId;
    req.headers['X-User-Roles'] = Array.isArray(req.user.roles)
      ? req.user.roles.join(',')
      : req.user.roles || '';
  }next();});
// Enrich headers with user data from req.user
app.use('/', proxyRoutes);// Attach proxy routes for downstream services

export default app;
