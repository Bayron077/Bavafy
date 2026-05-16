"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class User extends sequelize_1.Model {
}
exports.User = User;
User.init({
    id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: sequelize_1.DataTypes.STRING(100), allowNull: false },
    email: { type: sequelize_1.DataTypes.STRING(150), allowNull: false, unique: true },
    password_hash: { type: sequelize_1.DataTypes.STRING(255), allowNull: false },
    role: { type: sequelize_1.DataTypes.ENUM('superadmin', 'user'), allowNull: false, defaultValue: 'user' },
    avatar_url: { type: sequelize_1.DataTypes.STRING(500), allowNull: true },
}, {
    sequelize: database_1.sequelize,
    tableName: 'users',
    modelName: 'User',
});
//# sourceMappingURL=User.model.js.map