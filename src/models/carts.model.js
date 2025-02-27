import mongoose from 'mongoose';
import productsModel from './products.model.js';

const cartSchema = new mongoose.Schema({
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 } 
}]});


const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
