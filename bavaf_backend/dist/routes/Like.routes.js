"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Like_controller_js_1 = require("../controllers/Like.controller.js");
const Auth_middleware_js_1 = require("../middlewares/Auth.middleware.js");
const router = (0, express_1.Router)();
router.get('/', Auth_middleware_js_1.authenticate, Like_controller_js_1.getMyLikes);
router.post('/:songId', Auth_middleware_js_1.authenticate, Like_controller_js_1.addLike);
router.delete('/:songId', Auth_middleware_js_1.authenticate, Like_controller_js_1.removeLike);
exports.default = router;
//# sourceMappingURL=Like.routes.js.map