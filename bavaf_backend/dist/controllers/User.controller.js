"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.getById = exports.getAll = void 0;
const User_model_1 = require("../models/User.model");
// GET /api/users  (solo superadmin)
const getAll = async (_req, res) => {
    const users = await User_model_1.User.findAll({
        attributes: { exclude: ['password_hash'] },
        order: [['created_at', 'DESC']],
    });
    res.json(users);
};
exports.getAll = getAll;
// GET /api/users/:id
const getById = async (req, res) => {
    const { id } = req.params;
    // Un user solo puede ver su propio perfil
    if (req.user.role === 'user' && req.user.id !== Number(id)) {
        res.status(403).json({ message: 'No tienes permisos para ver este perfil' });
        return;
    }
    const user = await User_model_1.User.findByPk(id, {
        attributes: { exclude: ['password_hash'] },
    });
    if (!user) {
        res.status(404).json({ message: 'Usuario no encontrado' });
        return;
    }
    res.json(user);
};
exports.getById = getById;
// PUT /api/users/:id
const update = async (req, res) => {
    const { id } = req.params;
    // Un user solo puede editar su propio perfil
    if (req.user.role === 'user' && req.user.id !== Number(id)) {
        res.status(403).json({ message: 'No puedes editar el perfil de otro usuario' });
        return;
    }
    const user = await User_model_1.User.findByPk(id);
    if (!user) {
        res.status(404).json({ message: 'Usuario no encontrado' });
        return;
    }
    const { name, avatar_url } = req.body;
    await user.update({
        ...(name !== undefined && { name }),
        ...(avatar_url !== undefined && { avatar_url }),
    });
    res.json({
        message: 'Perfil actualizado',
        user: { id: user.id, name: user.name, email: user.email, avatar_url: user.avatar_url },
    });
};
exports.update = update;
// DELETE /api/users/:id  (solo superadmin)
const remove = async (req, res) => {
    const user = await User_model_1.User.findByPk(req.params['id']);
    if (!user) {
        res.status(404).json({ message: 'Usuario no encontrado' });
        return;
    }
    await user.destroy();
    res.json({ message: 'Usuario eliminado' });
};
exports.remove = remove;
//# sourceMappingURL=User.controller.js.map