import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import { sequelize } from './config/database';

import authRoutes from './routes/Auth.routes';
import userRoutes from './routes/User.routes';
import songRoutes from './routes/Song.routes';
import playlistRoutes from './routes/Playlist.routes';
import likeRoutes from './routes/Like.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3000;

// ── Middlewares globales ──────────────────────────────────────
app.use(cors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:4200' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Archivos estáticos (audio, covers, avatars) ───────────────
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// ── Rutas ─────────────────────────────────────────────────────
app.use('/api/auth',      authRoutes);
app.use('/api/users',     userRoutes);
app.use('/api/songs',     songRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/likes', likeRoutes);

// ── Health check ──────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Conexión DB + arranque ────────────────────────────────────
sequelize
  .authenticate()
  .then(() => {
    console.log('Conectado a MySQL');
    return sequelize.sync({ alter: false });
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err: unknown) => {
    console.error('Error conectando a la BD:', err);
    process.exit(1);
  });