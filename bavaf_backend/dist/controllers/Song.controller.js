"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.create = exports.getById = exports.search = exports.getAll = void 0;
const sequelize_1 = require("sequelize");
const Song_model_1 = require("../models/Song.model");
const User_model_1 = require("../models/User.model");
const fs_1 = __importDefault(require("fs"));
// GET /api/songs
const getAll = async (req, res) => {
    const { genre, artist, limit = '50', offset = '0' } = req.query;
    const where = {};
    if (genre)
        where['genre'] = genre;
    if (artist)
        where['artist'] = { [sequelize_1.Op.like]: `%${artist}%` };
    const { count, rows } = await Song_model_1.Song.findAndCountAll({
        where,
        limit: Number(limit),
        offset: Number(offset),
        order: [['created_at', 'DESC']],
        include: [{ model: User_model_1.User, as: 'uploader', attributes: ['id', 'name'] }],
    });
    res.json({ total: count, songs: rows });
};
exports.getAll = getAll;
// GET /api/songs/search?q=
const search = async (req, res) => {
    const q = req.query['q'] ?? '';
    if (!q.trim()) {
        res.status(400).json({ message: 'El parámetro q es requerido' });
        return;
    }
    const results = await Song_model_1.Song.findAll({
        where: {
            [sequelize_1.Op.or]: [
                { title: { [sequelize_1.Op.like]: `%${q}%` } },
                { artist: { [sequelize_1.Op.like]: `%${q}%` } },
                { genre: { [sequelize_1.Op.like]: `%${q}%` } },
                { album: { [sequelize_1.Op.like]: `%${q}%` } },
            ],
        },
        order: [['title', 'ASC']],
    });
    res.json({ query: q, results });
};
exports.search = search;
// GET /api/songs/:id
const getById = async (req, res) => {
    const song = await Song_model_1.Song.findByPk(req.params['id'], {
        include: [{ model: User_model_1.User, as: 'uploader', attributes: ['id', 'name'] }],
    });
    if (!song) {
        res.status(404).json({ message: 'Canción no encontrada' });
        return;
    }
    res.json(song);
};
exports.getById = getById;
// POST /api/songs  (superadmin, multipart)
const create = async (req, res) => {
    const { title, artist, album, genre, duration_sec } = req.body;
    if (!title || !artist || !duration_sec) {
        res.status(400).json({ message: 'title, artist y duration_sec son requeridos' });
        return;
    }
    const files = req.files;
    const audioFile = files?.['file']?.[0];
    if (!audioFile) {
        res.status(400).json({ message: 'El archivo de audio es requerido' });
        return;
    }
    const coverFile = files?.['cover']?.[0];
    const song = await Song_model_1.Song.create({
        title,
        artist,
        album: album ?? null,
        genre: genre ?? null,
        duration_sec: Number(duration_sec),
        file_path: audioFile.path.replace(/\\/g, '/'),
        cover_url: coverFile ? coverFile.path.replace(/\\/g, '/') : null,
        uploaded_by: req.user.id,
    });
    res.status(201).json({ message: 'Canción subida correctamente', song });
};
exports.create = create;
// PUT /api/songs/:id  (superadmin)
const update = async (req, res) => {
    const song = await Song_model_1.Song.findByPk(req.params['id']);
    if (!song) {
        res.status(404).json({ message: 'Canción no encontrada' });
        return;
    }
    const { title, artist, album, genre } = req.body;
    await song.update({
        ...(title !== undefined && { title }),
        ...(artist !== undefined && { artist }),
        ...(album !== undefined && { album }),
        ...(genre !== undefined && { genre }),
    });
    res.json({ message: 'Canción actualizada', song });
};
exports.update = update;
// DELETE /api/songs/:id  (superadmin)
const remove = async (req, res) => {
    const song = await Song_model_1.Song.findByPk(req.params['id']);
    if (!song) {
        res.status(404).json({ message: 'Canción no encontrada' });
        return;
    }
    // Eliminar el archivo físico del disco
    if (fs_1.default.existsSync(song.file_path))
        fs_1.default.unlinkSync(song.file_path);
    if (song.cover_url && fs_1.default.existsSync(song.cover_url))
        fs_1.default.unlinkSync(song.cover_url);
    await song.destroy();
    res.json({ message: 'Canción eliminada' });
};
exports.remove = remove;
//# sourceMappingURL=Song.controller.js.map