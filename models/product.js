const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
    },
    Description: {
        type: String,
        required: true,
    },
    Price: {
        type: Number,
        required: true,
    },
    Image: {
        type: String,
        required: true,
    },
}, { timestamps: true });
module.exports = mongoose.model('Product', productSchema);