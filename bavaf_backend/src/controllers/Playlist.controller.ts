import type { Request, Response } from 'express';
import { Playlist, PlaylistSong } from '../models/playlist.model';
import { Song } from '../models/Song.model';

// GET /api/playlists  — playlists del usuario autenticado
export const getMyPlaylists = async (req: Request, res: Response): Promise<void> => {
  const playlists = await Playlist.findAll({
    where: { user_id: req.user!.id },
    order: [['created_at', 'DESC']],
  });
  res.json(playlists);
};

// GET /api/playlists/:id  — con canciones ordenadas por position
export const getById = async (req: Request, res: Response): Promise<void> => {
  const playlist = await Playlist.findByPk(req.params['id'] as string, {
    include: [{
      model:   Song,
      as:      'songs',
      through: { attributes: ['position', 'added_at'] },
    }],
  });

  if (!playlist) {
    res.status(404).json({ message: 'Playlist no encontrada' });
    return;
  }

  if (playlist.user_id !== req.user!.id && req.user!.role !== 'superadmin') {
    res.status(403).json({ message: 'No tienes acceso a esta playlist' });
    return;
  }

  res.json(playlist);
};

// POST /api/playlists
export const create = async (req: Request, res: Response): Promise<void> => {
  const { name, description } = req.body as { name?: string; description?: string };

  if (!name) {
    res.status(400).json({ message: 'El nombre de la playlist es requerido' });
    return;
  }

  const playlist = await Playlist.create({
    name,
    description: description ?? null,
    user_id:     req.user!.id,
  });

  res.status(201).json({ message: 'Playlist creada', playlist });
};

// PUT /api/playlists/:id
export const update = async (req: Request, res: Response): Promise<void> => {
  const playlist = await Playlist.findByPk(req.params['id'] as string);

  if (!playlist) {
    res.status(404).json({ message: 'Playlist no encontrada' });
    return;
  }

  if (playlist.user_id !== req.user!.id) {
    res.status(403).json({ message: 'No puedes editar esta playlist' });
    return;
  }

  const { name, description } = req.body as { name?: string; description?: string };

  await playlist.update({
    ...(name        !== undefined && { name }),
    ...(description !== undefined && { description }),
  });

  res.json({ message: 'Playlist actualizada', playlist });
};

// DELETE /api/playlists/:id
export const remove = async (req: Request, res: Response): Promise<void> => {
  const playlist = await Playlist.findByPk(req.params['id'] as string);

  if (!playlist) {
    res.status(404).json({ message: 'Playlist no encontrada' });
    return;
  }

  if (playlist.user_id !== req.user!.id) {
    res.status(403).json({ message: 'No puedes eliminar esta playlist' });
    return;
  }

  await playlist.destroy();
  res.json({ message: 'Playlist eliminada' });
};

// POST /api/playlists/:id/songs
export const addSong = async (req: Request, res: Response): Promise<void> => {
  const playlist = await Playlist.findByPk(req.params['id'] as string);

  if (!playlist) {
    res.status(404).json({ message: 'Playlist no encontrada' });
    return;
  }

  if (playlist.user_id !== req.user!.id) {
    res.status(403).json({ message: 'No puedes modificar esta playlist' });
    return;
  }

  const { song_id, position } = req.body as { song_id?: number; position?: number };

  if (!song_id) {
    res.status(400).json({ message: 'song_id es requerido' });
    return;
  }

  const song = await Song.findByPk(song_id);
  if (!song) {
    res.status(404).json({ message: 'Canción no encontrada' });
    return;
  }

  const existing = await PlaylistSong.findOne({
    where: { playlist_id: playlist.id, song_id },
  });

  if (existing) {
    res.status(409).json({ message: 'La canción ya está en esta playlist' });
    return;
  }

  // Si no viene position, la ponemos al final
  let pos = position;
  if (pos === undefined) {
    const count = await PlaylistSong.count({ where: { playlist_id: playlist.id } });
    pos = count + 1;
  }

  await PlaylistSong.create({ playlist_id: playlist.id, song_id, position: pos });
  res.status(201).json({ message: 'Canción agregada a la playlist' });
};

// DELETE /api/playlists/:id/songs/:songId
export const removeSong = async (req: Request, res: Response): Promise<void> => {
  const playlist = await Playlist.findByPk(req.params['id'] as string);

  if (!playlist) {
    res.status(404).json({ message: 'Playlist no encontrada' });
    return;
  }

  if (playlist.user_id !== req.user!.id) {
    res.status(403).json({ message: 'No puedes modificar esta playlist' });
    return;
  }

  const entry = await PlaylistSong.findOne({
    where: { playlist_id: playlist.id, song_id: Number(req.params['songId']) },
  });

  if (!entry) {
    res.status(404).json({ message: 'La canción no está en esta playlist' });
    return;
  }

  await entry.destroy();
  res.json({ message: 'Canción eliminada de la playlist' });
};

// PUT /api/playlists/:id/songs/reorder
export const reorder = async (req: Request, res: Response): Promise<void> => {
  const playlist = await Playlist.findByPk(req.params['id'] as string);

  if (!playlist) {
    res.status(404).json({ message: 'Playlist no encontrada' });
    return;
  }

  if (playlist.user_id !== req.user!.id) {
    res.status(403).json({ message: 'No puedes modificar esta playlist' });
    return;
  }

  const { order } = req.body as {
    order?: { song_id: number; position: number }[];
  };

  if (!Array.isArray(order)) {
    res.status(400).json({ message: 'order debe ser un array' });
    return;
  }

  await Promise.all(
    order.map(({ song_id, position }) =>
      PlaylistSong.update(
        { position },
        { where: { playlist_id: playlist.id, song_id } }
      )
    )
  );

  res.json({ message: 'Playlist reordenada correctamente' });
};