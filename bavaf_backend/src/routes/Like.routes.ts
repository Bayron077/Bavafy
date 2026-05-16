import { Router } from 'express';
import { getMyLikes, addLike, removeLike } from '../controllers/Like.controller';
import { authenticate } from '../middlewares/Auth.middleware';

const router = Router();

router.get('/',         authenticate, getMyLikes);
router.post('/:songId', authenticate, addLike);
router.delete('/:songId', authenticate, removeLike);

export default router;