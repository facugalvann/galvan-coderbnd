import express from 'express';
import productManager from '../utils/productManager.js'; 

const router = express.Router();

router.get('/', async (req, res) => {
  try {
   
    const products = await productManager.getProducts();
    res.render('home', { products }); 
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).send('Error al cargar productos');
  }
});

export default router;
