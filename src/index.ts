import express from 'express';
import cors from 'cors';

import sequelize from './config/database';
import Referral from './models/Referral';
import User from './models/User';

import authRoutes from './routes/authRoutes';
import referralRoutes from './routes/referralRoutes';
import userRoutes from './routes/userRoutes';

const _models = { Referral, User };

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'https://referral-tracker-frontend-onq1.vercel.app'],
  credentials: true,
}));

app.use(express.json());

app.use('/api/referrals', referralRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is running',
  });
});

const connectAndStart = async () => {
  try {
    await sequelize.authenticate();

    console.log('Models registered:', Object.keys(sequelize.models));

    await sequelize.sync();

    console.log('Database connected successfully');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

connectAndStart();