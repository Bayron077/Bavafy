import { DataTypes, Model, type Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface UserAttributes {
    id: number;
    name: string;
    email: string;
    password_hash: string;
    role: 'superadmin' | 'user';
    avatar_url: string | null;
    created_at?: Date;
    updated_at?: Date;
}

type UserCreationAttributes = Optional<UserAttributes, 'id' | 'role' | 'avatar_url'>;

export class User extends Model<UserAttributes, UserCreationAttributes>
    implements UserAttributes {
    declare id: number;
    declare name: string;
    declare email: string;
    declare password_hash: string;
    declare role: 'superadmin' | 'user';
    declare avatar_url: string | null;
    declare created_at: Date;
    declare updated_at: Date;
}

User.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING(100), allowNull: false },
        email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
        password_hash: { type: DataTypes.STRING(255), allowNull: false },
        role: { type: DataTypes.ENUM('superadmin', 'user'), allowNull: false, defaultValue: 'user' },
        avatar_url: { type: DataTypes.STRING(500), allowNull: true },
    },
    {
        sequelize,
        tableName: 'users',
        modelName: 'User',
    }
);
