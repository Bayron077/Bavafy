import type { Request, Response, NextFunction } from 'express';
import multer from 'multer';
export declare const requireRole: (...roles: ("superadmin" | "user")[]) => (req: Request, res: Response, next: NextFunction) => void;
export declare const upload: multer.Multer;
