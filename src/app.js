import express from 'express';
import productsRouter from './routes/products.routes.js';

const app = express();
const port = 3000;
app.use(express.json());
app.use(productsRouter);

app.get('/', async(req, res) => {
    res.send('server is running');
})

app.listen(port, () => {
    console.log(`Server is running in port ${port}`);
})