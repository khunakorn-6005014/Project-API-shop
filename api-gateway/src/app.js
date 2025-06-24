// APIproject/api-gateway/src/app.js
import express from 'express';
import helmet from 'helmet';
import jwtValidation from './middlewares/jwt-validation.js';
import rateLimiter from './middlewares/rateLimit.js';
import proxyRoutes from './routes/proxy.routes.js';

const app = express();

// Security headers
app.use(helmet());
// Parse JSON requests
app.use(express.json());

// Apply global rate limiting for all incoming requests
app.use(rateLimiter);

// Validate JWT for all requests (using our JWKS-based middleware)
app.use(jwtValidation);

// Enrich headers with user data from req.user
app.use((req, res, next) => {
  if (req.user) {
    req.headers['X-User-Id'] = req.user.sub;
    req.headers['X-User-Roles'] = Array.isArray(req.user.roles)
      ? req.user.roles.join(',')
      : req.user.roles || '';
  }
  next();
});

// Attach proxy routes for downstream services
app.use('/', proxyRoutes);

export default app;
