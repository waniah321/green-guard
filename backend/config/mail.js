const nodemailer = require('nodemailer');
const path = require('path');

// Load environment variables from backend/.env explicitly relative to this file
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

console.log('[Nodemailer Init] Attempting to load credentials...');
console.log('[Nodemailer Init] EMAIL_USER:', process.env.EMAIL_USER || '(Not set)');
console.log('[Nodemailer Init] EMAIL_PASS Length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

module.exports = transporter;
