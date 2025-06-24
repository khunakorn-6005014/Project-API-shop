// APIproject/api-gateway/src/middlewares/rateLimit.js
import rateLimit from 'express-rate-limit';
import config from 'config';

const rateLimiter = rateLimit({
  windowMs: config.get('rateLimit.windowMs'), // e.g., 15 minutes
  max: config.get('rateLimit.maxRequests'),   // e.g., 100 requests per window per IP
  message: {
    error: 'Too many requests. Please try again later.'
  }
});

export default rateLimiter;