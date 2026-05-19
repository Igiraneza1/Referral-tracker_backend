"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateReferral = void 0;
const express_validator_1 = require("express-validator");
exports.validateReferral = [
    (0, express_validator_1.body)('patientId')
        .notEmpty()
        .withMessage('Patient ID is required'),
    (0, express_validator_1.body)('patientName')
        .notEmpty()
        .withMessage('Patient name is required'),
    (0, express_validator_1.body)('referringFacility')
        .notEmpty()
        .withMessage('Referring facility is required'),
    (0, express_validator_1.body)('receivingFacility')
        .notEmpty()
        .withMessage('Receiving facility is required'),
    (0, express_validator_1.body)('reason')
        .notEmpty()
        .withMessage('Reason for referral is required'),
    (0, express_validator_1.body)('referralDate')
        .notEmpty()
        .withMessage('Referral date is required')
        .isDate()
        .withMessage('Referral date must be a valid date eg. 2026-05-14'),
];
