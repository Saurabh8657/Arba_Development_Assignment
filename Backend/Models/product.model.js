const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  image: { type: String, required: true, default: 'https://res.cloudinary.com/dezupfsqo/image/upload/v1712294594/zhzzgzdgq41bev2ivaka.jpg' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const ProductModel = mongoose.model('Product', productSchema);

module.exports = {
  ProductModel
}