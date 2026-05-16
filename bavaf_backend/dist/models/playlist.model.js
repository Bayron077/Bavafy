"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaylistSong = exports.Playlist = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const User_model_1 = require("./User.model");
const Song_model_1 = require("./Song.model");
class Playlist extends sequelize_1.Model {
}
exports.Playlist = Playlist;
Playlist.init({
    id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: sequelize_1.DataTypes.STRING(150), allowNull: false },
    description: { type: sequelize_1.DataTypes.STRING(500), allowNull: true },
    user_id: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
}, { sequelize: database_1.sequelize, tableName: 'playlists', modelName: 'Playlist' });
class PlaylistSong extends sequelize_1.Model {
}
exports.PlaylistSong = PlaylistSong;
PlaylistSong.init({
    id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    playlist_id: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    song_id: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    position: { type: sequelize_1.DataTypes.SMALLINT, allowNull: false, defaultValue: 0 },
}, {
    sequelize: database_1.sequelize,
    tableName: 'playlist_songs',
    modelName: 'PlaylistSong',
    updatedAt: false,
    createdAt: 'added_at',
});
// ── Asociaciones ──────────────────────────────────────────────
Playlist.belongsTo(User_model_1.User, { foreignKey: 'user_id', as: 'owner' });
User_model_1.User.hasMany(Playlist, { foreignKey: 'user_id', as: 'playlists' });
Playlist.belongsToMany(Song_model_1.Song, {
    through: PlaylistSong,
    foreignKey: 'playlist_id',
    otherKey: 'song_id',
    as: 'songs',
});
Song_model_1.Song.belongsToMany(Playlist, {
    through: PlaylistSong,
    foreignKey: 'song_id',
    otherKey: 'playlist_id',
    as: 'playlists',
});
//# sourceMappingURL=playlist.model.js.map