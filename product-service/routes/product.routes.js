const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const upload = require('../middleware/upload.middleware');
const authMiddleware = require('../middleware/auth.middleware');

router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "model", maxCount: 1 }
  ]),
  productController.addProduct
);
router.delete('/:id',productController.deleteProduct);

// Public routes
router.get('/',productController.listProducts);


router.get('/:id', productController.getProductById);


module.exports = router;