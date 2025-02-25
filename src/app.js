import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import expressHandlebars from 'express-handlebars';
import { Server } from 'socket.io';
import ProductManager from './managers/productManager.js';
import mongoose from 'mongoose';
import { connectDb } from './config/index.js';
import usersRoutes from './routes/api/users.routes.js';
import routerApp from './routes/index.js';
import { productsRoutes } from './routes/api/products.routes.js';

const app = express();
const PORT = 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.engine('hbs', expressHandlebars.engine({
  extname: '.hbs',
  helpers: {
    add: (a, b) => a + b,
    subtract: (a, b) => a - b,
    gt: (a, b) => a > b,
    lt: (a, b) => a < b,
  }
}));
app.set('view engine', 'hbs');

app.set('views', path.join(__dirname, 'views'));

connectDb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/users', usersRoutes);
app.use('/api/products', productsRoutes)
app.use(routerApp);

app.get('/', async (req, res) => {
  const products = await ProductManager.getProducts();
  res.render('home', { products });
});


app.get('/products', async (req, res) => {
  const products = await ProductManager.getProducts();
  res.render('products', { products });  
});

app.get('/realtimeproducts', async (req, res) => {
  const products = await ProductManager.getProducts();
  res.render('realtimeproducts', { products });  
});




const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const io = new Server(server);

let socketProducts = [];

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.emit('updateProducts', socketProducts);

  socket.on('addProduct', async (product) => {
    await ProductManager.addProduct(product);
    socketProducts = await ProductManager.getProducts();
    io.emit('updateProducts', socketProducts);
  });

  socket.on('removeProduct', async (productId) => {
    await ProductManager.deleteProduct(productId);
    socketProducts = await ProductManager.getProducts();
    io.emit('updateProducts', socketProducts);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
