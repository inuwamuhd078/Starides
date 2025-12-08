import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION } from '../../graphql/auth';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const [loginMutation, { loading }] = useMutation(LOGIN_MUTATION, {
        onCompleted: (data) => {
            login(data.login.token, data.login.user);

            // Redirect based on user role
            switch (data.login.user.role) {
                case 'CUSTOMER':
                    navigate('/demo/restaurants');
                    break;
                case 'VENDOR':
                    navigate('/vendor');
                    break;
                case 'RIDER':
                    navigate('/rider');
                    break;
                case 'ADMIN':
                    navigate('/admin');
                    break;
                default:
                    navigate('/');
            }
        },
        onError: (err) => {
            setError(err.message || 'Login failed. Please check your credentials.');
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        try {
            await loginMutation({
                variables: {
                    input: {
                        email,
                        password
                    }
                },
            });
        } catch (err) {
            // Error handled by onError callback
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card card">
                    <div className="auth-header">
                        <Link to="/" className="logo">
                            <span className="logo-icon">🚀</span>
                            <span className="logo-text">Starides</span>
                        </Link>
                        <h1 className="auth-title">Welcome Back</h1>
                        <p className="auth-subtitle">Sign in to your account</p>
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

                        <div className="form-group">
                            <div className="form-label-row">
                                <label htmlFor="password" className="form-label">
                                    Password
                                </label>
                                <Link to="/forgot-password" className="link forgot-password-link">
                                    Forgot Password?
                                </Link>
                            </div>
                            <input
                                type="password"
                                id="password"
                                className="input"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            Don't have an account?{' '}
                            <Link to="/register" className="link">
                                Sign up
                            </Link>
                        </p>
                    </div>

                    <div className="auth-divider">
                        <span>or</span>
                    </div>

                    <Link to="/demo/restaurants" className="btn btn-secondary btn-block">
                        Continue as Guest
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
