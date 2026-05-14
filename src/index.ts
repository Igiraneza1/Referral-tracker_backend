import express from 'express';
import sequelize from './config/database';
import Referral from './models/Referral';
import referralRoutes from './routes/referralRoutes'; // ADD THIS

const _models = { Referral };

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use('/api/referrals', referralRoutes); // ADD THIS

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
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