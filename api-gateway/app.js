const express = require('express');
const expressProxy = require('express-http-proxy');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'], 
  credentials: true
}));
app.use(helmet()); // Security headers
app.use(morgan('combined')); // Request logging
app.use(express.json()); // For parsing application/json

// Service configurations
const SERVICES = {
  user: 'http://localhost:5001',
  admin: 'http://localhost:5002',
  products: 'http://localhost:5003',
  order: 'http://localhost:5004',
  payment: 'http://localhost:5005'
};

// Proxy options
const proxyOptions = {
  timeout: 5000, // 5 seconds timeout
  proxyReqPathResolver: (req) => {
    return req.originalUrl; // Forward the complete URL
  },
  proxyErrorHandler: (err, res, next) => {
    console.error('Proxy Error:', err);
    switch (err && err.code) {
      case 'ECONNREFUSED':
        return res.status(503).json({ error: 'Service unavailable' });
      case 'ETIMEDOUT':
        return res.status(504).json({ error: 'Gateway timeout' });
      default:
        return res.status(500).json({ error: 'Internal server error' });
    }
  }
};

// Proxy middleware for each service
app.use('/user', expressProxy(SERVICES.user, {
  ...proxyOptions,
  proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
    // You can modify headers here if needed
    if (srcReq.headers['authorization']) {
      proxyReqOpts.headers['Authorization'] = srcReq.headers['authorization'];
    }
    return proxyReqOpts;
  }
}));

app.use('/admin', expressProxy(SERVICES.admin, {
  ...proxyOptions,
  proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
    if (srcReq.headers['authorization']) {
      proxyReqOpts.headers['Authorization'] = srcReq.headers['authorization'];
    }
    return proxyReqOpts;
  }
}));

app.use('/products', expressProxy(SERVICES.products, proxyOptions));
app.use('/order', expressProxy(SERVICES.order, proxyOptions));
app.use('/payment', expressProxy(SERVICES.payment, proxyOptions));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'API Gateway is healthy' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;