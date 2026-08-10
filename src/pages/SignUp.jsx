// src/pages/SignUp.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, User, Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import Loader from '../components/common/Loader';

export default function SignUp({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Field Validations
    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters.');
      return;
    }

    const validatePassword = (pass) => {
      const minLength = pass.length >= 8;
      const hasUppercase = /[A-Z]/.test(pass);
      const hasNumber = /[0-9]/.test(pass);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>_+-]/.test(pass);
      return minLength && hasUppercase && hasNumber && hasSpecial;
    };

    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters long, contain at least one uppercase letter (A-Z), one number (0-9), and one special character (e.g., @, #, $, %, !, &, *).');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    fetch('http://localhost:5000/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name.trim(),
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
        throw new Error(data.error || data.message || 'Registration failed.');
      }
      return data;
    })
    .then((data) => {
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      setIsLoading(false);
      onLoginSuccess();
      navigate('/');
    })
    .catch((err) => {
      setError(err.message);
      setIsLoading(false);
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
            {isLoading && <Loader overlay={true} message="Creating account..." />}
            
            {/* Brand Logo Section (Displayed on Mobile Stacking / Collapsing) */}
            <div className="auth-brand">
              <div className="auth-logo-icon">
                <Leaf className="auth-icon" />
              </div>
              <h2 className="auth-title">GreenGuard</h2>
              <span className="auth-subtitle">Forest Monitoring Portal</span>
            </div>

            <div className="auth-header-text">
              <h3>Create Account</h3>
              <p>Register to monitor satellite canopy metrics</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="auth-error-banner animate-slide-in">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              {/* Full Name Input */}
              <div className="auth-field">
                <label className="field-label">Full Name</label>
                <div className="auth-input-wrapper">
                  <User className="input-icon" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Furqan User"
                    className="auth-input"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

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
                    disabled={isLoading}
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
                    placeholder="Min. 8 characters"
                    className="auth-input"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="auth-field">
                <label className="field-label">Confirm Password</label>
                <div className="auth-input-wrapper">
                  <Lock className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="auth-input"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button type="submit" className="auth-submit-btn" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="spinner"></div>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <span>Sign Up & Start Scanning</span>
                )}
              </button>
            </form>

            {/* Auth Footer */}
            <div className="auth-footer">
              <p>
                Already have an account?{' '}
                <Link to="/signin" className="auth-link">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
