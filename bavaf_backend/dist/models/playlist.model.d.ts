import { Model, type Optional } from 'sequelize';
export interface PlaylistAttributes {
    id: number;
    name: string;
    description: string | null;
    user_id: number;
    created_at?: Date;
    updated_at?: Date;
}
type PlaylistCreationAttributes = Optional<PlaylistAttributes, 'id' | 'description'>;
export declare class Playlist extends Model<PlaylistAttributes, PlaylistCreationAttributes> implements PlaylistAttributes {
    id: number;
    name: string;
    description: string | null;
    user_id: number;
    created_at: Date;
    updated_at: Date;
}
export interface PlaylistSongAttributes {
    id: number;
    playlist_id: number;
    song_id: number;
    position: number;
    added_at?: Date;
}
type PlaylistSongCreationAttributes = Optional<PlaylistSongAttributes, 'id' | 'position'>;
export declare class PlaylistSong extends Model<PlaylistSongAttributes, PlaylistSongCreationAttributes> implements PlaylistSongAttributes {
    id: number;
    playlist_id: number;
    song_id: number;
    position: number;
    added_at: Date;
}
export {};
