"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.me = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_model_1 = require("../models/User.model");
const JWT_SECRET = process.env.JWT_SECRET ?? 'secret';
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN ?? '7d';
// POST /api/auth/register
const register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        res.status(400).json({ message: 'name, email y password son requeridos' });
        return;
    }
    const existing = await User_model_1.User.findOne({ where: { email } });
    if (existing) {
        res.status(409).json({ message: 'El email ya está registrado' });
        return;
    }
    const password_hash = await bcryptjs_1.default.hash(password, 10);
    const user = await User_model_1.User.create({ name, email, password_hash });
    res.status(201).json({
        message: 'Usuario registrado correctamente',
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
};
exports.register = register;
// POST /api/auth/login
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ message: 'email y password son requeridos' });
        return;
    }
    const user = await User_model_1.User.findOne({ where: { email } });
    if (!user) {
        res.status(401).json({ message: 'Credenciales inválidas' });
        return;
    }
    const valid = await bcryptjs_1.default.compare(password, user.password_hash);
    if (!valid) {
        res.status(401).json({ message: 'Credenciales inválidas' });
        return;
    }
    const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    res.json({
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
};
exports.login = login;
// GET /api/auth/me
const me = async (req, res) => {
    const user = await User_model_1.User.findByPk(req.user.id, {
        attributes: { exclude: ['password_hash'] },
    });
    if (!user) {
        res.status(404).json({ message: 'Usuario no encontrado' });
        return;
    }
    res.json(user);
};
exports.me = me;
// POST /api/auth/logout  (stateless: el cliente elimina el token)
const logout = (_req, res) => {
    res.json({ message: 'Sesión cerrada correctamente' });
};
exports.logout = logout;
//# sourceMappingURL=Auth.controller.js.map