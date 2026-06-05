import { Response } from 'express';
import { validationResult } from 'express-validator';
import { Op } from 'sequelize';
import Referral from '../models/Referral';
import { AuthRequest } from '../middleware/authenticate';

const VALID_STATUSES = [
  'pending',
  'accepted',
  'attended',
  'feedback_received',
  'closed',
];

export const createReferral = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const requestingUser = req.user;

    const {
      patientId,
      patientName,
      referringFacility,
      receivingFacility,
      reason,
      notes,
      referralDate,
    } = req.body;

    if (
      requestingUser?.role === 'FACILITY_ADMIN' &&
      referringFacility !== requestingUser.facility
    ) {
      return res.status(403).json({
        message: 'You can only create referrals from your own facility',
      });
    }

    const referral = await Referral.create({
      patientId,
      patientName,
      referringFacility,
      receivingFacility,
      reason,
      notes,
      referralDate,
    });

    res.status(201).json(referral);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create referral', error });
  }
};

export const getAllReferrals = async (req: AuthRequest, res: Response) => {
  try {
    const requestingUser = req.user;
    let referrals;

    if (!requestingUser) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    if (
      requestingUser.role === 'FACILITY_ADMIN' ||
      requestingUser.role === 'REFERRAL_OFFICER'
    ) {

      referrals = await Referral.findAll({
        where: {
          [Op.or]: [
            { referringFacility: requestingUser.facility },
            { receivingFacility: requestingUser.facility },
          ],
        },
        order: [['createdAt', 'DESC']],
      });
    } else {
      // ADMIN, DEVELOPER, VIEWER see everything
      referrals = await Referral.findAll({
        order: [['createdAt', 'DESC']],
      });
    }

    return res.status(200).json(referrals);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch referrals', error });
  }
};

export const getReferralById = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const requestingUser = req.user;

    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid referral ID' });
      return;
    }

    const referral = await Referral.findByPk(id);

    if (!referral) {
      res.status(404).json({ message: 'Referral not found' });
      return;
    }

    if (
      (requestingUser?.role === 'FACILITY_ADMIN' ||
        requestingUser?.role === 'REFERRAL_OFFICER') &&
      referral.referringFacility !== requestingUser.facility &&
      referral.receivingFacility !== requestingUser.facility
    ) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    res.status(200).json(referral);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch referral', error });
  }
};

export const updateReferralStatus = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;
    const requestingUser = req.user;

    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid referral ID' });
      return;
    }

    if (!VALID_STATUSES.includes(status)) {
      res.status(400).json({ message: 'Invalid status value' });
      return;
    }

    const referral = await Referral.findByPk(id);

    if (!referral) {
      res.status(404).json({ message: 'Referral not found' });
      return;
    }

    if (
      (requestingUser?.role === 'FACILITY_ADMIN' ||
        requestingUser?.role === 'REFERRAL_OFFICER') &&
      referral.referringFacility !== requestingUser.facility &&
      referral.receivingFacility !== requestingUser.facility
    ) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    referral.status = status;
    await referral.save();
    res.status(200).json(referral);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update status', error });
  }
};