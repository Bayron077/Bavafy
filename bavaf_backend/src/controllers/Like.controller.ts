import type { Request, Response } from 'express';
import { Like } from '../models/Like.model';

// GET /api/likes — obtener likes del usuario
export const getMyLikes = async (req: Request, res: Response): Promise<void> => {
  const likes = await Like.findAll({ where: { user_id: req.user!.id } });
  res.json({ likes });
};

// POST /api/likes/:songId — dar like
export const addLike = async (req: Request, res: Response): Promise<void> => {
  const song_id = Number(req.params['songId']);
  const user_id = req.user!.id;

  const [like, created] = await Like.findOrCreate({ where: { user_id, song_id } });

  if (!created) {
    res.status(409).json({ message: 'Ya le diste like a esta canción' });
    return;
  }
  res.status(201).json({ message: 'Like agregado', like });
};

// DELETE /api/likes/:songId — quitar like
export const removeLike = async (req: Request, res: Response): Promise<void> => {
  const song_id = Number(req.params['songId']);
  const user_id = req.user!.id;

  const deleted = await Like.destroy({ where: { user_id, song_id } });

  if (!deleted) {
    res.status(404).json({ message: 'Like no encontrado' });
    return;
  }
  res.json({ message: 'Like eliminado' });
};