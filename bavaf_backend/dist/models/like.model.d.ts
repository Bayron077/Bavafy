import { Model, type Optional } from 'sequelize';
export interface LikeAttributes {
    id: number;
    user_id: number;
    song_id: number;
    created_at?: Date;
}
type LikeCreationAttributes = Optional<LikeAttributes, 'id'>;
export declare class Like extends Model<LikeAttributes, LikeCreationAttributes> implements LikeAttributes {
    id: number;
    user_id: number;
    song_id: number;
    created_at: Date;
}
export {};
