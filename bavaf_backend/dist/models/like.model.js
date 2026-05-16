"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Like = void 0;
const sequelize_1 = require("sequelize");
const database_js_1 = require("../config/database.js");
const User_model_js_1 = require("./User.model.js");
const Song_model_js_1 = require("./Song.model.js");
class Like extends sequelize_1.Model {
}
exports.Like = Like;
Like.init({
    id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    song_id: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
}, {
    sequelize: database_js_1.sequelize,
    tableName: 'likes',
    modelName: 'Like',
    updatedAt: false,
    createdAt: 'created_at',
    indexes: [{ unique: true, fields: ['user_id', 'song_id'] }],
});
// Asociaciones
Like.belongsTo(User_model_js_1.User, { foreignKey: 'user_id', as: 'user' });
Like.belongsTo(Song_model_js_1.Song, { foreignKey: 'song_id', as: 'song' });
User_model_js_1.User.hasMany(Like, { foreignKey: 'user_id', as: 'likes' });
Song_model_js_1.Song.hasMany(Like, { foreignKey: 'song_id', as: 'likes' });
//# sourceMappingURL=Like.model.js.map