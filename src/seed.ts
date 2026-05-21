import bcrypt from 'bcryptjs';
import sequelize from './config/database';
import User from './models/User';
import './models/Referral';

const seed = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    const users = [
      {
        fullName: 'Admin',
        username: 'admin',
        email: 'admin@gmail.com',
        password: 'Admin098',
        role: 'ADMIN' as const,
      },
      {
        fullName: 'Developer',
        username: 'developer',
        email: 'developer@gmail.com',
        password: 'Developer098',
        role: 'DEVELOPER' as const,
      },
    ];

    for (const userData of users) {
      const existing = await User.findOne({
        where: { username: userData.username },
      });

      if (existing) {
        console.log(`${userData.role} already exists`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);

      await User.create({
        fullName: userData.fullName,
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
      });

      console.log(`${userData.role} created successfully`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seed();