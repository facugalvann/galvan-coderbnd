import { Router } from 'express';
import productsModel from '../../models/products.model.js';

const productsRoutes = Router();


productsRoutes.get('/products', async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10;
  const page = parseInt(req.query.page, 10) || 1;

  try {
    const options = {
      page,
      limit,
      lean: true,
    };

    const result = await productsModel.paginate({}, options);

    const response = {
      status: 'success',
      payload: result.docs,
      totalPages: result.pages,
      prevPage: result.prevPage || null,
      nextPage: result.nextPage || null,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}&limit=${limit}` : null,
      nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}&limit=${limit}` : null,
    };

    res.status(200).send(response);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ status: 'error', message: 'Error al obtener los productos' });
  }
});

export { productsRoutes };
