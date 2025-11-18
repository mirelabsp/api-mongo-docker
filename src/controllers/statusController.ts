import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Product from '../models/productModel';
import User from '../models/userModel';
import Review from '../models/reviewModel';
import Order from '../models/orderModel'; // <-- IMPORTAR NOVO MODELO

export const getAppStatus = async (req: Request, res: Response) => {
  try {
    const dbState = mongoose.connection.readyState === 1 ? 'OK' : 'Desconectado';
    
    // Inclui a contagem de Pedidos (Orders)
    const [products, users, reviews, orders] = await Promise.all([
      Product.countDocuments(),
      User.countDocuments(),
      Review.countDocuments(),
      Order.countDocuments() // <-- NOVA CONTAGEM
    ]);
    
    res.json({
      api: { status: 'Operacional', uptime: process.uptime().toFixed(0) + 's' },
      database: { 
        connection: dbState,
        collections: { products, users, reviews, orders } // <-- EXPOR ORDERS
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar status' });
  }
};
