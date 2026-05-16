"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const database_1 = require("./config/database");
const Auth_routes_1 = __importDefault(require("./routes/Auth.routes"));
const User_routes_1 = __importDefault(require("./routes/User.routes"));
const Song_routes_1 = __importDefault(require("./routes/Song.routes"));
const Playlist_routes_1 = __importDefault(require("./routes/Playlist.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT ?? 3000;
// ── Middlewares globales ──────────────────────────────────────
app.use((0, cors_1.default)({ origin: process.env.FRONTEND_URL ?? 'http://localhost:4200' }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// ── Archivos estáticos (audio, covers, avatars) ───────────────
app.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), 'uploads')));
// ── Rutas ─────────────────────────────────────────────────────
app.use('/api/auth', Auth_routes_1.default);
app.use('/api/users', User_routes_1.default);
app.use('/api/songs', Song_routes_1.default);
app.use('/api/playlists', Playlist_routes_1.default);
// ── Health check ──────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// ── Conexión DB + arranque ────────────────────────────────────
database_1.sequelize
    .authenticate()
    .then(() => {
    console.log('Conectado a MySQL');
    return database_1.sequelize.sync({ alter: false });
})
    .then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
})
    .catch((err) => {
    console.error('Error conectando a la BD:', err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map