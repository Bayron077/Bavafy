import type { Request, Response } from 'express';
export declare const getMyPlaylists: (req: Request, res: Response) => Promise<void>;
export declare const getById: (req: Request, res: Response) => Promise<void>;
export declare const create: (req: Request, res: Response) => Promise<void>;
export declare const update: (req: Request, res: Response) => Promise<void>;
export declare const remove: (req: Request, res: Response) => Promise<void>;
export declare const addSong: (req: Request, res: Response) => Promise<void>;
export declare const removeSong: (req: Request, res: Response) => Promise<void>;
export declare const reorder: (req: Request, res: Response) => Promise<void>;
