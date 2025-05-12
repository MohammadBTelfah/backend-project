const express = require('express');
const router = express.Router();
const adminMiddleware = require('../MiddleWare/AdminMiddleWare');
const { getAllProducts, addProduct, updateProduct, deleteProduct,updateProductByName  } = require('../controllers/prductControllers');

router.get('/products',  getAllProducts);
router.post('/addproduct',  addProduct);
router.put('/updateproduct/:id',   updateProduct);
router.delete('/deleteproduct/:id',   deleteProduct);
router.put('/updateproductbyname/:Name',   updateProductByName);
module.exports = router;