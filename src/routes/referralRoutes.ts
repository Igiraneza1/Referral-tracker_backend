import { Router } from 'express';
import { createReferral, getAllReferrals, getReferralById, updateReferralStatus } from '../controllers/referralController';
import { validateReferral } from '../middleware/validateReferral';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';

const router = Router();

router.get('/', authenticate, getAllReferrals);
router.get('/:id', authenticate, getReferralById);
router.post('/', authenticate, authorize('REFERRAL_OFFICER', 'FACILITY_ADMIN', 'ADMIN', 'DEVELOPER'), validateReferral, createReferral);
router.patch('/:id/status', authenticate, authorize('REFERRAL_OFFICER', 'FACILITY_ADMIN', 'ADMIN', 'DEVELOPER'), updateReferralStatus);

export default router;