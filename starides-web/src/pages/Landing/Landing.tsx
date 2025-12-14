import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import './Landing.css';

const Landing: React.FC = () => {
    return (
        <div className="landing">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-background">
                    <div className="hero-gradient"></div>
                    <div className="hero-pattern"></div>
                </div>

                <nav className="navbar">
                    <div className="container">
                        <div className="navbar-content">
                            <div className="logo">
                                <img src={logo} alt="Starides Logo" className="logo-img" />
                                <span className="logo-text">Starides</span>
                            </div>
                            <div className="nav-links">
                                <Link to="/login" className="btn btn-ghost">Sign In</Link>
                                <Link to="/register" className="btn btn-primary">Get Started</Link>
                            </div>
                        </div>
                    </div>
                </nav>

                <div className="container hero-container">
                    <div className="hero-content">
                        <div className="hero-badge animate-slide-down">
                            <span className="badge badge-info">🎉 Now Available in Your City</span>
                        </div>

                        <h1 className="hero-title animate-slide-up">
                            Your Favorite Food,
                            <br />
                            <span className="text-gradient">Delivered Fast</span>
                        </h1>

                        <p className="hero-description animate-slide-up">
                            Order from the best restaurants in your area. Fresh, fast, and delivered right to your door.
                        </p>

                        <div className="hero-actions animate-slide-up">
                            <Link to="/demo/restaurants" className="btn btn-primary btn-lg">
                                Order Now
                                <span>→</span>
                            </Link>
                            <Link to="/demo/restaurants" className="btn btn-secondary btn-lg">
                                Browse Restaurants
                            </Link>
                        </div>

                        <div className="hero-stats animate-fade-in">
                            <div className="stat">
                                <div className="stat-value">500+</div>
                                <div className="stat-label">Restaurants</div>
                            </div>
                            <div className="stat">
                                <div className="stat-value">50K+</div>
                                <div className="stat-label">Happy Customers</div>
                            </div>
                            <div className="stat">
                                <div className="stat-value">30min</div>
                                <div className="stat-label">Avg Delivery</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Why Choose Starides?</h2>
                        <p className="section-description">
                            Experience the future of food delivery with our premium service
                        </p>
                    </div>

                    <div className="features-grid">
                        <div className="feature-card card-glass">
                            <div className="feature-icon">⚡</div>
                            <h3 className="feature-title">Lightning Fast</h3>
                            <p className="feature-description">
                                Average delivery time of 30 minutes or less. Your food arrives hot and fresh.
                            </p>
                        </div>

                        <div className="feature-card card-glass">
                            <div className="feature-icon">🍔</div>
                            <h3 className="feature-title">Wide Selection</h3>
                            <p className="feature-description">
                                Choose from hundreds of restaurants offering diverse cuisines and dishes.
                            </p>
                        </div>

                        <div className="feature-card card-glass">
                            <div className="feature-icon">📍</div>
                            <h3 className="feature-title">Real-time Tracking</h3>
                            <p className="feature-description">
                                Track your order in real-time from restaurant to your doorstep.
                            </p>
                        </div>

                        <div className="feature-card card-glass">
                            <div className="feature-icon">💳</div>
                            <h3 className="feature-title">Secure Payments</h3>
                            <p className="feature-description">
                                Multiple payment options with bank-level security for your peace of mind.
                            </p>
                        </div>

                        <div className="feature-card card-glass">
                            <div className="feature-icon">⭐</div>
                            <h3 className="feature-title">Quality Guaranteed</h3>
                            <p className="feature-description">
                                All restaurants are verified and rated by our community of food lovers.
                            </p>
                        </div>

                        <div className="feature-card card-glass">
                            <div className="feature-icon">🎁</div>
                            <h3 className="feature-title">Rewards & Offers</h3>
                            <p className="feature-description">
                                Earn points on every order and unlock exclusive discounts and deals.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">How It Works</h2>
                        <p className="section-description">
                            Get your favorite food in three simple steps
                        </p>
                    </div>

                    <div className="steps">
                        <div className="step">
                            <div className="step-number">1</div>
                            <div className="step-content">
                                <h3 className="step-title">Choose Your Restaurant</h3>
                                <p className="step-description">
                                    Browse through our curated list of top-rated restaurants in your area
                                </p>
                            </div>
                        </div>

                        <div className="step-connector"></div>

                        <div className="step">
                            <div className="step-number">2</div>
                            <div className="step-content">
                                <h3 className="step-title">Place Your Order</h3>
                                <p className="step-description">
                                    Select your favorite dishes and customize them to your liking
                                </p>
                            </div>
                        </div>

                        <div className="step-connector"></div>

                        <div className="step">
                            <div className="step-number">3</div>
                            <div className="step-content">
                                <h3 className="step-title">Enjoy Your Meal</h3>
                                <p className="step-description">
                                    Track your order and enjoy fresh, hot food delivered to your door
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta">
                <div className="container">
                    <div className="cta-content">
                        <h2 className="cta-title">Ready to Get Started?</h2>
                        <p className="cta-description">
                            Join thousands of satisfied customers and experience the best food delivery service
                        </p>
                        <div className="cta-actions">
                            <Link to="/demo/restaurants" className="btn btn-primary btn-lg">
                                Create Account
                                <span>→</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-section">
                            <div className="logo">
                                <img src={logo} alt="Starides Logo" className="logo-img" />
                                <span className="logo-text">Starides</span>
                            </div>
                            <p className="footer-description">
                                Your favorite food, delivered fast and fresh to your doorstep.
                            </p>
                        </div>

                        <div className="footer-section">
                            <h4 className="footer-title">For Customers</h4>
                            <ul className="footer-links">
                                <li><Link to="/demo/restaurants">Browse Restaurants</Link></li>
                                <li><Link to="/register">Sign Up</Link></li>
                                <li><Link to="/login">Sign In</Link></li>
                            </ul>
                        </div>

                        <div className="footer-section">
                            <h4 className="footer-title">For Partners</h4>
                            <ul className="footer-links">
                                <li><Link to="/vendor/register">Become a Vendor</Link></li>
                                <li><Link to="/rider/register">Become a Rider</Link></li>
                            </ul>
                        </div>

                        <div className="footer-section">
                            <h4 className="footer-title">Company</h4>
                            <ul className="footer-links">
                                <li><a href="#about">About Us</a></li>
                                <li><a href="#contact">Contact</a></li>
                                <li><a href="#privacy">Privacy Policy</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <p>&copy; 2025 Starides. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
