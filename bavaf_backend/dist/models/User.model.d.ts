import { Model, type Optional } from 'sequelize';
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
export declare class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    id: number;
    name: string;
    email: string;
    password_hash: string;
    role: 'superadmin' | 'user';
    avatar_url: string | null;
    created_at: Date;
    updated_at: Date;
}
export {};
