import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class Like extends Model {
  declare id: number;
  declare user_id: number;
  declare song_id: number;
}

Like.init(
  {
    id:      { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    song_id: { type: DataTypes.INTEGER, allowNull: false },
  },
  { sequelize, tableName: 'likes', timestamps: false }
);