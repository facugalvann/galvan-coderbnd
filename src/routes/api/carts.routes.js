import { Router } from 'express';
import fs from 'fs';
import cartsModel from '../../models/carts.model.js'
import Cart from '../../models/carts.model.js';

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

cartsRoutes.get('/', async (req, res) => {
  try {
    const carts = await cartsModel.find({})
  res.send(carts)
  } catch (error) {
    console.log(error)
  }
  
})

cartsRoutes.post('/', async (req, res) => {

  const result = await cartsModel.create({ products: [{product: '67bbd629b6236efaff235695'}, {product:'67bbd64e51b4652e24c26d43'}] })
  res.send(result)
  const carts = await getCarts();
  
  const isOK = await saveCarts(carts);
  if (!isOK) {
    return res.status(500).send({ status: 'error', message: 'No se pudo crear el carrito' });
  }

 
});


cartsRoutes.get('/:cid', async (req, res) => {
  const { cid } = req.params;
  try {
    
    const cart = await cartsModel.findById(cid).populate('products.product');
    
    if (!cart) {
      return res.status(404).send({ status: 'error', message: 'Carrito no encontrado' });
    }

    
    if (cart.products.length === 0) {
      return res.status(200).send({ status: 'success', message: 'El carrito está vacío.' });
    }

    res.status(200).send({ status: 'success', data: cart });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: 'error', message: 'Error al obtener el carrito' });
  }
});





cartsRoutes.put('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    const cart = await cartsModel.findById(cid);
    if (!cart) {
      return res.status(404).send({ status: 'error', message: 'Carrito no encontrado' });
    }

    const product = cart.products.find(p => p.product.toString() === pid);

    if (product) {
    
      product.quantity += quantity;
    } else {
     
      cart.products.push({ product: pid, quantity });
    }

    await cart.save();
    res.status(200).send({ status: 'success', message: 'Producto agregado al carrito' });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: 'error', message: 'Error al agregar el producto al carrito' });
  }
});



cartsRoutes.put('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  try {
    const cart = await cartsModel.findById(cid);
    if (!cart) {
      return res.status(404).send({ status: 'error', message: 'Carrito no encontrado' });
    }

    const product = cart.products.find(p => p.product.toString() === pid);
    if (!product) {
      return res.status(404).send({ status: 'error', message: 'Producto no encontrado en el carrito' });
    }

    product.quantity = quantity;
    await cart.save();
    res.status(200).send({ status: 'success', message: 'Cantidad del producto actualizada' });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: 'error', message: 'Error al actualizar la cantidad' });
  }
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

cartsRoutes.delete('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const cart = await cartsModel.findById(cid);
    if (!cart) {
      return res.status(404).send({ status: 'error', message: 'Carrito no encontrado' });
    }
    cart.products = cart.products.filter(p => p.product.toString() !== pid); // Eliminar el producto
    await cart.save();
    res.status(200).send({ status: 'success', message: 'Producto eliminado del carrito' });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: 'error', message: 'Error al eliminar producto del carrito' });
  }
});

cartsRoutes.delete('/:cid', async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await cartsModel.findById(cid);
    if (!cart) {
      return res.status(404).send({ status: 'error', message: 'Carrito no encontrado' });
    }
    cart.products = []; 
    await cart.save();
    res.status(200).send({ status: 'success', message: 'Todos los productos eliminados del carrito' });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: 'error', message: 'Error al eliminar los productos del carrito' });
  }
});


export { cartsRoutes }; 
