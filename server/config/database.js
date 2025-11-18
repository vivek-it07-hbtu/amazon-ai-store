const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

// PostgreSQL connection using Sequelize
const sequelize = new Sequelize(
  process.env.POSTGRES_DB || 'amazon_users',
  process.env.POSTGRES_USER || 'postgres',
  process.env.POSTGRES_PASSWORD || 'postgres',
  {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: process.env.POSTGRES_PORT || 5432,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

module.exports = { sequelize };
