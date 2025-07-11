const express = require('express');
const expressProxy = require('express-http-proxy');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json()); // Only used for JSON-based routes
app.use(cookieParser());
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Service configurations
const SERVICES = {
  user: 'http://localhost:5001',
  admin: 'http://localhost:5002',
  products: 'http://localhost:5003',
  order: 'http://localhost:5004',
  payment: 'http://localhost:5005'
};

// Base proxy options
const proxyOptions = {
  timeout: 5000,
  proxyReqPathResolver: (req) => req.originalUrl,
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

// Enhanced user service proxy
app.use('/user', expressProxy(SERVICES.user, {
  ...proxyOptions,
  proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
    proxyReqOpts.headers = { ...srcReq.headers };
    if (srcReq.cookies?.token) {
      proxyReqOpts.headers['Authorization'] = `Bearer ${srcReq.cookies.token}`;
    }
    return proxyReqOpts;
  }
}));

console.log("Inside API Gateway");

// Admin, Order, and Payment services (standard proxy)
app.use('/admin', expressProxy(SERVICES.admin, proxyOptions));
app.use('/order', expressProxy(SERVICES.order, proxyOptions));
app.use('/payment', expressProxy(SERVICES.payment, proxyOptions));

// ✅ Products service (multipart/form-data compatible)
app.use('/products', expressProxy(SERVICES.products, {
  ...proxyOptions,
  proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
    proxyReqOpts.headers = { ...srcReq.headers };
    delete proxyReqOpts.headers['content-length']; // let proxy handle form boundary
    return proxyReqOpts;
  },
  parseReqBody: false // ✅ CRUCIAL: let proxy stream FormData without parsing
}));
// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'API Gateway is healthy' });
});

// Catch-all for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
