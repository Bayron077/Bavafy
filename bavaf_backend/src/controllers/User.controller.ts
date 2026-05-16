import type { Request, Response } from 'express';
import { User } from '../models/User.model';

// GET /api/users  (solo superadmin)
export const getAll = async (_req: Request, res: Response): Promise<void> => {
  const users = await User.findAll({
    attributes: { exclude: ['password_hash'] },
    order: [['created_at', 'DESC']],
  });
  res.json(users);
};

// GET /api/users/:id
export const getById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  // Un user solo puede ver su propio perfil
  if (req.user!.role === 'user' && req.user!.id !== Number(id)) {
    res.status(403).json({ message: 'No tienes permisos para ver este perfil' });
    return;
  }

  const user = await User.findByPk(id as string, {
    attributes: { exclude: ['password_hash'] },
  });

  if (!user) {
    res.status(404).json({ message: 'Usuario no encontrado' });
    return;
  }

  res.json(user);
};

// PUT /api/users/:id
export const update = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  // Un user solo puede editar su propio perfil
  if (req.user!.role === 'user' && req.user!.id !== Number(id)) {
    res.status(403).json({ message: 'No puedes editar el perfil de otro usuario' });
    return;
  }

  const user = await User.findByPk(id as string);
  if (!user) {
    res.status(404).json({ message: 'Usuario no encontrado' });
    return;
  }

  const { name, avatar_url } = req.body as { name?: string; avatar_url?: string };

  await user.update({
    ...(name       !== undefined && { name }),
    ...(avatar_url !== undefined && { avatar_url }),
  });

  res.json({
    message: 'Perfil actualizado',
    user: { id: user.id, name: user.name, email: user.email, avatar_url: user.avatar_url },
  });
};

// DELETE /api/users/:id  (solo superadmin)
export const remove = async (req: Request, res: Response): Promise<void> => {
  const user = await User.findByPk(req.params['id'] as string);

  if (!user) {
    res.status(404).json({ message: 'Usuario no encontrado' });
    return;
  }

  await user.destroy();
  res.json({ message: 'Usuario eliminado' });
};