import { Router } from 'express';
import { getAll, getById, update, remove } from '../controllers/User.controller';
import { authenticate } from '../middlewares/Auth.middleware';
import { requireRole } from '../middlewares/Role.middleware';

const router = Router();

router.get('/',     authenticate, requireRole('superadmin'), getAll);
router.get('/:id',  authenticate, getById);
router.put('/:id',  authenticate, update);
router.delete('/:id', authenticate, requireRole('superadmin'), remove);

export default router;