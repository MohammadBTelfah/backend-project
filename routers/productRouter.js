const express = require('express');
const router = express.Router();
const adminMiddleware = require('../MiddleWare/AdminMiddleWare');
const { getAllProducts, addProduct, updateProduct, deleteProduct,updateProductByName,getProductById  } = require('../controllers/prductControllers');

router.get('/products',  getAllProducts);
router.post('/addproduct', adminMiddleware,  addProduct);
router.put('/updateproduct/:id', adminMiddleware,  updateProduct);
router.delete('/deleteproduct/:id',  adminMiddleware, deleteProduct);
router.put('/updateproductbyname/:Name', adminMiddleware,  updateProductByName);
router.get('/getproductbyid/:id', adminMiddleware, getProductById);
module.exports = router;