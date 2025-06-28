// APIproject/api-gateway/src/routes/proxy.routes.js
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import CircuitBreaker from 'opossum';
const router = express.Router();

// Define the shipping proxy middleware
const proxyShipping = createProxyMiddleware({
  target: 'http://shipping-service:3002',
  changeOrigin: true,
  // pathRewrite: { '^/shipping': '' },
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
});

const breakerOptions = {// Circuit breaker options
  timeout: 3000,
  errorThresholdPercentage: 50,
  resetTimeout: 5000
};
// Wrap the proxy logic in a circuit breaker that accepts req and res.
const shippingBreaker = new CircuitBreaker(
  // this function must return a Promise
  (req, res) => new Promise((resolve, reject) => {
    proxyShipping(req, res, (err) => {
      if (err) reject(err);
      else     resolve();
    });
  }),
  breakerOptions
);


// Set a fallback when the shipping service is unavailable.
shippingBreaker.fallback(() => {
  return { error: 'Shipping service is temporarily unavailable. Please try again later.' };
});

// Use the circuit breaker for /shipping routes, passing req and res.
router.use('/shipping', (req, res, next) => {
  shippingBreaker
    .fire(req, res)
    .then(() => next())           // success → continue to any downstream handlers (if any)
    .catch(fallback => {
      // circuit open or service error → 503
      res.status(503).json(fallback);
    });
});


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
router.use('/product',createProxyMiddleware({
  target: 'http://product-service:3005',
  changeOrigin: true,
    // pathRewrite: { '^/product': '' },
  onProxyReq: (proxyReq, req, res) => {
      if (req.user) {// Forward user headers
        const userId = req.user.userId;
        proxyReq.setHeader('X-User-Id', userId);
        const roles = Array.isArray(req.user.roles)
          ? req.user.roles.join(',')
          : req.user.roles || '';
        proxyReq.setHeader('X-User-Roles', roles);
      }
      if (// If  consumed the body in the gateway
        ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method) &&
        req.body
      ) {
        const body = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(body));
        proxyReq.write(body);
        proxyReq.end();   // 
      }
    }
}));
router.use('/cart',createProxyMiddleware({
  target: 'http://cart-service:3006',
  changeOrigin: true,
  onProxyReq: (proxyReq, req, res) => {
      if (req.user) {// Forward user headers
        const userId =req.user.userId;
        proxyReq.setHeader('X-User-Id', userId);
        const roles = Array.isArray(req.user.roles)
          ? req.user.roles.join(',')
          : req.user.roles || '';
        proxyReq.setHeader('X-User-Roles', roles);
      }
      if (// If consumed the body in the gateway
        ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method) &&
        req.body
      ) {
        const body = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(body));
        proxyReq.write(body);
        proxyReq.end();   // 
      }
    }
}));
// Proxy /payment without circuit breaker for simplicity.
router.use('/payment', createProxyMiddleware({
  target: 'http://payment-service:3001',
  changeOrigin: true,
    // pathRewrite: { '^/payment': '' },
  onProxyReq: (proxyReq, req, res) => {
      if (req.user) {// Forward user headers
        const userId = req.user.userId;
        proxyReq.setHeader('X-User-Id', userId);
        const roles = Array.isArray(req.user.roles)
          ? req.user.roles.join(',')
          : req.user.roles || '';
        proxyReq.setHeader('X-User-Roles', roles);
      }
      if (// If consumed the body in the gateway
        ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method) &&
        req.body
      ) {
        const body = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(body));
        proxyReq.write(body);
        proxyReq.end();   // 
      }
    }
}));
router.use('notification/',createProxyMiddleware({
  target: 'http://notifications-service:3003',
  changeOrigin: true,
    // pathRewrite: { '^/notifications': '' },
  onProxyReq: (proxyReq, req, res) => {
      if (req.user) {// Forward user headers
        const userId = req.user.userId;
        proxyReq.setHeader('X-User-Id', userId);
        const roles = Array.isArray(req.user.roles)
          ? req.user.roles.join(',')
          : req.user.roles || '';
        proxyReq.setHeader('X-User-Roles', roles);
      }
      if (// If  consumed the body in the gateway
        ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method) &&
        req.body
      ) {
        const body = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(body));
        proxyReq.write(body);
        proxyReq.end();   // 
      }
    }
}));
export default router;

