import { Router } from 'express';
import {
  createReferral,
  getAllReferrals,
  getReferralById,
  updateReferralStatus,
} from '../controllers/referralController';
import { validateReferral } from '../middleware/validateReferral';

const router = Router();

router.post('/', validateReferral, createReferral);
router.get('/', getAllReferrals);
router.get('/:id', getReferralById);
router.patch('/:id/status', updateReferralStatus);

export default router;