const express = require('express');
const router = express.Router();
const adminMiddleware = require('../MiddleWare/AdminMiddleWare');
const rolemiddleware = require('../MiddleWare/RoleMiddleWare');
const { getAllProducts, addProduct, updateProduct, deleteProduct,updateProductByName,getProductById  } = require('../controllers/productControllers');

router.get('/products', rolemiddleware,   getAllProducts);
router.post('/addproduct', rolemiddleware,  addProduct);
router.put('/updateproduct/:id', rolemiddleware,  updateProduct);
router.delete('/deleteproduct/:id',  rolemiddleware, deleteProduct);
router.put('/updateproductbyname/:Name', rolemiddleware,  updateProductByName);
router.get('/getproductbyid/:id', rolemiddleware, getProductById);
module.exports = router;