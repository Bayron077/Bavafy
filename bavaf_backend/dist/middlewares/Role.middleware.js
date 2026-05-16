"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.requireRole = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// ── Role guard ────────────────────────────────────────────────
const requireRole = (...roles) => (req, res, next) => {
    if (!req.user) {
        res.status(401).json({ message: 'No autenticado' });
        return;
    }
    if (!roles.includes(req.user.role)) {
        res.status(403).json({ message: 'No tienes permisos para esta acción' });
        return;
    }
    next();
};
exports.requireRole = requireRole;
// ── Multer storage ────────────────────────────────────────────
const storage = multer_1.default.diskStorage({
    destination: (_req, file, cb) => {
        let folder = 'uploads/others';
        if (file.fieldname === 'file')
            folder = 'uploads/songs';
        if (file.fieldname === 'cover')
            folder = 'uploads/covers';
        if (file.fieldname === 'avatar')
            folder = 'uploads/avatars';
        // Crea la carpeta si no existe
        fs_1.default.mkdirSync(folder, { recursive: true });
        cb(null, folder);
    },
    filename: (_req, file, cb) => {
        const ext = path_1.default.extname(file.originalname);
        const basename = path_1.default.basename(file.originalname, ext)
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');
        const unique = `${Date.now()}-${basename}${ext}`;
        cb(null, unique);
    },
});
const fileFilter = (_req, file, cb) => {
    const allowedAudio = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'];
    const allowedImage = ['image/jpeg', 'image/png', 'image/webp'];
    if (file.fieldname === 'file' && !allowedAudio.includes(file.mimetype)) {
        cb(new Error('Solo se permiten archivos de audio (mp3, wav, ogg)'));
        return;
    }
    if ((file.fieldname === 'cover' || file.fieldname === 'avatar') && !allowedImage.includes(file.mimetype)) {
        cb(new Error('Solo se permiten imágenes (jpg, png, webp)'));
        return;
    }
    cb(null, true);
};
const MAX_MB = Number(process.env.MAX_FILE_SIZE_MB ?? 20);
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: MAX_MB * 1024 * 1024 },
});
//# sourceMappingURL=Role.middleware.js.map