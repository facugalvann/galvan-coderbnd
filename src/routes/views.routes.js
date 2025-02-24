import { Router } from 'express';
import productsModel from '../models/products.model.js';
import productManager from '../managers/productManager.js';

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

router.get('/', async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10;
  const page = parseInt(req.query.page, 10) || 1;
  res.render('products', {
    
  })

  try {
    const options = {
      page: page,
      limit: limit,
      lean: true
    };

    const result = await productsModel.paginate({}, options);

    return res.status(200).send({
      total: result.total,
      page: result.page,
      pages: result.pages,
      products: result.docs
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ status: 'error', message: 'Error al obtener los productos' });
  }
});

export default router;
