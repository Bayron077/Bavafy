import { DataTypes, Model, type Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { User } from './User.model';

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

export class Song extends Model<SongAttributes, SongCreationAttributes>
    implements SongAttributes {
    declare id: number;
    declare title: string;
    declare artist: string;
    declare album: string | null;
    declare genre: string | null;
    declare duration_sec: number;
    declare file_path: string;
    declare cover_url: string | null;
    declare uploaded_by: number;
    declare created_at: Date;
}

Song.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        title: { type: DataTypes.STRING(200), allowNull: false },
        artist: { type: DataTypes.STRING(150), allowNull: false },
        album: { type: DataTypes.STRING(150), allowNull: true },
        genre: { type: DataTypes.STRING(80), allowNull: true },
        duration_sec: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
        file_path: { type: DataTypes.STRING(500), allowNull: false },
        cover_url: { type: DataTypes.STRING(500), allowNull: true },
        uploaded_by: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
        sequelize,
        tableName: 'songs',
        modelName: 'Song',
        updatedAt: false,   // songs no tiene updated_at
    }
);

// Relación: una canción pertenece a un usuario (superadmin que la subió)
Song.belongsTo(User, { foreignKey: 'uploaded_by', as: 'uploader' });
User.hasMany(Song, { foreignKey: 'uploaded_by', as: 'songs' });