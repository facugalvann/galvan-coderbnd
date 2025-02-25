import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productsCollection = 'products';

const productsSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  category: String,
  stock: {
    type: Number
  },
  price: Number
});

productsSchema.plugin(mongoosePaginate);  

const productsModel = model(productsCollection, productsSchema);

export default productsModel;
