import { Router } from "express";
import routerViews from './views.routes.js'
import routerUsers from './api/users.routes.js'
import { cartsRoutes } from "./api/carts.routes.js";
import { productsRoutes } from "./api/products.routes.js";
import Cart from "../models/carts.model.js";

const router = Router()

router.use('/', routerViews);
router.use('/api/products', productsRoutes)
router.use('/api/carts', cartsRoutes )
router.use('/api/users', routerUsers)
router.use('/products', productsRoutes)
router.use('/carts', cartsRoutes)


export default router
