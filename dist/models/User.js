"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
// 3. The Sequelize model class
class User extends sequelize_1.Model {
}
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    fullName: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    username: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: true },
    email: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: true },
    password: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    role: {
        type: sequelize_1.DataTypes.ENUM('ADMIN', 'DEVELOPER', 'FACILITY_ADMIN', 'REFERRAL_OFFICER', 'VIEWER'),
        allowNull: false,
    },
    facility: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    isActive: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
}, {
    sequelize: database_1.default,
    tableName: 'users',
    timestamps: true,
});
exports.default = User;
