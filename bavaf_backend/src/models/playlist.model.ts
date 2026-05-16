import { DataTypes, Model, type Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { User } from './User.model';
import { Song } from './Song.model';

// ── Playlist ──────────────────────────────────────────────────
export interface PlaylistAttributes {
    id: number;
    name: string;
    description: string | null;
    user_id: number;
    created_at?: Date;
    updated_at?: Date;
}

type PlaylistCreationAttributes = Optional<PlaylistAttributes, 'id' | 'description'>;

export class Playlist extends Model<PlaylistAttributes, PlaylistCreationAttributes>
    implements PlaylistAttributes {
    declare id: number;
    declare name: string;
    declare description: string | null;
    declare user_id: number;
    declare created_at: Date;
    declare updated_at: Date;
}

Playlist.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING(150), allowNull: false },
        description: { type: DataTypes.STRING(500), allowNull: true },
        user_id: { type: DataTypes.INTEGER, allowNull: false },
    },
    { sequelize, tableName: 'playlists', modelName: 'Playlist' }
);

// ── PlaylistSong (tabla intermedia) ───────────────────────────
export interface PlaylistSongAttributes {
    id: number;
    playlist_id: number;
    song_id: number;
    position: number;
    added_at?: Date;
}

type PlaylistSongCreationAttributes = Optional<PlaylistSongAttributes, 'id' | 'position'>;

export class PlaylistSong extends Model<PlaylistSongAttributes, PlaylistSongCreationAttributes>
    implements PlaylistSongAttributes {
    declare id: number;
    declare playlist_id: number;
    declare song_id: number;
    declare position: number;
    declare added_at: Date;
}

PlaylistSong.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        playlist_id: { type: DataTypes.INTEGER, allowNull: false },
        song_id: { type: DataTypes.INTEGER, allowNull: false },
        position: { type: DataTypes.SMALLINT, allowNull: false, defaultValue: 0 },
    },
    {
        sequelize,
        tableName: 'playlist_songs',
        modelName: 'PlaylistSong',
        updatedAt: false,
        createdAt: 'added_at',
    }
);

// ── Asociaciones ──────────────────────────────────────────────
Playlist.belongsTo(User, { foreignKey: 'user_id', as: 'owner' });
User.hasMany(Playlist, { foreignKey: 'user_id', as: 'playlists' });

Playlist.belongsToMany(Song, {
    through: PlaylistSong,
    foreignKey: 'playlist_id',
    otherKey: 'song_id',
    as: 'songs',
});

Song.belongsToMany(Playlist, {
    through: PlaylistSong,
    foreignKey: 'song_id',
    otherKey: 'playlist_id',
    as: 'playlists',
});