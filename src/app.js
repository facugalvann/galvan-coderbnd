import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import expressHandlebars from 'express-handlebars';
import { Server } from 'socket.io';
import { productsRoutes } from './routes/api/products.routes.js';
import { cartsRoutes } from './routes/api/carts.routes.js';
import viewsRoutes from './routes/view.routes.js';

const PORT = 8080;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.engine('hbs', expressHandlebars.engine({
  extname: '.hbs',
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', viewsRoutes);  
app.use('/api/products', productsRoutes);
app.use('/api/carts', cartsRoutes);

let products = [
  { name: 'Producto 1', price: 100 },
  { name: 'Producto 2', price: 200 },
  { name: 'Producto 3', price: 300 }
];

app.get('/', (req, res) => {
  res.render('products', { products });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send({ status: 'error', message: 'Something went wrong!', error: err.stack || err.message });
});

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const io = new Server(server);

let socketProducts = [];

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.emit('updateProducts', socketProducts);

  socket.on('addProduct', (product) => {
    socketProducts.push(product);
    io.emit('updateProducts', socketProducts); 
  });

  socket.on('removeProduct', (productId) => {
    socketProducts = socketProducts.filter(p => p.id !== productId);
    io.emit('updateProducts', socketProducts); 
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
