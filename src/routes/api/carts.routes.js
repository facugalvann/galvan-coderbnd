
import { Router } from 'express';
import cartsModel from '../../models/carts.model.js'; // Solo importa el modelo una vez
import productsModel from '../../models/products.model.js'; // Asegúrate de importar el modelo correctamente

const cartsRoutes = Router();

// Obtener todos los carritos
cartsRoutes.get('/', async (req, res) => {
  try {
    const carts = await cartsModel.find({}).populate('products.product'); // Aquí se hace populate del campo "product"
    res.status(200).send({ status: 'success', data: carts });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: 'error', message: 'Error al obtener los carritos' });
  }
});

// Crear un carrito nuevo
cartsRoutes.post('/', async (req, res) => {
  try {
    const cart = await cartsModel.create({ products: [] }); // Carrito vacío al principio
    res.status(201).send({ status: 'success', data: cart });
  } catch (error) {
    console.error('Error al crear el carrito:', error);
    res.status(500).send({ status: 'error', message: 'No se pudo crear el carrito' });
  }
});

// Obtener carrito por ID
cartsRoutes.get('/:cid', async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await cartsModel.findById(cid).populate('products.product'); // Aquí también se hace populate del campo "product"
    console.log(cart); // Verifica los datos del carrito

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

cartsRoutes.post('/cart/add/:productId', async (req, res) => {
  const { productId } = req.params;
  try {
    
    let cart = await Cart.findOne({});
    if (!cart) {
      cart = new Cart({ products: [] });
    }

    
    const existingProductIndex = cart.products.findIndex(p => p.product.toString() === productId);
    if (existingProductIndex !== -1) {
      
      cart.products[existingProductIndex].quantity += 1;
    } else {
      
      cart.products.push({ product: productId, quantity: 1 });
    }

    await cart.save();
    res.json({ status: 'success', message: 'Producto agregado al carrito' });
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
    res.status(500).json({ status: 'error', message: 'Error al agregar el producto al carrito' });
  }
});


cartsRoutes.put('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity <= 0) {
    return res.status(400).send({ status: 'error', message: 'La cantidad debe ser mayor que 0' });
  }

  try {
    const cart = await cartsModel.findById(cid);

    if (!cart) {
      return res.status(404).send({ status: 'error', message: 'Carrito no encontrado' });
    }

    
    const productExists = await productsModel.findById(pid);
    if (!productExists) {
      return res.status(404).send({ status: 'error', message: 'Producto no encontrado' });
    }

    const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
    if (productIndex >= 0) {
     
      cart.products[productIndex].quantity = quantity;
    } else {
     
      cart.products.push({ product: pid, quantity });
    }

    await cart.save();
    res.status(200).send({ status: 'success', message: 'Producto actualizado en el carrito' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: 'error', message: 'Error al actualizar el producto en el carrito' });
  }
});


cartsRoutes.delete('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const cart = await cartsModel.findById(cid);

    if (!cart) {
      return res.status(404).send({ status: 'error', message: 'Carrito no encontrado' });
    }

    cart.products = cart.products.filter(p => p.product.toString() !== pid);

    await cart.save();
    res.status(200).send({ status: 'success', message: 'Producto eliminado del carrito' });
  } catch (error) {
    console.error(error);
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
    console.error(error);
    res.status(500).send({ status: 'error', message: 'Error al eliminar los productos del carrito' });
  }
});

export { cartsRoutes };
