import { body } from 'express-validator';
export const validateReferral = [
  body('patientId')
    .notEmpty()
    .withMessage('Patient ID is required'),
  body('patientName')
    .notEmpty()
    .withMessage('Patient name is required'),
  body('referringFacility')
    .notEmpty()
    .withMessage('Referring facility is required'),
  body('receivingFacility')
    .notEmpty()
      .withMessage('Receiving facility is required'),
  body('reason')
    .notEmpty()
    .withMessage('Reason for referral is required'),
  body('referralDate')
    .notEmpty()
    .withMessage('Referral date is required')
    .isDate()
    .withMessage('Referral date must be a valid date eg. 2026-05-14'),
];
