import { Router } from 'express';
import fs from 'fs';

const productsRoutes = Router();

const getProducts = async () => {
  try {
    const products = await fs.promises.readFile('src/db/products.json', 'utf-8');
    return JSON.parse(products);
  } catch (error) {
    console.error('Error al leer los productos:', error);
    return [];
  }
};

const saveProducts = async (products) => {
  try {
    const parsedProducts = JSON.stringify(products, null, 2);
    await fs.promises.writeFile('src/db/products.json', parsedProducts, 'utf-8');
    return true;
  } catch (error) {
    console.error('Error al guardar los productos:', error);
    return false;
  }
};

const getSingleProductById = async (pId) => {
  const products = await getProducts();
  return products.find(p => p.id === pId);
};

productsRoutes.get('/', async (req, res) => {
  const limit = parseInt(req.query.limit, 10);
  const products = await getProducts();

  if (isNaN(limit) || limit <= 0) {
    return res.send({ products });
  }
  const productsLimited = products.slice(0, limit);
  res.send({ productsLimited });
});

productsRoutes.get('/:pid', async (req, res) => {
  const pId = +req.params.pid;
  const product = await getSingleProductById(pId);

  if (!product) {
    return res.status(404).send({ status: 'Error', message: 'Producto no encontrado' });
  }

  res.send({ product });
});

productsRoutes.post('/', async (req, res) => {
  const product = req.body;
  product.id = Math.floor(Math.random() * 10000);

  if (product.status === undefined) {
    product.status = true;
  }

  if (!product.title || !product.description || !product.code || !product.price || !product.stock || !product.category) {
    return res.status(400).send({ status: 'error', message: 'Producto incompleto' });
  }

  const products = await getProducts();
  products.push(product);

  const isOK = await saveProducts(products);
  if (!isOK) {
    return res.status(500).send({ status: 'error', message: 'Producto no agregado' });
  }

  return res.status(200).send({ status: 'ok', message: 'Producto agregado' });
});

productsRoutes.delete('/:pid', async (req, res) => {
  const id = +req.params.pid;
  const product = await getSingleProductById(id);

  if (!product) {
    return res.status(404).send({ status: "Error", message: 'Producto no encontrado' });
  }

  const products = await getProducts();
  const filteredProducts = products.filter(p => p.id !== id);

  const isOK = await saveProducts(filteredProducts);
  if (!isOK) {
    return res.status(400).send({ status: "Error", message: 'Algo salió mal' });
  }

  res.send({ status: 'Ok', message: 'Producto eliminado' });
});

productsRoutes.put('/:pid', async (req, res) => {
  const pId = +req.params.pid;
  const productToUpdate = req.body;

  if (!productToUpdate.title || !productToUpdate.description || !productToUpdate.code || 
      !productToUpdate.price || !productToUpdate.stock || !productToUpdate.category) {
    return res.status(400).send({ status: 'error', message: 'Producto incompleto' });
  }

  const products = await getProducts();
  let product = products.find(p => p.id === pId);

  if (!product) {
    return res.status(404).send({ status: "Error", message: 'Producto no encontrado' });
  }

  product = {
    ...productToUpdate,
    id: pId
  };

  const updatedProducts = products.map(p => p.id === pId ? product : p);

  const isOK = await saveProducts(updatedProducts);
  
  if (!isOK) {
    return res.status(500).send({ status: 'error', message: 'Algo salió mal al actualizar el producto' });
  }

  res.send({ status: 'ok', message: 'Producto actualizado correctamente' });
});

export { productsRoutes };
