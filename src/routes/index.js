
import { Router } from "express";
import viewsRoutes from './views.routes.js'; 
import usersRoutes from './api/users.routes.js'; 
import { cartsRoutes } from "./api/carts.routes.js";
import { productsRoutes } from "./api/products.routes.js";

const router = Router();


router.use('/', viewsRoutes);


router.use('/api/users', usersRoutes);


router.use('/products', productsRoutes);
router.use('/cart', cartsRoutes);

export default router;
