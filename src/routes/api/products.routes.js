import { Router } from 'express';
import productsModel from '../../models/products.model.js';

const productsRoutes = Router();

productsRoutes.get('/products', async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10;
  const page = parseInt(req.query.page, 10) || 1;
  const products = await productsRoutes.propfind().lean()
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
    console.error(error);
    return res.status(500).send({ status: 'error', message: 'Error al obtener los productos' });
  }
});

export { productsRoutes };
