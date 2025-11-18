import { Request, Response } from 'express';
import Order from '../models/orderModel';
import jwt from 'jsonwebtoken';

const getEmailFromToken = (token: string): string => {
    try {
        const decoded: any = jwt.decode(token);
        return decoded.email || 'Usuário Não Identificado';
    } catch {
        return 'Usuário Não Identificado';
    }
};

export const placeOrder = async (req: Request, res: Response) => {
    // A rota é protegida, então o token existe.
    const token = req.headers.authorization?.split(' ')[1] || '';
    const userEmail = getEmailFromToken(token);

    const { items, totalAmount, shippingAddress } = req.body;

    try {
        const order = await Order.create({
            userEmail,
            items,
            totalAmount,
            shippingAddress,
            status: 'Pending'
        });
        res.status(201).json({ message: 'Pedido criado com sucesso', orderId: order._id });
    } catch (error) {
        console.error("ERRO AO PROCESSAR PEDIDO:", error);
        res.status(500).send('Falha ao processar o pedido.');
    }
};
