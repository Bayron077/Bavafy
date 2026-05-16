import { Router } from 'express';
import { getAll, getById, search, create, update, remove } from '../controllers/Song.controller';
import { authenticate } from '../middlewares/Auth.middleware';
import { requireRole, upload } from '../middlewares/Role.middleware';

const router = Router();

// ⚠️ /search ANTES de /:id para que Express no lo interprete como un id
router.get('/search',  authenticate, search);
router.get('/',        authenticate, getAll);
router.get('/:id',     authenticate, getById);

router.post('/',
  authenticate,
  requireRole('superadmin'),
  upload.fields([{ name: 'file', maxCount: 1 }, { name: 'cover', maxCount: 1 }]),
  create
);

router.put('/:id',    authenticate, requireRole('superadmin'), update);
router.delete('/:id', authenticate, requireRole('superadmin'), remove);

export default router;