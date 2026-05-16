"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ── auth.routes.ts ────────────────────────────────────────────
const express_1 = require("express");
const Auth_controller_1 = require("../controllers/Auth.controller");
const Auth_middleware_1 = require("../middlewares/Auth.middleware");
const router = (0, express_1.Router)();
router.post('/register', Auth_controller_1.register);
router.post('/login', Auth_controller_1.login);
router.post('/logout', Auth_middleware_1.authenticate, Auth_controller_1.logout);
router.get('/me', Auth_middleware_1.authenticate, Auth_controller_1.me);
exports.default = router;
//# sourceMappingURL=Auth.routes.js.map