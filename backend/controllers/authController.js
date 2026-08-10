const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');

const mailTransporter = require('../config/mail');

/**
 * Validates password strength:
 * 1. Minimum length of 8 characters.
 * 2. At least one uppercase letter (A-Z).
 * 3. At least one number (0-9).
 * 4. At least one special character (e.g., @, #, $, %, !, &, *).
 */
const validatePassword = (password) => {
  const minLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>_+-]/.test(password);
  return minLength && hasUppercase && hasNumber && hasSpecial;
};

// Sign Up Handler
exports.signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format.' });
    }

    // Password strength check
    if (!validatePassword(password)) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters long, contain at least one uppercase letter (A-Z), one number (0-9), and one special character (e.g., @, #, $, %, !, &, *).'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email: normalizedEmail } });
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    // Hash the password with bcryptjs
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user to the green-guard database
    const newUser = await User.create({
      name: name ? name.trim() : null,
      email: normalizedEmail,
      password: hashedPassword
    });

    // Create JWT Token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET || 'greenguard_secret_key',
      { expiresIn: '24h' }
    );

    return res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      },
      token
    });
  } catch (error) {
    console.error('Signup Error:', error);
    return res.status(500).json({ error: 'Internal server error during registration.' });
  }
};

// Sign In Handler
exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists in the green-guard database
    const user = await User.findOne({ where: { email: normalizedEmail } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    // Verify Password against hash using bcryptjs
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    // Create JWT Token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'greenguard_secret_key',
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Signin Error:', error);
    return res.status(500).json({ error: 'Internal server error during authentication.' });
  }
};

// Forgot Password Request Handler
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email address is required.', message: 'Email address is required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists
    const user = await User.findOne({ where: { email: normalizedEmail } });
    if (!user) {
      return res.status(400).json({ error: 'No account with this email address exists.', message: 'No account with this email address exists.' });
    }

    // Generate 6-digit random numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Update user
    user.resetOTP = otp;
    user.resetOTPExpires = expires;
    await user.save();

    // Setup Nodemailer options
    const mailOptions = {
      from: `"GreenGuard Security" <${process.env.EMAIL_USER || 'greenguard.satellite@gmail.com'}>`,
      to: normalizedEmail,
      subject: 'GreenGuard - Password Reset Verification OTP',
      text: `Your password reset code is: ${otp}. This code expires in 15 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; color: #1e293b; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; margin: 0 auto; background: #ffffff;">
          <h2 style="color: #065f46; border-bottom: 2px solid #10b981; padding-bottom: 12px; margin-top: 0; display: flex; align-items: center; gap: 8px;">
            🌿 GreenGuard Verification
          </h2>
          <p>We received a request to reset your password for your GreenGuard monitoring portal account.</p>
          <p>Please use the following 6-digit One-Time Password (OTP) to proceed with resetting your password:</p>
          
          <div style="text-align: center; margin: 24px 0;">
            <div style="display: inline-block; font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #047857; background: #ecfdf5; border: 1px solid #a7f3d0; padding: 12px 30px; border-radius: 12px;">
              ${otp}
            </div>
          </div>
          
          <p style="font-size: 13px; color: #6b7280; line-height: 1.5;">
            ⚠️ This code is only valid for <strong>15 minutes</strong>. If you did not make this request, you can safely ignore this email and your password will remain unchanged.
          </p>
          <div style="margin-top: 30px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center;">
            Sent automatically by GreenGuard Security Identity Service.
          </div>
        </div>
      `,
    };

    console.log(`[Forgot Password] Ready to send OTP to ${normalizedEmail}`);
    console.log(`[Forgot Password] SMTP Config loaded - User: ${process.env.EMAIL_USER || '(Not Set)'}`);

    try {
      console.log('[Forgot Password] Executing mailTransporter.sendMail()...');
      await mailTransporter.sendMail(mailOptions);
      console.log(`[Forgot Password] OTP email sent successfully to ${normalizedEmail}`);
      return res.status(200).json({
        success: true,
        message: "Email delivered successfully"
      });
    } catch (emailError) {
      console.error('[Forgot Password] SMTP sendMail failed with error:', emailError);
      return res.status(500).json({
        success: false,
        error: emailError.message
      });
    }
  } catch (error) {
    console.error('Forgot Password Error:', error);
    return res.status(500).json({ error: 'Internal server error during password reset request.', message: 'Internal server error during password reset request.' });
  }
};

// Reset Password Handler
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: 'Email, OTP, and new password are required.', message: 'Email, OTP, and new password are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find user
    const user = await User.findOne({ where: { email: normalizedEmail } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid password reset request.', message: 'Invalid password reset request.' });
    }

    // Verify OTP and Expiration
    if (!user.resetOTP || user.resetOTP !== otp.trim()) {
      return res.status(400).json({ error: 'Invalid verification OTP.', message: 'Invalid verification OTP.' });
    }

    if (new Date(user.resetOTPExpires) < new Date()) {
      return res.status(400).json({ error: 'The verification OTP has expired. Please request a new one.', message: 'The verification OTP has expired. Please request a new one.' });
    }

    // Validate new password strength
    if (!validatePassword(newPassword)) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters long, contain at least one uppercase letter (A-Z), one number (0-9), and one special character (e.g., @, #, $, %, !, &, *).',
        message: 'Password must be at least 8 characters long, contain at least one uppercase letter (A-Z), one number (0-9), and one special character (e.g., @, #, $, %, !, &, *).'
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Save changes and clear OTP columns
    user.password = hashedPassword;
    user.resetOTP = null;
    user.resetOTPExpires = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Your password has been reset successfully. You can now sign in.'
    });
  } catch (error) {
    console.error('Reset Password Error:', error);
    return res.status(500).json({ error: 'Internal server error during password reset.', message: 'Internal server error during password reset.' });
  }
};
