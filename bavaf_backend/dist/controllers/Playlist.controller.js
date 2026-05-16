"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reorder = exports.removeSong = exports.addSong = exports.remove = exports.update = exports.create = exports.getById = exports.getMyPlaylists = void 0;
const playlist_model_1 = require("../models/playlist.model");
const Song_model_1 = require("../models/Song.model");
// GET /api/playlists  — playlists del usuario autenticado
const getMyPlaylists = async (req, res) => {
    const playlists = await playlist_model_1.Playlist.findAll({
        where: { user_id: req.user.id },
        order: [['created_at', 'DESC']],
    });
    res.json(playlists);
};
exports.getMyPlaylists = getMyPlaylists;
// GET /api/playlists/:id  — con canciones ordenadas por position
const getById = async (req, res) => {
    const playlist = await playlist_model_1.Playlist.findByPk(req.params['id'], {
        include: [{
                model: Song_model_1.Song,
                as: 'songs',
                through: { attributes: ['position', 'added_at'] },
            }],
    });
    if (!playlist) {
        res.status(404).json({ message: 'Playlist no encontrada' });
        return;
    }
    if (playlist.user_id !== req.user.id && req.user.role !== 'superadmin') {
        res.status(403).json({ message: 'No tienes acceso a esta playlist' });
        return;
    }
    res.json(playlist);
};
exports.getById = getById;
// POST /api/playlists
const create = async (req, res) => {
    const { name, description } = req.body;
    if (!name) {
        res.status(400).json({ message: 'El nombre de la playlist es requerido' });
        return;
    }
    const playlist = await playlist_model_1.Playlist.create({
        name,
        description: description ?? null,
        user_id: req.user.id,
    });
    res.status(201).json({ message: 'Playlist creada', playlist });
};
exports.create = create;
// PUT /api/playlists/:id
const update = async (req, res) => {
    const playlist = await playlist_model_1.Playlist.findByPk(req.params['id']);
    if (!playlist) {
        res.status(404).json({ message: 'Playlist no encontrada' });
        return;
    }
    if (playlist.user_id !== req.user.id) {
        res.status(403).json({ message: 'No puedes editar esta playlist' });
        return;
    }
    const { name, description } = req.body;
    await playlist.update({
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
    });
    res.json({ message: 'Playlist actualizada', playlist });
};
exports.update = update;
// DELETE /api/playlists/:id
const remove = async (req, res) => {
    const playlist = await playlist_model_1.Playlist.findByPk(req.params['id']);
    if (!playlist) {
        res.status(404).json({ message: 'Playlist no encontrada' });
        return;
    }
    if (playlist.user_id !== req.user.id) {
        res.status(403).json({ message: 'No puedes eliminar esta playlist' });
        return;
    }
    await playlist.destroy();
    res.json({ message: 'Playlist eliminada' });
};
exports.remove = remove;
// POST /api/playlists/:id/songs
const addSong = async (req, res) => {
    const playlist = await playlist_model_1.Playlist.findByPk(req.params['id']);
    if (!playlist) {
        res.status(404).json({ message: 'Playlist no encontrada' });
        return;
    }
    if (playlist.user_id !== req.user.id) {
        res.status(403).json({ message: 'No puedes modificar esta playlist' });
        return;
    }
    const { song_id, position } = req.body;
    if (!song_id) {
        res.status(400).json({ message: 'song_id es requerido' });
        return;
    }
    const song = await Song_model_1.Song.findByPk(song_id);
    if (!song) {
        res.status(404).json({ message: 'Canción no encontrada' });
        return;
    }
    const existing = await playlist_model_1.PlaylistSong.findOne({
        where: { playlist_id: playlist.id, song_id },
    });
    if (existing) {
        res.status(409).json({ message: 'La canción ya está en esta playlist' });
        return;
    }
    // Si no viene position, la ponemos al final
    let pos = position;
    if (pos === undefined) {
        const count = await playlist_model_1.PlaylistSong.count({ where: { playlist_id: playlist.id } });
        pos = count + 1;
    }
    await playlist_model_1.PlaylistSong.create({ playlist_id: playlist.id, song_id, position: pos });
    res.status(201).json({ message: 'Canción agregada a la playlist' });
};
exports.addSong = addSong;
// DELETE /api/playlists/:id/songs/:songId
const removeSong = async (req, res) => {
    const playlist = await playlist_model_1.Playlist.findByPk(req.params['id']);
    if (!playlist) {
        res.status(404).json({ message: 'Playlist no encontrada' });
        return;
    }
    if (playlist.user_id !== req.user.id) {
        res.status(403).json({ message: 'No puedes modificar esta playlist' });
        return;
    }
    const entry = await playlist_model_1.PlaylistSong.findOne({
        where: { playlist_id: playlist.id, song_id: Number(req.params['songId']) },
    });
    if (!entry) {
        res.status(404).json({ message: 'La canción no está en esta playlist' });
        return;
    }
    await entry.destroy();
    res.json({ message: 'Canción eliminada de la playlist' });
};
exports.removeSong = removeSong;
// PUT /api/playlists/:id/songs/reorder
const reorder = async (req, res) => {
    const playlist = await playlist_model_1.Playlist.findByPk(req.params['id']);
    if (!playlist) {
        res.status(404).json({ message: 'Playlist no encontrada' });
        return;
    }
    if (playlist.user_id !== req.user.id) {
        res.status(403).json({ message: 'No puedes modificar esta playlist' });
        return;
    }
    const { order } = req.body;
    if (!Array.isArray(order)) {
        res.status(400).json({ message: 'order debe ser un array' });
        return;
    }
    await Promise.all(order.map(({ song_id, position }) => playlist_model_1.PlaylistSong.update({ position }, { where: { playlist_id: playlist.id, song_id } })));
    res.json({ message: 'Playlist reordenada correctamente' });
};
exports.reorder = reorder;
//# sourceMappingURL=Playlist.controller.js.map