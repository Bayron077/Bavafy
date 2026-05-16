import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.model';

const JWT_SECRET  = process.env.JWT_SECRET     ?? 'secret';
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN ?? '7d';

// POST /api/auth/register
export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body as {
    name?: string; email?: string; password?: string;
  };

  if (!name || !email || !password) {
    res.status(400).json({ message: 'name, email y password son requeridos' });
    return;
  }

  const existing = await User.findOne({ where: { email } });
  if (existing) {
    res.status(409).json({ message: 'El email ya está registrado' });
    return;
  }

  const password_hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password_hash });

  res.status(201).json({
    message: 'Usuario registrado correctamente',
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
};

// POST /api/auth/login
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    res.status(400).json({ message: 'email y password son requeridos' });
    return;
  }

  const user = await User.findOne({ where: { email } });
  if (!user) {
    res.status(401).json({ message: 'Credenciales inválidas' });
    return;
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    res.status(401).json({ message: 'Credenciales inválidas' });
    return;
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES } as jwt.SignOptions
  );

  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
};

// GET /api/auth/me
export const me = async (req: Request, res: Response): Promise<void> => {
  const user = await User.findByPk(req.user!.id, {
    attributes: { exclude: ['password_hash'] },
  });

  if (!user) {
    res.status(404).json({ message: 'Usuario no encontrado' });
    return;
  }

  res.json(user);
};

// POST /api/auth/logout  (stateless: el cliente elimina el token)
export const logout = (_req: Request, res: Response): void => {
  res.json({ message: 'Sesión cerrada correctamente' });
};