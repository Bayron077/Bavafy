import { DataTypes, Model, type Optional } from 'sequelize';
import { sequelize } from '../config/database.js';
import { User } from './User.model.js';
import { Song } from './Song.model.js';

export interface LikeAttributes {
  id:         number;
  user_id:    number;
  song_id:    number;
  created_at?: Date;
}

type LikeCreationAttributes = Optional<LikeAttributes, 'id'>;

export class Like extends Model<LikeAttributes, LikeCreationAttributes>
  implements LikeAttributes {
  declare id:         number;
  declare user_id:    number;
  declare song_id:    number;
  declare created_at: Date;
}

Like.init(
  {
    id:      { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    song_id: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    sequelize,
    tableName: 'likes',
    modelName: 'Like',
    updatedAt: false,
    createdAt: 'created_at',
    indexes: [{ unique: true, fields: ['user_id', 'song_id'] }],
  }
);

// Asociaciones
Like.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Like.belongsTo(Song, { foreignKey: 'song_id', as: 'song' });
User.hasMany(Like,   { foreignKey: 'user_id', as: 'likes' });
Song.hasMany(Like,   { foreignKey: 'song_id', as: 'likes' });