import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { REQUEST_PASSWORD_RESET } from '../../graphql/passwordReset';
import './Auth.css';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const [requestPasswordReset, { loading }] = useMutation(REQUEST_PASSWORD_RESET, {
        onCompleted: () => {
            setSubmitted(true);
        },
        onError: (err) => {
            setError(err.message || 'Failed to send reset email. Please try again.');
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email) {
            setError('Please enter your email address');
            return;
        }

        try {
            await requestPasswordReset({
                variables: {
                    input: { email },
                },
            });
        } catch (err) {
            // Error handled by onError callback
        }
    };

    if (submitted) {
        return (
            <div className="auth-page">
                <div className="auth-container">
                    <div className="auth-card card">
                        <div className="auth-header">
                            <Link to="/" className="logo">
                                <span className="logo-icon">🚀</span>
                                <span className="logo-text">Starides</span>
                            </Link>
                            <h1 className="auth-title">Check Your Email</h1>
                            <p className="auth-subtitle">
                                We've sent password reset instructions to <strong>{email}</strong>
                            </p>
                        </div>

                        <div className="alert alert-success">
                            <span>✅</span>
                            <span>If an account exists with this email, you will receive a password reset link shortly.</span>
                        </div>

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
                        <h1 className="auth-title">Forgot Password?</h1>
                        <p className="auth-subtitle">
                            No worries! Enter your email and we'll send you reset instructions.
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
                            <label htmlFor="email" className="form-label">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="input"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                            {loading ? 'Sending...' : 'Send Reset Link'}
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

export default ForgotPassword;
