import { Router } from 'express';
import fs from 'fs';

const cartsRoutes = Router();

const getCarts = async () => {
  try {
    const carts = await fs.promises.readFile('src/db/carts.json', 'utf-8');
    return JSON.parse(carts);
  } catch (error) {
    console.error('Error al leer los carritos:', error);
    return [];
  }
};

const saveCarts = async (carts) => {
  try {
    const parsedCarts = JSON.stringify(carts, null, 2);
    await fs.promises.writeFile('src/db/carts.json', parsedCarts, 'utf-8');
    return true;
  } catch (error) {
    console.error('Error al guardar los carritos:', error);
    return false;
  }
};

const getSingleCartById = async (cid) => {
  const carts = await getCarts();
  return carts.find(cart => cart.id === cid);
};

cartsRoutes.post('/', async (req, res) => {
  const carts = await getCarts();
  const newCart = {
    id: Math.floor(Math.random() * 10000),
    products: []
  };

  carts.push(newCart);

  const isOK = await saveCarts(carts);
  if (!isOK) {
    return res.status(500).send({ status: 'error', message: 'No se pudo crear el carrito' });
  }

  res.status(200).send({ status: 'ok', message: 'Carrito creado', cart: newCart });
});

cartsRoutes.get('/:cid', async (req, res) => {
  const cid = +req.params.cid;
  const cart = await getSingleCartById(cid);

  if (!cart) {
    return res.status(404).send({ status: 'error', message: 'Carrito no encontrado' });
  }

  res.send({ cart });
});

cartsRoutes.post('/:cid/product/:pid', async (req, res) => {
  const cid = +req.params.cid;
  const pid = +req.params.pid;
  const carts = await getCarts();

  const cart = await getSingleCartById(cid);
  if (!cart) {
    return res.status(404).send({ status: 'error', message: 'Carrito no encontrado' });
  }

  const existingProduct = cart.products.find(p => p.product === pid);
  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.products.push({ product: pid, quantity: 1 });
  }

  const isOK = await saveCarts(carts);
  if (!isOK) {
    return res.status(500).send({ status: 'error', message: 'No se pudo actualizar el carrito' });
  }

  res.status(200).send({ status: 'ok', message: 'Producto agregado al carrito', cart });
});

export { cartsRoutes };
