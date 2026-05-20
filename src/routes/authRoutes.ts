import express from 'express';
import { login, register, createUser } from '../controllers/authController';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.post(
  '/create-user',
  authenticate,
  authorize('ADMIN', 'DEVELOPER', 'FACILITY_ADMIN'),
  createUser
);

export default router;