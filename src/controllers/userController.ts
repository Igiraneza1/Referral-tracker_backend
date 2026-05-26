import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { AuthRequest } from '../middleware/authenticate';
import User from '../models/User';

// GET ALL USERS
export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const requestingUser = req.user;

    if (!requestingUser) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    let users;

    if (requestingUser.role === 'FACILITY_ADMIN') {
      users = await User.findAll({
        where: { facility: requestingUser.facility },
        attributes: { exclude: ['password'] },
      });
    } else {
      users = await User.findAll({
        attributes: { exclude: ['password'] },
      });
    }

    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ACTIVATE OR DEACTIVATE USER
export const updateUserStatus = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { isActive } = req.body;
    const requestingUser = req.user;

    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    if (!requestingUser) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.id === requestingUser.id) {
      return res.status(400).json({
        message: 'You cannot deactivate your own account',
      });
    }

    if (
      requestingUser.role === 'FACILITY_ADMIN' &&
      user.facility !== requestingUser.facility
    ) {
      return res.status(403).json({
        message: 'You can only manage users from your facility',
      });
    }

    user.isActive = isActive;
    await user.save();

    return res.status(200).json({
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      user: {
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.role,
        facility: user.facility,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// RESET USER PASSWORD
export const resetPassword = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { newPassword } = req.body;
    const requestingUser = req.user;

    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    if (!requestingUser) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters',
      });
    }

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (
      requestingUser.role === 'FACILITY_ADMIN' &&
      user.facility !== requestingUser.facility
    ) {
      return res.status(403).json({
        message: 'You can only reset passwords for users in your facility',
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      message: 'Password reset successfully',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};