import type { Request, Response } from 'express';
import { Op } from 'sequelize';
import { Song } from '../models/Song.model';
import { User } from '../models/User.model';
import fs from 'fs';

// GET /api/songs
export const getAll = async (req: Request, res: Response): Promise<void> => {
  const { genre, artist, limit = '50', offset = '0' } = req.query as Record<string, string>;

  const where: Record<string, unknown> = {};
  if (genre)  where['genre']  = genre;
  if (artist) where['artist'] = { [Op.like]: `%${artist}%` };

  const { count, rows } = await Song.findAndCountAll({
    where,
    limit:   Number(limit),
    offset:  Number(offset),
    order:   [['created_at', 'DESC']],
    include: [{ model: User, as: 'uploader', attributes: ['id', 'name'] }],
  });

  res.json({ total: count, songs: rows });
};

// GET /api/songs/search?q=
export const search = async (req: Request, res: Response): Promise<void> => {
  const q = (req.query['q'] as string | undefined) ?? '';

  if (!q.trim()) {
    res.status(400).json({ message: 'El parámetro q es requerido' });
    return;
  }

  const results = await Song.findAll({
    where: {
      [Op.or]: [
        { title:  { [Op.like]: `%${q}%` } },
        { artist: { [Op.like]: `%${q}%` } },
        { genre:  { [Op.like]: `%${q}%` } },
        { album:  { [Op.like]: `%${q}%` } },
      ],
    },
    order: [['title', 'ASC']],
  });

  res.json({ query: q, results });
};

// GET /api/songs/:id
export const getById = async (req: Request, res: Response): Promise<void> => {
  const song = await Song.findByPk(req.params['id'] as string, {
    include: [{ model: User, as: 'uploader', attributes: ['id', 'name'] }],
  });

  if (!song) {
    res.status(404).json({ message: 'Canción no encontrada' });
    return;
  }

  res.json(song);
};

// POST /api/songs  (superadmin, multipart)
export const create = async (req: Request, res: Response): Promise<void> => {
  const { title, artist, album, genre, duration_sec } = req.body as {
    title?: string; artist?: string; album?: string;
    genre?: string; duration_sec?: string;
  };

  if (!title || !artist || !duration_sec) {
    res.status(400).json({ message: 'title, artist y duration_sec son requeridos' });
    return;
  }

  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
  const audioFile = files?.['file']?.[0];

  if (!audioFile) {
    res.status(400).json({ message: 'El archivo de audio es requerido' });
    return;
  }

  const coverFile = files?.['cover']?.[0];

  const song = await Song.create({
    title,
    artist,
    album:        album        ?? null,
    genre:        genre        ?? null,
    duration_sec: Number(duration_sec),
    file_path:    audioFile.path.replace(/\\/g, '/'),
    cover_url:    coverFile ? coverFile.path.replace(/\\/g, '/') : null,
    uploaded_by:  req.user!.id,
  });

  res.status(201).json({ message: 'Canción subida correctamente', song });
};

// PUT /api/songs/:id  (superadmin)
export const update = async (req: Request, res: Response): Promise<void> => {
  const song = await Song.findByPk(req.params['id'] as string);

  if (!song) {
    res.status(404).json({ message: 'Canción no encontrada' });
    return;
  }

  const { title, artist, album, genre } = req.body as {
    title?: string; artist?: string; album?: string; genre?: string;
  };

  await song.update({
    ...(title  !== undefined && { title }),
    ...(artist !== undefined && { artist }),
    ...(album  !== undefined && { album }),
    ...(genre  !== undefined && { genre }),
  });

  res.json({ message: 'Canción actualizada', song });
};

// DELETE /api/songs/:id  (superadmin)
export const remove = async (req: Request, res: Response): Promise<void> => {
  const song = await Song.findByPk(req.params['id'] as string);

  if (!song) {
    res.status(404).json({ message: 'Canción no encontrada' });
    return;
  }

  // Eliminar el archivo físico del disco
  if (fs.existsSync(song.file_path)) fs.unlinkSync(song.file_path);
  if (song.cover_url && fs.existsSync(song.cover_url)) fs.unlinkSync(song.cover_url);

  await song.destroy();
  res.json({ message: 'Canción eliminada' });
};