import { Model, type Optional } from 'sequelize';
export interface SongAttributes {
    id: number;
    title: string;
    artist: string;
    album: string | null;
    genre: string | null;
    duration_sec: number;
    file_path: string;
    cover_url: string | null;
    uploaded_by: number;
    created_at?: Date;
}
type SongCreationAttributes = Optional<SongAttributes, 'id' | 'album' | 'genre' | 'cover_url'>;
export declare class Song extends Model<SongAttributes, SongCreationAttributes> implements SongAttributes {
    id: number;
    title: string;
    artist: string;
    album: string | null;
    genre: string | null;
    duration_sec: number;
    file_path: string;
    cover_url: string | null;
    uploaded_by: number;
    created_at: Date;
}
export {};
