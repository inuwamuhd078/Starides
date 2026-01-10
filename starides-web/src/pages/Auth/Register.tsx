import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { REGISTER_MUTATION } from '../../graphql/auth';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';
import './Auth.css';

const Register: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: '',
        role: 'CUSTOMER',
    });
    const [error, setError] = useState('');

    const [registerMutation, { loading }] = useMutation(REGISTER_MUTATION, {
        onCompleted: (data) => {
            login(data.register.token, data.register.user);

            // Redirect based on user role
            switch (data.register.user.role) {
                case 'CUSTOMER':
                    navigate('/restaurants');
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
            setError(err.message || 'Registration failed. Please try again.');
        },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!formData.email || !formData.password || !formData.firstName || !formData.lastName || !formData.phone) {
            setError('Please fill in all fields');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        try {
            await registerMutation({
                variables: {
                    input: formData,
                },
            });
        } catch (err) {
            console.error("Registration Error:", err);
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card card">
                    <div className="auth-header">
                        <Link to="/" className="logo">
                            <img src={logo} alt="Starides" className="logo-image" />
                        </Link>
                        <h1 className="auth-title">Create Account</h1>
                        <p className="auth-subtitle">Join Starides today</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        {error && (
                            <div className="alert alert-error">
                                <span>⚠️</span>
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="firstName" className="form-label">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    className="input"
                                    placeholder="John"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="lastName" className="form-label">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    className="input"
                                    placeholder="Doe"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="email" className="form-label">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="input"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone" className="form-label">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                className="input"
                                placeholder="+1234567890"
                                value={formData.phone}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="form-label">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="input"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                disabled={loading}
                            />
                            <small className="form-hint">Must be at least 6 characters</small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="role" className="form-label">
                                I want to
                            </label>
                            <select
                                id="role"
                                name="role"
                                className="input"
                                value={formData.role}
                                onChange={handleChange}
                                disabled={loading}
                            >
                                <option value="CUSTOMER">Order Food (Customer)</option>
                                <option value="VENDOR">Sell Food (Restaurant Owner)</option>
                                <option value="RIDER">Deliver Food (Rider)</option>
                                <option value="ADMIN">Platform Admin</option>
                            </select>
                        </div>

                        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            Already have an account?{' '}
                            <Link to="/login" className="link">
                                Sign in
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

export default Register;
