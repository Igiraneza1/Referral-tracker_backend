import { Router } from 'express';
import {
  createReferral,
  getAllReferrals,
  getReferralById,
  updateReferralStatus,
} from '../controllers/referralController';
const router = Router();
router.post('/', createReferral);
router.get('/', getAllReferrals);
router.get('/:id', getReferralById);
router.patch('/:id/status', updateReferralStatus);
export default router;