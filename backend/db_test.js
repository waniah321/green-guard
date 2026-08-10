const { Client } = require('pg');
require('dotenv').config();

async function checkDatabaseConnection() {
  console.log('Testing GreenGuard PostgreSQL connection...');
  console.log(`Host: ${process.env.DB_HOST || 'localhost'}`);
  console.log(`Port: ${process.env.DB_PORT || '5432'}`);
  console.log(`Database: ${process.env.DB_NAME || 'green-guard'}`);
  console.log(`User: ${process.env.DB_USER || 'postgres'}`);

  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'green-guard',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
  });

  try {
    await client.connect();
    console.log('✅ Connection to PostgreSQL was successful!');
    await client.end();
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    console.log('\nTip: Make sure PostgreSQL is running, the database "green-guard" exists, and your password in .env is correct.');
  }
}

checkDatabaseConnection();
