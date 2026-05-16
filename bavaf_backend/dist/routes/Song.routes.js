"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Song_controller_1 = require("../controllers/Song.controller");
const Auth_middleware_1 = require("../middlewares/Auth.middleware");
const Role_middleware_1 = require("../middlewares/Role.middleware");
const router = (0, express_1.Router)();
// ⚠️ /search ANTES de /:id para que Express no lo interprete como un id
router.get('/search', Auth_middleware_1.authenticate, Song_controller_1.search);
router.get('/', Auth_middleware_1.authenticate, Song_controller_1.getAll);
router.get('/:id', Auth_middleware_1.authenticate, Song_controller_1.getById);
router.post('/', Auth_middleware_1.authenticate, (0, Role_middleware_1.requireRole)('superadmin'), Role_middleware_1.upload.fields([{ name: 'file', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), Song_controller_1.create);
router.put('/:id', Auth_middleware_1.authenticate, (0, Role_middleware_1.requireRole)('superadmin'), Song_controller_1.update);
router.delete('/:id', Auth_middleware_1.authenticate, (0, Role_middleware_1.requireRole)('superadmin'), Song_controller_1.remove);
exports.default = router;
//# sourceMappingURL=Song.routes.js.map