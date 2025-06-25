// APIproject/api-gateway/src/routes/proxy.routes.js
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import CircuitBreaker from 'opossum';
const router = express.Router();

// Define the shipping proxy middleware
const proxyShipping = createProxyMiddleware({
  target: 'http://shipping-service:3002',
  changeOrigin: true,
  pathRewrite: { '^/shipping': '' }
});

const breakerOptions = {// Circuit breaker options
  timeout: 3000,
  errorThresholdPercentage: 50,
  resetTimeout: 5000
};
// Wrap the proxy logic in a circuit breaker that accepts req and res.
const shippingBreaker = new CircuitBreaker((req, res) => {
  return new Promise((resolve, reject) => {// Pass the proper arguments here.
    proxyShipping(req, res, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}, breakerOptions);

// Set a fallback when the shipping service is unavailable.
shippingBreaker.fallback(() => {
  return { error: 'Shipping service is temporarily unavailable. Please try again later.' };
});

// Use the circuit breaker for /shipping routes, passing req and res.
router.use('/shipping', (req, res, next) => {
  shippingBreaker
    .fire(req, res)
    .then(() => next())
    .catch((fallbackResponse) => res.status(503).json(fallbackResponse));
});

// Proxy /payment without circuit breaker for simplicity, as an example.
router.use('/payment', createProxyMiddleware({
  target: 'http://payment-service:3001',
  changeOrigin: true,
  pathRewrite: { '^/payment': '' }
}));
//import config from 'config';
// const userServiceUrl = config.get('proxy.userService'); 
// // e.g. "http://user-service:3004"

// router.use('/user', createProxyMiddleware({
//   target: userServiceUrl,
//   changeOrigin: true,
//   pathRewrite: { '^/user': '' }
// }));

router.use('/user', createProxyMiddleware({
  target: 'http://user-service:3004',
  changeOrigin: true,
  onProxyReq: (proxyReq, req, res) => {// Re-attach JSON body if available:
    console.log("Proxy onProxyReq, req.user:", req.user);
    if (['POST','PUT','PATCH','DELETE'].includes(req.method) && req.body) {
      const body = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(body));
      proxyReq.write(body);
      proxyReq.end();
    }
    if (req.user) { // Forward the injected user headers using fallback for userId
      // Use req.user.sub if it exists, otherwise fallback to req.user.userId
      // const userId = req.user.sub || req.user.userId;
      const userId = req.user.userId;
      proxyReq.setHeader('X-User-Id', userId);
      const roles = Array.isArray(req.user.roles)
        ? req.user.roles.join(',')
        : req.user.roles || '';
      proxyReq.setHeader('X-User-Roles', roles);
    }
  }
}));
export default router;

