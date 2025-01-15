import { Router } from 'express';
const routes = Router();

// Ruta para renderizar la vista Home
routes.get('/', (req, res) => {
  res.render('home', { products: [] }); // Pasa los productos aquí
});

// Ruta para renderizar la vista RealTimeProducts
routes.get('/realtimeproducts', (req, res) => {
  res.render('realtimeproducts', { products: [] }); // Pasa los productos aquí
});

export default routes;
