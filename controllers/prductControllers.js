const product = require('../models/product');

exports.getAllProducts = async (req, res) => {
    try {
        const products = await product.find();
        res.status(200).json(products);
        
    } catch (error) {
        res.status(500).json({ Message: error.Message });
        
    }
}
exports.addProduct = async (req, res) => {
    const { Name, Description, Price, Image } = req.body;
    try {
        const newProduct = new product({ Name, Description, Price, Image });
        await newProduct.save();
        res.status(200).json({ newProduct, Message: 'Product added successfully' });
        
    } catch (error) {
        res.status(500).json({ Message: error.Message });
        
    }
}
exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { Name, Description, Price, Image } = req.body;
    try {
        const updatedProduct = await product.findByIdAndUpdate(id, { Name, Description, Price, Image }, { new: true });
        res.status(200).json({ updatedProduct, Message: 'Product updated successfully' });
        
    } catch (error) {
        res.status(500).json({ Message: error.Message });
        
    }
}
exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
try {
    await product.findByIdAndDelete(id);
    res.status(200).json({ Message: 'Product deleted successfully' });
} catch (error) {
    res.status(500).json({ Message: error.Message });
    
}
}
