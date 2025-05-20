const Product = require('../models/product');

// ✅ Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    role = req.user.role;
    console.log("User Role:", role);
  res.status(200).json({products , role});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Add a new product
exports.addProduct = async (req, res) => {
  const { Name, Description, Price, Image } = req.body;
  try {
    const newProduct = new Product({ Name, Description, Price, Image });
    await newProduct.save();
    res.status(201).json({ message: 'Product added successfully', newProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update product by ID
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { Name, Description, Price, Image } = req.body;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { Name, Description, Price, Image },
      { new: true }
    );
    res.status(200).json({ message: 'Product updated successfully', updatedProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete product by ID
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update product by name
exports.updateProductByName = async (req, res) => {
  const { name } = req.params;
  const { description, price, image } = req.body;
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { name },
      { description, price, image },
      { new: true }
    );
    res.status(200).json({ message: 'Product updated successfully', updatedProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get product by ID
exports.getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const foundProduct = await Product.findById(id);
    if (!foundProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(foundProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
