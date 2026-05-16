"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Playlist_controller_1 = require("../controllers/Playlist.controller");
const Auth_middleware_1 = require("../middlewares/Auth.middleware");
const router = (0, express_1.Router)();
router.get('/', Auth_middleware_1.authenticate, Playlist_controller_1.getMyPlaylists);
router.get('/:id', Auth_middleware_1.authenticate, Playlist_controller_1.getById);
router.post('/', Auth_middleware_1.authenticate, Playlist_controller_1.create);
router.put('/:id', Auth_middleware_1.authenticate, Playlist_controller_1.update);
router.delete('/:id', Auth_middleware_1.authenticate, Playlist_controller_1.remove);
router.post('/:id/songs', Auth_middleware_1.authenticate, Playlist_controller_1.addSong);
router.delete('/:id/songs/:songId', Auth_middleware_1.authenticate, Playlist_controller_1.removeSong);
router.put('/:id/songs/reorder', Auth_middleware_1.authenticate, Playlist_controller_1.reorder);
exports.default = router;
//# sourceMappingURL=Playlist.routes.js.map