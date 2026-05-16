"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_controller_1 = require("../controllers/User.controller");
const Auth_middleware_1 = require("../middlewares/Auth.middleware");
const Role_middleware_1 = require("../middlewares/Role.middleware");
const router = (0, express_1.Router)();
router.get('/', Auth_middleware_1.authenticate, (0, Role_middleware_1.requireRole)('superadmin'), User_controller_1.getAll);
router.get('/:id', Auth_middleware_1.authenticate, User_controller_1.getById);
router.put('/:id', Auth_middleware_1.authenticate, User_controller_1.update);
router.delete('/:id', Auth_middleware_1.authenticate, (0, Role_middleware_1.requireRole)('superadmin'), User_controller_1.remove);
exports.default = router;
//# sourceMappingURL=User.routes.js.map