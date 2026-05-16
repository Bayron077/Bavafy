import type { Request, Response } from 'express';
import { Like } from '../models/Like.model.js';
import { Song } from '../models/Song.model.js';

// GET /api/likes  — likes del usuario autenticado
export const getMyLikes = async (req: Request, res: Response): Promise<void> => {
  const likes = await Like.findAll({
    where: { user_id: req.user!.id },
    attributes: ['id', 'song_id', 'created_at'],
    order: [['created_at', 'DESC']],
  });
  res.json({ likes });
};

// POST /api/likes/:songId  — dar like
export const addLike = async (req: Request, res: Response): Promise<void> => {
  const songId = Number(req.params['songId']);

  const song = await Song.findByPk(songId);
  if (!song) {
    res.status(404).json({ message: 'Canción no encontrada' });
    return;
  }

  const existing = await Like.findOne({
    where: { user_id: req.user!.id, song_id: songId },
  });

  if (existing) {
    res.status(409).json({ message: 'Ya le diste like a esta canción' });
    return;
  }

  await Like.create({ user_id: req.user!.id, song_id: songId });
  res.status(201).json({ message: 'Like agregado' });
};

// DELETE /api/likes/:songId  — quitar like
export const removeLike = async (req: Request, res: Response): Promise<void> => {
  const songId = Number(req.params['songId']);

  const like = await Like.findOne({
    where: { user_id: req.user!.id, song_id: songId },
  });

  if (!like) {
    res.status(404).json({ message: 'Like no encontrado' });
    return;
  }

  await like.destroy();
  res.json({ message: 'Like eliminado' });
};