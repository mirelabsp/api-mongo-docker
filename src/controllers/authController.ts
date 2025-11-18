import { Request, Response } from 'express';
import User from '../models/userModel';
import jwt from 'jsonwebtoken';

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '2h' });
};

export const registerUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).send('Usuário já existe.');
    
    const user = await User.create({ email, password });
    res.status(201).json({ 
      _id: user._id, 
      email: user.email, 
      token: generateToken(user._id.toString()) 
    });
  } catch (error) {
    res.status(500).send('Erro ao registrar.');
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.comparePassword(password))) {
      res.status(200).json({ 
        _id: user._id, 
        email: user.email, 
        token: generateToken(user._id.toString()) 
      });
    } else {
      res.status(401).send('Email ou senha inválidos.');
    }
  } catch (error) {
    res.status(500).send('Erro no login.');
  }
};