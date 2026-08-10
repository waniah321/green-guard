// src/pages/SignIn.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Lock, Mail, AlertCircle, Eye, EyeOff, Clock, CheckCircle2 } from 'lucide-react';
import Loader from '../components/common/Loader';

export default function SignIn({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState(() => {
    return localStorage.getItem('gg_remember_email') || '';
  });
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    return !!localStorage.getItem('gg_remember_email');
  });

  // State mode: 'signin' | 'forgot' | 'reset'
  const [mode, setMode] = useState('signin');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Reset password states
  const [resetEmail, setResetEmail] = useState('');
  const [resetOTP, setResetOTP] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showResetSuccessPopup, setShowResetSuccessPopup] = useState(false);

  // Security Lockout states
  const [failedAttempts, setFailedAttempts] = useState(() => {
    return parseInt(localStorage.getItem('gg_failed_attempts') || '0', 10);
  });
  const [lockoutUntil, setLockoutUntil] = useState(() => {
    return parseInt(localStorage.getItem('gg_lockout_until') || '0', 10);
  });
  const [secondsRemaining, setSecondsRemaining] = useState(0);

  // Timer loop for lockout
  useEffect(() => {
    if (lockoutUntil > Date.now()) {
      const updateTimer = () => {
        const remaining = Math.max(0, Math.ceil((lockoutUntil - Date.now()) / 1000));
        setSecondsRemaining(remaining);
        if (remaining === 0) {
          // Reset lockout
          setFailedAttempts(0);
          setLockoutUntil(0);
          localStorage.removeItem('gg_failed_attempts');
          localStorage.removeItem('gg_lockout_until');
          setError('');
        }
      };
      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    } else {
      setSecondsRemaining(0);
    }
  }, [lockoutUntil]);

  const isLocked = lockoutUntil > Date.now();

  // Format seconds to mm:ss format
  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSignInSubmit = (e) => {
    e.preventDefault();
    if (isLocked) return;

    setError('');
    setIsLoading(true);

    fetch('http://localhost:5000/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.trim(),
        password: password
      })
    })
    .then(async (res) => {
      const contentType = res.headers.get('content-type');
      let data = {};
      if (contentType && contentType.includes('application/json')) {
        try {
          data = await res.json();
        } catch (jsonErr) {
          throw new Error('Failed to parse server response as JSON.');
        }
      } else {
        throw new Error(`Server returned a non-JSON response (status ${res.status}). Please make sure the backend server on port 5000 is running.`);
      }

      if (!res.ok) {
        throw new Error(data.error || data.message || 'Authentication failed.');
      }
      return data;
    })
    .then((data) => {
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      localStorage.setItem('currentUser', JSON.stringify(data.user));

      // Handle Remember Me
      if (rememberMe) {
        localStorage.setItem('gg_remember_email', email.trim());
      } else {
        localStorage.removeItem('gg_remember_email');
      }

      // Reset lockout status
      localStorage.removeItem('gg_failed_attempts');
      localStorage.removeItem('gg_lockout_until');
      setFailedAttempts(0);
      setLockoutUntil(0);

      setIsLoading(false);
      onLoginSuccess();
      navigate('/');
    })
    .catch((err) => {
      setIsLoading(false);
      
      // Handle failed attempt counters
      const newAttempts = failedAttempts + 1;
      if (newAttempts >= 5) {
        const lockoutTime = Date.now() + 3 * 60 * 1000; // 3 minutes
        setFailedAttempts(0);
        setLockoutUntil(lockoutTime);
        localStorage.setItem('gg_failed_attempts', '0');
        localStorage.setItem('gg_lockout_until', lockoutTime.toString());
        setError('Too many failed attempts. Please try again in 3 minutes.');
      } else {
        setFailedAttempts(newAttempts);
        localStorage.setItem('gg_failed_attempts', newAttempts.toString());
        setError(`${err.message} (${5 - newAttempts} attempts remaining before lock).`);
      }
    });
  };

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    fetch('http://localhost:5000/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: resetEmail.trim()
      })
    })
    .then(async (res) => {
      const contentType = res.headers.get('content-type');
      let data = {};
      if (contentType && contentType.includes('application/json')) {
        try {
          data = await res.json();
        } catch (jsonErr) {
          throw new Error('Failed to parse server response as JSON.');
        }
      } else {
        throw new Error(`Server returned a non-JSON response (status ${res.status}). Please make sure the backend server on port 5000 is running.`);
      }

      if (!res.ok) {
        throw new Error(data.error || data.message || 'Request failed.');
      }
      return data;
    })
    .then((data) => {
      setIsLoading(false);
      setSuccess('Verification OTP sent successfully!');
      // Switch mode to reset entry form
      setTimeout(() => {
        setMode('reset');
        setError('');
        setSuccess('');
      }, 1000);
    })
    .catch((err) => {
      setIsLoading(false);
      setError(err.message);
    });
  };

  const handleResetPasswordSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    fetch('http://localhost:5000/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: resetEmail.trim(),
        otp: resetOTP.trim(),
        newPassword: newPassword
      })
    })
    .then(async (res) => {
      const contentType = res.headers.get('content-type');
      let data = {};
      if (contentType && contentType.includes('application/json')) {
        try {
          data = await res.json();
        } catch (jsonErr) {
          throw new Error('Failed to parse server response as JSON.');
        }
      } else {
        throw new Error(`Server returned a non-JSON response (status ${res.status}). Please make sure the backend server on port 5000 is running.`);
      }

      if (!res.ok) {
        throw new Error(data.error || data.message || 'Reset failed.');
      }
      return data;
    })
    .then((data) => {
      setIsLoading(false);
      setShowResetSuccessPopup(true);
    })
    .catch((err) => {
      setIsLoading(false);
      setError(err.message);
    });
  };
  return (
    <div className="auth-page-container">
      {/* Falling Leaves Effect */}
      <div className="auth-falling-leaves">
        <div className="auth-leaf leaf-1" style={{ backgroundImage: "url('/leaf.png')" }}></div>
        <div className="auth-leaf leaf-2" style={{ backgroundImage: "url('/leaf.png')" }}></div>
        <div className="auth-leaf leaf-3" style={{ backgroundImage: "url('/leaf.png')" }}></div>
        <div className="auth-leaf leaf-4" style={{ backgroundImage: "url('/leaf.png')" }}></div>
        <div className="auth-leaf leaf-5" style={{ backgroundImage: "url('/leaf.png')" }}></div>
        <div className="auth-leaf leaf-6" style={{ backgroundImage: "url('/leaf.png')" }}></div>
        <div className="auth-leaf leaf-7" style={{ backgroundImage: "url('/leaf.png')" }}></div>
        <div className="auth-leaf leaf-8" style={{ backgroundImage: "url('/leaf.png')" }}></div>
        <div className="auth-leaf leaf-9" style={{ backgroundImage: "url('/leaf.png')" }}></div>
        <div className="auth-leaf leaf-10" style={{ backgroundImage: "url('/leaf.png')" }}></div>
        <div className="auth-leaf leaf-11" style={{ backgroundImage: "url('/leaf.png')" }}></div>
        <div className="auth-leaf leaf-12" style={{ backgroundImage: "url('/leaf.png')" }}></div>
      </div>

      {/* Background Orbs */}
      <div className="auth-bg-orb orb-1"></div>
      <div className="auth-bg-orb orb-2"></div>
      <div className="auth-bg-orb orb-3"></div>

      <div className="auth-split-layout">
        
        {/* Left Column: Branding Section */}
        <div className="auth-left-branding">
          <div className="branding-content">
            <div className="brand-logo-glow">
              <Leaf className="branding-logo-icon animate-float" />
            </div>
            <h1 className="wave-text">
              {"GreenGuard".split("").map((letter, index) => (
                <span key={index} style={{ animationDelay: `${index * 0.12}s` }}>
                  {letter}
                </span>
              ))}
            </h1>
            <p className="branding-tagline">AI-Powered Forest Monitoring & Deforestation Analytics</p>
            <div className="brand-decoration-line"></div>
          </div>
        </div>

        {/* Right Column: Form Container */}
        <div className="auth-right-form">
          <div className="auth-card-glass">
            {isLoading && <Loader overlay={true} message={mode === 'signin' ? 'Authenticating...' : mode === 'forgot' ? 'Sending OTP...' : 'Resetting password...'} />}

            {/* Success Reset Popup Overlay */}
            {showResetSuccessPopup && (
              <div className="auth-success-popup">
                <div className="success-icon-wrapper">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <h3 className="success-popup-title">Reset Successful!</h3>
                <p className="success-popup-text">
                  Your password has been successfully updated. You can now log in using your new credentials.
                </p>
                <button
                  onClick={() => {
                    setShowResetSuccessPopup(false);
                    setMode('signin');
                    setPassword('');
                    setResetEmail('');
                    setResetOTP('');
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                  className="success-popup-btn"
                >
                  Continue to Sign In
                </button>
              </div>
            )}

            {/* Brand Logo Section (Displayed on Mobile Stacking / Collapsing) */}
            <div className="auth-brand">
              <div className="auth-logo-icon">
                <Leaf className="auth-icon" />
              </div>
              <h2 className="auth-title">GreenGuard</h2>
              <span className="auth-subtitle">Forest Monitoring Portal</span>
            </div>

            {/* SIGN IN FORM MODE */}
            {mode === 'signin' && (
              <div className="auth-fade-slide-in">
                <div className="auth-header-text">
                  <h3>Sign In</h3>
                  <p>Access your satellite analysis dashboard</p>
                </div>

                {/* Lockout Warning Banner */}
                {isLocked && (
                  <div className="auth-lockout-banner">
                    <Clock className="w-5 h-5 text-red-600 shrink-0" />
                    <span>Too many failed attempts. Please try again in:</span>
                    <span className="lockout-timer-val">{formatTime(secondsRemaining)}</span>
                  </div>
                )}

                {/* Error Message */}
                {error && !isLocked && (
                  <div className="auth-error-banner">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSignInSubmit} className="auth-form">
                  {/* Email Input */}
                  <div className="auth-field">
                    <label className="field-label">Email Address</label>
                    <div className="auth-input-wrapper">
                      <Mail className="input-icon" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="user@greenguard.org"
                        className="auth-input"
                        required
                        disabled={isLoading || isLocked}
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="auth-field">
                    <label className="field-label">Password</label>
                    <div className="auth-input-wrapper">
                      <Lock className="input-icon" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="auth-input"
                        required
                        disabled={isLoading || isLocked}
                      />
                      <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading || isLocked}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password Row */}
                  <div className="auth-options-row">
                    <label className="remember-me-label">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="remember-me-checkbox"
                        disabled={isLoading || isLocked}
                      />
                      Remember Me
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setResetEmail(email);
                        setMode('forgot');
                        setError('');
                        setSuccess('');
                      }}
                      className="forgot-password-link"
                      disabled={isLoading || isLocked}
                    >
                      Forgot Password?
                    </button>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="auth-submit-btn"
                    disabled={isLoading || isLocked}
                  >
                    {isLoading ? (
                      <>
                        <div className="spinner"></div>
                        <span>Signing In...</span>
                      </>
                    ) : (
                      <span>Sign In to Dashboard</span>
                    )}
                  </button>
                </form>

                {/* Auth Footer */}
                <div className="auth-footer">
                  <p>
                    Don't have an account?{' '}
                    <Link to="/signup" className="auth-link">
                      Sign Up
                    </Link>
                  </p>
                </div>
              </div>
            )}

            {/* FORGOT PASSWORD FORM MODE */}
            {mode === 'forgot' && (
              <div className="auth-fade-slide-in">
                <div className="auth-header-text">
                  <h3>Forgot Password</h3>
                  <p>Enter your email to receive a password reset code</p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="auth-error-banner">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Success Message */}
                {success && (
                  <div className="auth-success-banner animate-slide-in">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>{success}</span>
                  </div>
                )}

                <form onSubmit={handleForgotPasswordSubmit} className="auth-form">
                  <div className="auth-field">
                    <label className="field-label">Email Address</label>
                    <div className="auth-input-wrapper">
                      <Mail className="input-icon" />
                      <input
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="user@greenguard.org"
                        className="auth-input"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <button type="submit" className="auth-submit-btn" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <div className="spinner"></div>
                        <span>Sending OTP...</span>
                      </>
                    ) : (
                      <span>Send Verification Code</span>
                    )}
                  </button>
                </form>

                {/* Back to Sign In Link */}
                <div className="auth-footer">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin');
                      setError('');
                      setSuccess('');
                    }}
                    className="auth-link"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                    disabled={isLoading}
                  >
                    Back to Sign In
                  </button>
                </div>
              </div>
            )}

            {/* RESET PASSWORD FORM MODE */}
            {mode === 'reset' && (
              <div className="auth-fade-slide-in">
                <div className="auth-header-text">
                  <h3>Reset Password</h3>
                  <p>Check your email for the OTP code and set your new password</p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="auth-error-banner">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleResetPasswordSubmit} className="auth-form">
                  {/* Reset Email Input (readonly reference) */}
                  <div className="auth-field">
                    <label className="field-label">Reset Email</label>
                    <div className="auth-input-wrapper">
                      <Mail className="input-icon" />
                      <input
                        type="email"
                        value={resetEmail}
                        className="auth-input input-readonly"
                        readOnly
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* OTP Code Input */}
                  <div className="auth-field">
                    <label className="field-label">OTP Verification Code</label>
                    <div className="auth-input-wrapper">
                      <Lock className="input-icon" />
                      <input
                        type="text"
                        value={resetOTP}
                        onChange={(e) => setResetOTP(e.target.value)}
                        placeholder="Enter 6-digit OTP"
                        className="auth-input"
                        required
                        disabled={isLoading}
                        maxLength={6}
                      />
                    </div>
                  </div>

                  {/* New Password Input */}
                  <div className="auth-field">
                    <label className="field-label">New Password</label>
                    <div className="auth-input-wrapper">
                      <Lock className="input-icon" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New Password"
                        className="auth-input"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Confirm Password Input */}
                  <div className="auth-field">
                    <label className="field-label">Confirm New Password</label>
                    <div className="auth-input-wrapper">
                      <Lock className="input-icon" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                        className="auth-input"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <button type="submit" className="auth-submit-btn" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <div className="spinner"></div>
                        <span>Resetting Password...</span>
                      </>
                    ) : (
                      <span>Reset Password</span>
                    )}
                  </button>
                </form>

                {/* Back to Sign In Link */}
                <div className="auth-footer">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin');
                      setError('');
                      setSuccess('');
                    }}
                    className="auth-link"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                    disabled={isLoading}
                  >
                    Back to Sign In
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
