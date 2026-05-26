import express from 'express';
import {
  getAllUsers,
  updateUserStatus,
  resetPassword,
} from '../controllers/userController';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';

const router = express.Router();

router.get(
  '/',
  authenticate,
  authorize('ADMIN','DEVELOPER', 'FACILITY_ADMIN'),
  getAllUsers
);

router.patch(
  '/:id/status',
  authenticate,
  authorize('ADMIN', 'DEVELOPER', 'FACILITY_ADMIN'),
  updateUserStatus
);

router.patch(
  '/:id/reset-password',
  authenticate,
  authorize('ADMIN', 'DEVELOPER', 'FACILITY_ADMIN'),
  resetPassword
);

export default router;