import { Schema, model } from 'mongoose';

const cartSchema = new Schema({
  products: {
    type: [{
      product: {
        type: Schema.Types.ObjectId,
        ref: 'products'
      }
    }]
  }
});


cartSchema.pre(['find', 'findOne'], function() {
  this.populate('products.product');  
});

const cartsModel = model('carts', cartSchema);

export default cartsModel;
