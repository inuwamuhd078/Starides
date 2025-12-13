import React, { useState } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import './RiderDashboard.css';

const RiderDashboard: React.FC = () => {
    const { logout, user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="rider-dashboard admin-dashboard">
            {/* Mobile Hamburger Button */}
            <button
                className="mobile-menu-btn"
                onClick={toggleSidebar}
                aria-label="Toggle Menu"
            >
                <span className="hamburger-icon">☰</span>
            </button>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div className="sidebar-overlay" onClick={closeSidebar}></div>
            )}

            {/* Sidebar */}
            <aside className={`admin-sidebar rider-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <Link to="/" className="sidebar-logo" onClick={closeSidebar}>
                        <span className="sidebar-logo-icon">⭐</span>
                        <span>STARIDES</span>
                    </Link>
                    <button className="close-sidebar-btn hidden-desktop" onClick={closeSidebar}>
                        ✕
                    </button>
                </div>

                <nav className="sidebar-nav">
                    <Link to="/rider" className="sidebar-nav-item active" onClick={closeSidebar}>
                        <span className="sidebar-nav-icon">🏠</span>
                        <span>Home</span>
                    </Link>
                    <Link to="/rider/deliveries" className="sidebar-nav-item" onClick={closeSidebar}>
                        <span className="sidebar-nav-icon">📋</span>
                        <span>My Deliveries</span>
                    </Link>
                </nav>

                <div className="sidebar-footer">
                    {/* Theme Toggle */}
                    <button onClick={toggleTheme} className="logout-btn" style={{ marginBottom: '1rem' }}>
                        <span>{theme === 'light' ? '🌙' : '☀️'}</span>
                        <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                    </button>

                    <div className="user-profile">
                        <div className="user-avatar">
                            {user?.firstName?.charAt(0) || 'A'}
                        </div>
                        <div className="user-info">
                            <p className="user-name">{user?.firstName || 'Abubakar'} {user?.lastName || 'Lamido'}</p>
                            <p className="user-email">{user?.email || 'lamidoteo@gmail.com'}</p>
                        </div>
                    </div>
                    <button onClick={logout} className="logout-btn">
                        <span>🚪</span>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main-content">
                <Routes>
                    <Route index element={<RiderHome />} />
                    <Route path="deliveries" element={<RiderDeliveries />} />
                    <Route path="available" element={<AvailableDeliveries />} />
                    <Route path="earnings" element={<RiderEarnings />} />
                </Routes>
            </main>
        </div>
    );
};

const RiderHome: React.FC = () => {

    return (
        <div>
            <h1 className="page-title">Rider Dashboard</h1>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">📦</div>
                    <p className="stat-value">0</p>
                    <h3>Active Deliveries</h3>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">✅</div>
                    <p className="stat-value">0</p>
                    <h3>Completed Today</h3>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">💵</div>
                    <p className="stat-value">$0</p>
                    <h3>Today's Earnings</h3>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">⭐</div>
                    <p className="stat-value">-</p>
                    <h3>Rating</h3>
                </div>
            </div>

            <div className="action-cards-grid">
                <Link to="/rider/available" className="action-card">
                    <div className="action-icon">🔍</div>
                    <h3>Find Deliveries</h3>
                    <p>Browse available delivery requests</p>
                    <span className="action-link">View Available →</span>
                </Link>

                <Link to="/rider/deliveries" className="action-card">
                    <div className="action-icon">📍</div>
                    <h3>My Deliveries</h3>
                    <p>Track your active deliveries</p>
                    <span className="action-link">View Deliveries →</span>
                </Link>
            </div>
        </div>
    );
};

const RiderDeliveries: React.FC = () => {
    return (
        <div>
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
        <div>
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
        <div>
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
