const { sequelize } = require('../config/database');
const User = require('../models/User');

const seedUsers = async () => {
  try {
    // Authenticate and sync without altering the whole schema
    await sequelize.authenticate();
    await sequelize.sync();

    const sampleUsers = [
      {
        email: 'john.doe@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        role: 'customer',
        isVerified: true,
      },
      {
        email: 'vivek@example.com',
        password: 'password123',
        firstName: 'Vivek',
        lastName: 'Kumar',
        role: 'customer',
        isVerified: true,
      }
    ];

    for (const user of sampleUsers) {
      const exists = await User.findOne({ where: { email: user.email } });
      if (!exists) {
        await User.create(user);
        console.log(`Created user: ${user.email}`);
      } else {
        console.log(`User already exists: ${user.email}`);
      }
    }

    console.log('Users seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();
