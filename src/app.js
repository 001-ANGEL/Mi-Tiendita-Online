import express from 'express';
import productsRouter from './routes/products.routes.js';
import categoriesRouter from './routes/categories.routes.js';
import statesRouter from './routes/states.routes.js';

const app = express();
const port = 3000;
app.use(express.json());
app.use(productsRouter);
app.use(categoriesRouter);
app.use(statesRouter);

app.get('/', async(req, res) => {
    res.send('server is running');
})

app.listen(port, () => {
    console.log(`Server is running in port ${port}`);
})