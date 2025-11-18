import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import productRouter from './routes/productRouter';
import authRouter from './routes/authRouter';
import statusRouter from './routes/statusRouter';
import orderRouter from './routes/orderRouter'; 

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const dbURI = process.env.DB_URI;
if (!dbURI) {
  console.error('ERRO: DB_URI não definida no .env');
  process.exit(1);
}

mongoose.connect(dbURI)
    .then(() => console.log('Conectado ao MongoDB com TypeScript!'))
    .catch(err => console.error('Erro ao conectar:', err));

// Rotas
app.use('/api/products', productRouter);
app.use('/api/users', authRouter);
app.use('/api/status', statusRouter);
app.use('/api/orders', orderRouter); 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
