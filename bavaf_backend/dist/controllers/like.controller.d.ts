import type { Request, Response } from 'express';
export declare const getMyLikes: (req: Request, res: Response) => Promise<void>;
export declare const addLike: (req: Request, res: Response) => Promise<void>;
export declare const removeLike: (req: Request, res: Response) => Promise<void>;
