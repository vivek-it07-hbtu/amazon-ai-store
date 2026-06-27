const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

// Use SQLite as fallback if PostgreSQL is not configured or unavailable
const useSQLite = process.env.USE_SQLITE === 'true' || !process.env.POSTGRES_HOST;

let sequelize;

if (useSQLite) {
  // SQLite configuration for development/demo
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '..', 'database.sqlite'),
    logging: false,
  });
  console.log('📦 Using SQLite database for development');
} else {
  // PostgreSQL connection using Sequelize
  sequelize = new Sequelize(
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
}

module.exports = { sequelize };
