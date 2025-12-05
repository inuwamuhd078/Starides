import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './RiderDashboard.css';

const RiderDashboard: React.FC = () => {
    const { logout } = useAuth();

    return (
        <div className="dashboard rider-dashboard">
            <nav className="dashboard-nav">
                <div className="container">
                    <div className="nav-content">
                        <Link to="/" className="logo">
                            <span className="logo-icon">🏍️</span>
                            <span className="logo-text">Starides Rider</span>
                        </Link>
                        <div className="nav-links">
                            <Link to="/rider" className="nav-link">Dashboard</Link>
                            <Link to="/rider/deliveries" className="nav-link">My Deliveries</Link>
                            <Link to="/rider/available" className="nav-link">Available</Link>
                            <Link to="/rider/earnings" className="nav-link">Earnings</Link>
                            <button onClick={logout} className="btn btn-secondary">Logout</button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="dashboard-content">
                <Routes>
                    <Route index element={<RiderHome />} />
                    <Route path="deliveries" element={<RiderDeliveries />} />
                    <Route path="available" element={<AvailableDeliveries />} />
                    <Route path="earnings" element={<RiderEarnings />} />
                </Routes>
            </div>
        </div>
    );
};

const RiderHome: React.FC = () => {

    return (
        <div className="container">
            <h1 className="page-title">Rider Dashboard</h1>

            <div className="stats-grid">
                <div className="stat-card card">
                    <div className="stat-icon">📦</div>
                    <div className="stat-info">
                        <h3>Active Deliveries</h3>
                        <p className="stat-value">0</p>
                        <small>Currently delivering</small>
                    </div>
                </div>

                <div className="stat-card card">
                    <div className="stat-icon">✅</div>
                    <div className="stat-info">
                        <h3>Completed Today</h3>
                        <p className="stat-value">0</p>
                        <small>Deliveries completed</small>
                    </div>
                </div>

                <div className="stat-card card">
                    <div className="stat-icon">💰</div>
                    <div className="stat-info">
                        <h3>Today's Earnings</h3>
                        <p className="stat-value">$0.00</p>
                        <small>Total earned today</small>
                    </div>
                </div>

                <div className="stat-card card">
                    <div className="stat-icon">⭐</div>
                    <div className="stat-info">
                        <h3>Rating</h3>
                        <p className="stat-value">-</p>
                        <small>Customer ratings</small>
                    </div>
                </div>
            </div>

            <div className="quick-actions">
                <Link to="/rider/available" className="action-card card">
                    <div className="action-icon">🔍</div>
                    <h3>Find Deliveries</h3>
                    <p>Browse available delivery requests</p>
                </Link>

                <Link to="/rider/deliveries" className="action-card card">
                    <div className="action-icon">📍</div>
                    <h3>My Deliveries</h3>
                    <p>Track your active deliveries</p>
                </Link>

                <Link to="/rider/earnings" className="action-card card">
                    <div className="action-icon">💵</div>
                    <h3>Earnings</h3>
                    <p>View your earnings history</p>
                </Link>
            </div>
        </div>
    );
};

const RiderDeliveries: React.FC = () => {
    return (
        <div className="container">
            <h1 className="page-title">My Deliveries</h1>
            <div className="empty-state">
                <p>No active deliveries</p>
                <p className="text-secondary">Check available deliveries to start earning</p>
                <Link to="/rider/available" className="btn btn-primary">Find Deliveries</Link>
            </div>
        </div>
    );
};

const AvailableDeliveries: React.FC = () => {
    return (
        <div className="container">
            <h1 className="page-title">Available Deliveries</h1>
            <div className="empty-state">
                <p>No deliveries available right now</p>
                <p className="text-secondary">New delivery requests will appear here</p>
            </div>
        </div>
    );
};

const RiderEarnings: React.FC = () => {

    return (
        <div className="container">
            <h1 className="page-title">Earnings</h1>

            <div className="earnings-summary card">
                <h3>💰 Earnings Summary</h3>
                <div className="earnings-grid">
                    <div className="earning-item">
                        <span className="label">Today</span>
                        <span className="value">$0.00</span>
                    </div>
                    <div className="earning-item">
                        <span className="label">This Week</span>
                        <span className="value">$0.00</span>
                    </div>
                    <div className="earning-item">
                        <span className="label">This Month</span>
                        <span className="value">$0.00</span>
                    </div>
                    <div className="earning-item">
                        <span className="label">All Time</span>
                        <span className="value">$0.00</span>
                    </div>
                </div>
            </div>

            <div className="info-card card">
                <p className="text-secondary">
                    Complete deliveries to start earning. Your earnings will be displayed here.
                </p>
            </div>
        </div>
    );
};

export default RiderDashboard;
