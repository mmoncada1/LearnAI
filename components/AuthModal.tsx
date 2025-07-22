'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { EyeIcon, EyeSlashIcon, UserIcon, LockClosedIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot-password' | 'verify-code' | 'reset-password'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    newPassword: '',
    confirmPassword: '',
    verificationCode: '',
  });
  const [recoveryEmailSent, setRecoveryEmailSent] = useState(false);
  const [verifiedCode, setVerifiedCode] = useState<string>(''); // Store the verified code separately

  const { login, register, loading, error, clearError, isAuthenticated } = useAuth();

  // Close modal when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated && isOpen) {
      onClose();
    }
  }, [isAuthenticated, isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (mode === 'login') {
      await login({ email: formData.email, password: formData.password });
    } else if (mode === 'register') {
      await register({ name: formData.name, email: formData.email, password: formData.password });
    } else if (mode === 'forgot-password') {
      await handlePasswordRecovery();
    } else if (mode === 'verify-code') {
      await handleCodeVerification();
    } else if (mode === 'reset-password') {
      await handlePasswordReset();
    }
    // Modal will auto-close via useEffect if authentication succeeds
  };

  const handlePasswordRecovery = async () => {
    const normalizedEmail = formData.email.trim().toLowerCase();
    
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: normalizedEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setMode('verify-code');
        setRecoveryEmailSent(true);
      } else {
        console.error('Password recovery failed:', data.error);
        alert(data.error || 'Failed to send recovery email. Please try again.');
      }
    } catch (error) {
      console.error('Password recovery error:', error);
    }
  };

  const handleCodeVerification = async () => {
    const codeToVerify = formData.verificationCode.trim();
    const emailToVerify = formData.email.trim().toLowerCase();
    
    console.log('🔍 Verifying code:', codeToVerify, 'for email:', emailToVerify);
    
    try {
      const response = await fetch('/api/auth/verify-reset-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: emailToVerify, 
          code: codeToVerify 
        }),
      });

      const data = await response.json();
      console.log('📨 Code verification response:', data);

      if (response.ok) {
        console.log('✅ Code verified successfully, switching to reset-password mode');
        console.log('🔍 Current verification code before mode switch:', codeToVerify);
        setVerifiedCode(codeToVerify); // Store the verified code
        setMode('reset-password');
        console.log('🔍 Current verification code after mode switch:', codeToVerify);
      } else {
        console.error('Code verification failed:', data.error);
        alert(data.error || 'Invalid verification code. Please try again.');
      }
    } catch (error) {
      console.error('Code verification error:', error);
      alert('Network error. Please check your connection and try again.');
    }
  };

  const handlePasswordReset = async () => {
    console.log('🔐 Starting password reset...');
    console.log('🔍 Current formData:', formData);
    console.log('🔍 Email:', formData.email);
    console.log('🔍 Verification code:', formData.verificationCode);
    console.log('🔍 New password length:', formData.newPassword?.length);
    
    if (formData.newPassword !== formData.confirmPassword) {
      console.error('Passwords do not match');
      alert('Passwords do not match. Please try again.');
      return;
    }

    console.log('🔐 Resetting password for email:', formData.email, 'with verified code:', verifiedCode);

    const normalizedEmail = formData.email.trim().toLowerCase();

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: normalizedEmail, 
          code: verifiedCode, // Use the verified code instead of formData.verificationCode
          newPassword: formData.newPassword
        }),
      });

      const data = await response.json();
      console.log('📨 Password reset response:', data);

      if (response.ok) {
        console.log('✅ Password reset successful');
        alert('Password reset successful! You can now log in with your new password.');
        setMode('login');
        setRecoveryEmailSent(false);
        setVerifiedCode(''); // Reset verified code
        setFormData({ name: '', email: '', password: '', newPassword: '', confirmPassword: '', verificationCode: '' });
      } else {
        console.error('Password reset failed:', data.error);
        alert(data.error || 'Password reset failed. Please try again.');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      alert('Network error. Please check your connection and try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleMode = () => {
    if (mode === 'login') {
      setMode('register');
    } else {
      setMode('login');
    }
    clearError();
    setFormData({ name: '', email: '', password: '', newPassword: '', confirmPassword: '', verificationCode: '' });
    setRecoveryEmailSent(false);
    setVerifiedCode(''); // Reset verified code
  };

  const handleClose = () => {
    clearError();
    setMode('login');
    setRecoveryEmailSent(false);
    setVerifiedCode(''); // Reset verified code
    setFormData({ name: '', email: '', password: '', newPassword: '', confirmPassword: '', verificationCode: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl border border-gray-200/80 dark:border-gray-700/50 shadow-2xl w-full max-w-md p-8 mx-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full mx-auto mb-4">
            <UserIcon className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold gradient-text">
            {mode === 'login' ? 'Welcome Back' : 
             mode === 'register' ? 'Join SkillMapAI' : 
             mode === 'forgot-password' ? 'Reset Password' :
             mode === 'verify-code' ? 'Enter Verification Code' :
             'Set New Password'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {mode === 'login' 
              ? 'Sign in to track your learning progress' 
              : mode === 'register'
              ? 'Create an account to save your learning journey'
              : mode === 'forgot-password'
              ? 'Enter your email to receive a verification code'
              : mode === 'verify-code'
              ? `Enter the 6-digit code sent to ${formData.email}`
              : 'Choose a new password for your account'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'register' && (
            <div className="relative">            <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                required={mode === 'register'}
              />
            </div>
          )}

          {(mode === 'login' || mode === 'register' || mode === 'forgot-password') && (
          <div className="relative">
            <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              required
            />
          </div>
          )}

          {(mode === 'login' || mode === 'register') && (
          <div className="relative">
            <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              {showPassword ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>
          )}

          {mode === 'verify-code' && (
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 font-mono font-bold">#</div>
            <input
              type="text"
              name="verificationCode"
              placeholder="000000"
              value={formData.verificationCode}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 text-center font-mono text-lg tracking-widest"
              required
              maxLength={6}
              pattern="[0-9]{6}"
            />
          </div>
          )}

          {mode === 'reset-password' && (
          <>
            <div className="relative">
              <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="newPassword"
                placeholder="New Password"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
            <div className="relative">
              <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm New Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                required
              />
            </div>
          </>
          )}

          {mode === 'login' && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setMode('forgot-password')}
              className="text-sm text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            >
              Forgot your password?
            </button>
          </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-primary-500 to-purple-600 text-white font-medium rounded-lg hover:from-primary-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? 'Please wait...' : 
             mode === 'login' ? 'Sign In' : 
             mode === 'register' ? 'Create Account' : 
             mode === 'forgot-password' ? 'Send Code' :
             mode === 'verify-code' ? 'Verify Code' :
             'Reset Password'}
          </button>
        </form>

        {(mode === 'login' || mode === 'register') && (
        <div className="mt-6 text-center">
          <button
            onClick={toggleMode}
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
          >
            {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
        )}

        {(mode === 'forgot-password' || mode === 'verify-code' || mode === 'reset-password') && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setMode('login')}
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
          >
            Back to Sign In
          </button>
        </div>
        )}

        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
