"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Song = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const User_model_1 = require("./User.model");
class Song extends sequelize_1.Model {
}
exports.Song = Song;
Song.init({
    id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: sequelize_1.DataTypes.STRING(200), allowNull: false },
    artist: { type: sequelize_1.DataTypes.STRING(150), allowNull: false },
    album: { type: sequelize_1.DataTypes.STRING(150), allowNull: true },
    genre: { type: sequelize_1.DataTypes.STRING(80), allowNull: true },
    duration_sec: { type: sequelize_1.DataTypes.INTEGER.UNSIGNED, allowNull: false },
    file_path: { type: sequelize_1.DataTypes.STRING(500), allowNull: false },
    cover_url: { type: sequelize_1.DataTypes.STRING(500), allowNull: true },
    uploaded_by: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
}, {
    sequelize: database_1.sequelize,
    tableName: 'songs',
    modelName: 'Song',
    updatedAt: false, // songs no tiene updated_at
});
// Relación: una canción pertenece a un usuario (superadmin que la subió)
Song.belongsTo(User_model_1.User, { foreignKey: 'uploaded_by', as: 'uploader' });
User_model_1.User.hasMany(Song, { foreignKey: 'uploaded_by', as: 'songs' });
//# sourceMappingURL=Song.model.js.map