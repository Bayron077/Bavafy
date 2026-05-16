"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.sequelize = new sequelize_1.Sequelize(process.env.DB_NAME ?? 'bavafy_db', process.env.DB_USER ?? 'root', process.env.DB_PASSWORD ?? '12345678', {
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 3306),
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
        underscored: true, // snake_case en la BD
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
});
//# sourceMappingURL=database.js.map