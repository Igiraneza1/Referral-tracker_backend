"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReferralStatus = exports.getReferralById = exports.getAllReferrals = exports.createReferral = void 0;
const express_validator_1 = require("express-validator");
const Referral_1 = __importDefault(require("../models/Referral"));
const VALID_STATUSES = [
    'pending',
    'accepted',
    'attended',
    'feedback_received',
    'closed',
];
const createReferral = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const { patientId, patientName, referringFacility, receivingFacility, reason, notes, referralDate, } = req.body;
        const referral = await Referral_1.default.create({
            patientId,
            patientName,
            referringFacility,
            receivingFacility,
            reason,
            notes,
            referralDate,
        });
        res.status(201).json(referral);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to create referral', error });
    }
};
exports.createReferral = createReferral;
const getAllReferrals = async (req, res) => {
    try {
        const referrals = await Referral_1.default.findAll();
        res.status(200).json(referrals);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch referrals', error });
    }
};
exports.getAllReferrals = getAllReferrals;
const getReferralById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: 'Invalid referral ID' });
            return;
        }
        const referral = await Referral_1.default.findByPk(id);
        if (!referral) {
            res.status(404).json({ message: 'Referral not found' });
            return;
        }
        res.status(200).json(referral);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch referral', error });
    }
};
exports.getReferralById = getReferralById;
const updateReferralStatus = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { status } = req.body;
        if (isNaN(id)) {
            res.status(400).json({ message: 'Invalid referral ID' });
            return;
        }
        if (!VALID_STATUSES.includes(status)) {
            res.status(400).json({ message: 'Invalid status value' });
            return;
        }
        const referral = await Referral_1.default.findByPk(id);
        if (!referral) {
            res.status(404).json({ message: 'Referral not found' });
            return;
        }
        referral.status = status;
        await referral.save();
        res.status(200).json(referral);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to update status', error });
    }
};
exports.updateReferralStatus = updateReferralStatus;
