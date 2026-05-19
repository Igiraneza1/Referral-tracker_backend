import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import User from '../models/User';

// CREATE ACCOUNT
export const register = async (req: Request, res: Response) => {
  try {
    const { fullName, username, email, password, role, facility } = req.body;

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      username,
      email,
      password: hashedPassword,
      role,
      facility,
    });

    const userData = {
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      role: user.role,
      facility: user.facility,
      isActive: user.isActive,
    };

    return res.status(201).json({
      message: 'User created successfully',
      user: userData,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'Server error',
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      where: { username },
    });

    if (!user) {
      return res.status(401).json({
        message: 'Invalid credentials',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid credentials',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        message: 'Account deactivated',
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        facility: user.facility,
      },
      process.env.JWT as string,
      {
        expiresIn: '7d',
      }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'Server error',
    });
  }
};