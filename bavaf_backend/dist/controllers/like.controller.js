"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeLike = exports.addLike = exports.getMyLikes = void 0;
const Like_model_js_1 = require("../models/Like.model.js");
const Song_model_js_1 = require("../models/Song.model.js");
// GET /api/likes  — likes del usuario autenticado
const getMyLikes = async (req, res) => {
    const likes = await Like_model_js_1.Like.findAll({
        where: { user_id: req.user.id },
        attributes: ['id', 'song_id', 'created_at'],
        order: [['created_at', 'DESC']],
    });
    res.json({ likes });
};
exports.getMyLikes = getMyLikes;
// POST /api/likes/:songId  — dar like
const addLike = async (req, res) => {
    const songId = Number(req.params['songId']);
    const song = await Song_model_js_1.Song.findByPk(songId);
    if (!song) {
        res.status(404).json({ message: 'Canción no encontrada' });
        return;
    }
    const existing = await Like_model_js_1.Like.findOne({
        where: { user_id: req.user.id, song_id: songId },
    });
    if (existing) {
        res.status(409).json({ message: 'Ya le diste like a esta canción' });
        return;
    }
    await Like_model_js_1.Like.create({ user_id: req.user.id, song_id: songId });
    res.status(201).json({ message: 'Like agregado' });
};
exports.addLike = addLike;
// DELETE /api/likes/:songId  — quitar like
const removeLike = async (req, res) => {
    const songId = Number(req.params['songId']);
    const like = await Like_model_js_1.Like.findOne({
        where: { user_id: req.user.id, song_id: songId },
    });
    if (!like) {
        res.status(404).json({ message: 'Like no encontrado' });
        return;
    }
    await like.destroy();
    res.json({ message: 'Like eliminado' });
};
exports.removeLike = removeLike;
//# sourceMappingURL=Like.controller.js.map