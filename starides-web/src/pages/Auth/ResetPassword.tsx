import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { RESET_PASSWORD } from '../../graphql/passwordReset';
import './Auth.css';

const ResetPassword: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const [resetPassword, { loading }] = useMutation(RESET_PASSWORD, {
        onCompleted: () => {
            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        },
        onError: (err) => {
            setError(err.message || 'Failed to reset password. Please try again.');
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!token) {
            setError('Invalid reset link. Please request a new password reset.');
            return;
        }

        if (!password || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            await resetPassword({
                variables: {
                    input: {
                        token,
                        newPassword: password,
                    },
                },
            });
        } catch (err) {
            // Error handled by onError callback
        }
    };

    if (!token) {
        return (
            <div className="auth-page">
                <div className="auth-container">
                    <div className="auth-card card">
                        <div className="auth-header">
                            <Link to="/" className="logo">
                                <span className="logo-icon">🚀</span>
                                <span className="logo-text">Starides</span>
                            </Link>
                            <h1 className="auth-title">Invalid Reset Link</h1>
                            <p className="auth-subtitle">
                                This password reset link is invalid or has expired.
                            </p>
                        </div>

                        <div className="alert alert-error">
                            <span>⚠️</span>
                            <span>Please request a new password reset link.</span>
                        </div>

                        <div className="auth-footer">
                            <Link to="/forgot-password" className="btn btn-primary btn-block">
                                Request New Reset Link
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="auth-page">
                <div className="auth-container">
                    <div className="auth-card card">
                        <div className="auth-header">
                            <Link to="/" className="logo">
                                <span className="logo-icon">🚀</span>
                                <span className="logo-text">Starides</span>
                            </Link>
                            <h1 className="auth-title">Password Reset Successful!</h1>
                            <p className="auth-subtitle">
                                Your password has been successfully reset.
                            </p>
                        </div>

                        <div className="alert alert-success">
                            <span>✅</span>
                            <span>You can now log in with your new password. Redirecting to login...</span>
                        </div>

                        <Link to="/login" className="btn btn-primary btn-block">
                            Go to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card card">
                    <div className="auth-header">
                        <Link to="/" className="logo">
                            <span className="logo-icon">🚀</span>
                            <span className="logo-text">Starides</span>
                        </Link>
                        <h1 className="auth-title">Reset Your Password</h1>
                        <p className="auth-subtitle">
                            Enter your new password below
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        {error && (
                            <div className="alert alert-error">
                                <span>⚠️</span>
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="password" className="form-label">
                                New Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="input"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                minLength={6}
                            />
                            <p className="form-hint">Must be at least 6 characters</p>
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword" className="form-label">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                className="input"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                            {loading ? 'Resetting Password...' : 'Reset Password'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            Remember your password?{' '}
                            <Link to="/login" className="link">
                                Back to Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
