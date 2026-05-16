import type { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// ── Role guard ────────────────────────────────────────────────
export const requireRole = (...roles: ('superadmin' | 'user')[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'No autenticado' });
      return;
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ message: 'No tienes permisos para esta acción' });
      return;
    }
    next();
  };

// ── Multer storage ────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (_req, file, cb) => {
    let folder = 'uploads/others';

    if (file.fieldname === 'file')   folder = 'uploads/songs';
    if (file.fieldname === 'cover')  folder = 'uploads/covers';
    if (file.fieldname === 'avatar') folder = 'uploads/avatars';

    // Crea la carpeta si no existe
    fs.mkdirSync(folder, { recursive: true });
    cb(null, folder);
  },
  filename: (_req, file, cb) => {
    const ext      = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext)
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    const unique = `${Date.now()}-${basename}${ext}`;
    cb(null, unique);
  },
});

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedAudio = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'];
  const allowedImage = ['image/jpeg', 'image/png', 'image/webp'];

  if (file.fieldname === 'file' && !allowedAudio.includes(file.mimetype)) {
    cb(new Error('Solo se permiten archivos de audio (mp3, wav, ogg)'));
    return;
  }
  if ((file.fieldname === 'cover' || file.fieldname === 'avatar') && !allowedImage.includes(file.mimetype)) {
    cb(new Error('Solo se permiten imágenes (jpg, png, webp)'));
    return;
  }
  cb(null, true);
};

const MAX_MB = Number(process.env.MAX_FILE_SIZE_MB ?? 20);

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_MB * 1024 * 1024 },
});