import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const protect = (req: Request, res: Response, next: NextFunction) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      jwt.verify(token, process.env.JWT_SECRET || 'secret');
      next();
    } catch (error) {
      res.status(401).send('Token inválido.');
    }
  }
  if (!token) {
    res.status(401).send('Não autorizado, sem token.');
  }
};