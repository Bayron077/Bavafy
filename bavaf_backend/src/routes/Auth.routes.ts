// ── auth.routes.ts ────────────────────────────────────────────
import { Router } from 'express';
import { register, login, me, logout } from '../controllers/Auth.controller';
import { authenticate } from '../middlewares/Auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login',    login);
router.post('/logout',   authenticate, logout);
router.get('/me',        authenticate, me);

export default router;