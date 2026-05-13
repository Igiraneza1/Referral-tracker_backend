import { Request, Response } from 'express';
import Referral from '../models/Referral';

const VALID_STATUSES = [
  'pending',
  'accepted',
  'attended',
  'feedback_received',
  'closed',
];

export const createReferral = async (req: Request, res: Response) => {
  try {
    const {
      patientId,
      patientName,
      referringFacility,
      receivingFacility,
      reason,
      notes,
      referralDate,
    } = req.body;

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
    res.status(500).json({
      message: 'Failed to create referral',
      error,
    });
  }
};

export const getAllReferrals = async (req: Request, res: Response) => {
  try {
    const referrals = await Referral.findAll();

    res.status(200).json(referrals);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch referrals',
      error,
    });
  }
};

export const getReferralById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        message: 'Invalid referral ID',
      });
      return;
    }

    const referral = await Referral.findByPk(id);

    if (!referral) {
      res.status(404).json({
        message: 'Referral not found',
      });
      return;
    }

    res.status(200).json(referral);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch referral',
      error,
    });
  }
};

export const updateReferralStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    if (isNaN(id)) {
      res.status(400).json({
        message: 'Invalid referral ID',
      });
      return;
    }

    if (!VALID_STATUSES.includes(status)) {
      res.status(400).json({
        message: 'Invalid status value',
      });
      return;
    }

    const referral = await Referral.findByPk(id);

    if (!referral) {
      res.status(404).json({
        message: 'Referral not found',
      });
      return;
    }

    referral.status = status;

    await referral.save();

    res.status(200).json(referral);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update status',
      error,
    });
  }
};