const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const protectAdmin = require('../middleware/auth.middleware');

// Admin protected routes
router.post('/', protectAdmin, productController.addProduct);
router.delete('/:id', protectAdmin, productController.removeProduct);

// Public routes
router.get('/', productController.listProducts);


router.get('/:id', productController.getProductById);


module.exports = router;