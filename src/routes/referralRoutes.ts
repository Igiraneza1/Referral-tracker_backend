import { Router, Request, Response } from 'express';
import Referral from '../models/Referral';
const router = Router();

router.post('/', async (req: Request, res: Response) => {
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
    res.status(500).json({ message: 'Failed to create referral', error });
  }
});
router.post('/', async (req: Request, res: Response) => {
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
    res.status(500).json({ message: 'Failed to create referral', error });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const referrals = await Referral.findAll();
    res.status(200).json(referrals);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch referrals', error });
  }
});
export default router;
