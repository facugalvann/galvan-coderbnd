import { Router } from 'express';
import productsModel from '../models/products.model.js';
import productManager from '../managers/productManager.js';
import Cart from '../models/carts.model.js'; 

const router = Router();


router.get('/', async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render('home', { products });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).send('Error al cargar productos');
  }
});


router.get('/products', async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10;
  const page = parseInt(req.query.page, 10) || 1;

  try {
    const options = {
      page: page,
      limit: limit,
      lean: true
    };

    const result = await productsModel.paginate({}, options);

    res.render('products', {
      products: result.docs,
      total: result.total,
      page: result.page,
      pages: result.pages
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).send({ status: 'error', message: 'Error al obtener los productos' });
  }
});


router.get('/cart', async (req, res) => {
  try {
  
    const cart = await Cart.findOne({}).populate('products.product'); 

    if (!cart) {
      return res.status(404).send({ status: 'error', message: 'Carrito no encontrado' });
    }

    res.render('cart', { cart });
  } catch (error) {
    console.error('Error al obtener el carrito:', error);
    res.status(500).send({ status: 'error', message: 'Error al obtener el carrito' });
  }
});

router.post('/checkout', async (req, res) => {
  try {
 
    const cart = await Cart.findOne({}); 
    if (!cart) {
      return res.status(404).send({ status: 'error', message: 'Carrito no encontrado' });
    }

   
    cart.products = [];
    await cart.save();

    
    res.render('checkout-success', { message: 'Compra finalizada exitosamente!' });

  } catch (error) {
    console.error('Error en el checkout:', error);
    res.status(500).send({ status: 'error', message: 'Error al procesar el checkout' });
  }
});

export default router;
