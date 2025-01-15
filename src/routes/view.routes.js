import { Router } from 'express';
const routes = Router();

routes.get('/', (req, res) => {
  res.render('home', { products: [] }); 
});

routes.get('/realtimeproducts', (req, res) => {
  res.render('realtimeproducts', { products: [] });
});

export default routes;
