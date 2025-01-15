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


const viewsPath = path.join(__dirname, 'views');  
app.set('views', viewsPath);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/', viewsRoutes);  
app.use('/api/products', productsRoutes);
app.use('/api/carts', cartsRoutes);


app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send({ status: 'error', message: 'Something went wrong!', error: err.stack || err.message });
});

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


const io = new Server(server);

let products = []; 


io.on('connection', (socket) => {
  console.log('A user connected');
  socket.emit('updateProducts', products); 


  socket.on('addProduct', (product) => {
    products.push(product);
    io.emit('updateProducts', products); 
  });

  
  socket.on('removeProduct', (productId) => {
    products = products.filter(p => p.id !== productId);
    io.emit('updateProducts', products); 
  });

  
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
