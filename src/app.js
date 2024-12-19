import express from 'express';
import { connectDB } from './config/db.js';

const app = express();
const port = 3000;
app.use(express.json());

app.get('/', async(req, res) => {
    try {
        const pool = await connectDB();
        const result = await pool.request().query('SELECT * FROM Usuarios');
        res.json(result.recordset); 
    } catch (error) {
        console.log(error);
    }
})

app.listen(port, () => {
    console.log(`Server is running in port ${port}`);
})