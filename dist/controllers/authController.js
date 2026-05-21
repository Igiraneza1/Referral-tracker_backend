"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.createUser = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sequelize_1 = require("sequelize");
const User_1 = __importDefault(require("../models/User"));
// PUBLIC REGISTER
// only creates REFERRAL_OFFICER and VIEWER
const register = async (req, res) => {
    try {
        const { fullName, username, email, password, role, facility } = req.body;
        // only these two roles can self register
        const allowedPublicRoles = ['REFERRAL_OFFICER', 'VIEWER'];
        if (!allowedPublicRoles.includes(role)) {
            return res.status(403).json({
                message: 'You cannot self register with this role. Contact your administrator.',
            });
        }
        const existingUser = await User_1.default.findOne({
            where: { [sequelize_1.Op.or]: [{ email }, { username }] },
        });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await User_1.default.create({
            fullName,
            username,
            email,
            password: hashedPassword,
            role,
            facility,
        });
        return res.status(201).json({
            message: 'Account created successfully',
            user: {
                id: user.id,
                fullName: user.fullName,
                username: user.username,
                email: user.email,
                role: user.role,
                facility: user.facility,
                isActive: user.isActive,
            },
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};
exports.register = register;
// PROTECTED CREATE USER
// ADMIN + DEVELOPER → can create any role
// FACILITY_ADMIN    → can only create REFERRAL_OFFICER for their facility
const createUser = async (req, res) => {
    try {
        const { fullName, username, email, password, role, facility } = req.body;
        const requestingUser = req.user;
        if (!requestingUser) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        // FACILITY_ADMIN rules
        if (requestingUser.role === 'FACILITY_ADMIN') {
            // can only create REFERRAL_OFFICER
            if (role !== 'REFERRAL_OFFICER') {
                return res.status(403).json({
                    message: 'Facility Admin can only create Referral Officer accounts',
                });
            }
            // can only create users for their own facility
            if (facility !== requestingUser.facility) {
                return res.status(403).json({
                    message: 'You can only create users for your own facility',
                });
            }
        }
        // ADMIN + DEVELOPER can create any role — no extra checks needed
        const existingUser = await User_1.default.findOne({
            where: { [sequelize_1.Op.or]: [{ email }, { username }] },
        });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await User_1.default.create({
            fullName,
            username,
            email,
            password: hashedPassword,
            role,
            facility,
        });
        return res.status(201).json({
            message: 'User created successfully',
            user: {
                id: user.id,
                fullName: user.fullName,
                username: user.username,
                email: user.email,
                role: user.role,
                facility: user.facility,
                isActive: user.isActive,
            },
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};
exports.createUser = createUser;
// LOGIN
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User_1.default.findOne({ where: { username } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        if (!user.isActive) {
            return res.status(403).json({ message: 'Account deactivated' });
        }
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
            role: user.role,
            facility: user.facility,
        }, process.env.JWT_SECRET, { expiresIn: '7d' });
        return res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                fullName: user.fullName,
                username: user.username,
                email: user.email,
                role: user.role,
                facility: user.facility,
            },
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};
exports.login = login;
