"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class Referral extends sequelize_1.Model {
}
Referral.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    patientId: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    patientName: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    referringFacility: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    receivingFacility: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    reason: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
    status: {
        type: sequelize_1.DataTypes.ENUM('pending', 'accepted', 'attended', 'feedback_received', 'closed'),
        allowNull: false,
        defaultValue: 'pending',
    },
    notes: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
    referralDate: { type: sequelize_1.DataTypes.DATEONLY, allowNull: false },
}, {
    sequelize: database_1.default,
    tableName: 'referrals',
    timestamps: true,
});
exports.default = Referral;
