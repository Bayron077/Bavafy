import type { Request, Response, NextFunction } from 'express';
export interface JwtPayload {
    id: number;
    email: string;
    role: 'superadmin' | 'user';
}
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => void;
