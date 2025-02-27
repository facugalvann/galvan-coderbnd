import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';


const productsSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: false,
  },
  stock: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
});


productsSchema.plugin(mongoosePaginate);


const Product = model('Product', productsSchema);

export default Product;
