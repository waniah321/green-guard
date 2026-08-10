const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'green-guard',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'postgres',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: false, // Set to console.log to debug SQL queries
    dialectOptions: {
      // Add dialetOptions if needed for SSL, etc.
    }
  }
);

module.exports = sequelize;
