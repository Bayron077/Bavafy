import { Router } from 'express';
import {
  getMyPlaylists, getById, create, update, remove,
  addSong, removeSong, reorder,
} from '../controllers/Playlist.controller';
import { authenticate } from '../middlewares/Auth.middleware';

const router = Router();

router.get('/',    authenticate, getMyPlaylists);
router.get('/:id', authenticate, getById);
router.post('/',   authenticate, create);
router.put('/:id', authenticate, update);
router.delete('/:id', authenticate, remove);

router.post('/:id/songs',                authenticate, addSong);
router.delete('/:id/songs/:songId',      authenticate, removeSong);
router.put('/:id/songs/reorder',         authenticate, reorder);

export default router;