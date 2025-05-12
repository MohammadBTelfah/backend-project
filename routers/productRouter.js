const express = require('express');
const router = express.Router();
const { getAllProducts, addProduct, updateProduct, deleteProduct } = require('../controllers/prductControllers');
const authMiddleware = require('../authmiddleware/authMiddleware');

router.get('/products', authMiddleware(['Admin', 'User']), getAllProducts);
router.post('/addproduct', authMiddleware(['Admin']), addProduct);
router.put('/updateproduct/:id', authMiddleware(['Admin']), updateProduct);
router.delete('/deleteproduct/:id', authMiddleware(['Admin']), deleteProduct);
module.exports = router;