import React, { useState } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { HomeIcon, OrdersIcon, CheckCircleIcon, CurrencyIcon, StarIcon } from '../../components/Icons';
import { AreaChartCard, BarChartCard } from '../../components/Charts';
import InstallButton from '../../components/PWA/InstallButton';
import logo from '../../assets/logo.png';
import './RiderDashboard.css';

// Mock Data
const earningsData = [
    { name: 'Mon', value: 45 },
    { name: 'Tue', value: 80 },
    { name: 'Wed', value: 120 },
    { name: 'Thu', value: 90 },
    { name: 'Fri', value: 150 },
    { name: 'Sat', value: 180 },
    { name: 'Sun', value: 160 },
];

const performanceData = [
    { name: 'Mon', value: 5 },
    { name: 'Tue', value: 8 },
    { name: 'Wed', value: 12 },
    { name: 'Thu', value: 10 },
    { name: 'Fri', value: 15 },
    { name: 'Sat', value: 18 },
    { name: 'Sun', value: 14 },
];

const RiderDashboard: React.FC = () => {
    const { logout, user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="rider-dashboard">
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
                        <img src={logo} alt="Starides Logo" className="sidebar-logo-img" />
                        <span>STARIDES</span>
                    </Link>
                    <button className="close-sidebar-btn hidden-desktop" onClick={closeSidebar}>
                        ✕
                    </button>
                </div>

                <nav className="sidebar-nav">
                    <Link to="/rider" className="sidebar-nav-item active" onClick={closeSidebar}>
                        <HomeIcon className="sidebar-nav-icon" />
                        <span>Home</span>
                    </Link>
                    <Link to="/rider/deliveries" className="sidebar-nav-item" onClick={closeSidebar}>
                        <OrdersIcon className="sidebar-nav-icon" />
                        <span>My Orders</span>
                    </Link>
                </nav>

                <div className="sidebar-footer">
                    {/* PWA Install Button */}
                    <InstallButton />

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
            <main className="rider-main-content">
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
    const { user } = useAuth();
    const [isOnline, setIsOnline] = useState(false);

    return (
        <div>
            <div className="dashboard-header">
                <div>
                    <h1 className="page-title">Rider Dashboard</h1>
                    <p className="user-welcome">{user?.firstName || 'Abu'}</p>
                </div>
                <button
                    className={`status-toggle-btn ${isOnline ? 'online' : 'offline'}`}
                    onClick={() => setIsOnline(!isOnline)}
                >
                    {isOnline ? 'Make Offline' : 'Offline'}
                    <span className="toggle-icon">{isOnline ? '●' : '○'}</span>
                </button>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon-wrapper text-info">
                        <OrdersIcon className="stat-icon" />
                    </div>
                    <div className="stat-content">
                        <p className="stat-value">0</p>
                        <h3>Active</h3>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon-wrapper text-secondary">
                        <CheckCircleIcon className="stat-icon" />
                    </div>
                    <div className="stat-content">
                        <p className="stat-value">0</p>
                        <h3>Completed</h3>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon-wrapper text-primary">
                        <CurrencyIcon className="stat-icon" />
                    </div>
                    <div className="stat-content">
                        <p className="stat-value">$0.00</p>
                        <h3>Earnings</h3>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon-wrapper text-warning">
                        <StarIcon className="stat-icon" />
                    </div>
                    <div className="stat-content">
                        <p className="stat-value">-</p>
                        <h3>Rating</h3>
                    </div>
                </div>
            </div>

            {/* Analytics Section */}
            <div className="analytics-section">
                <h2 className="section-title">Weekly Performance</h2>
                <div className="charts-grid">
                    <AreaChartCard title="Earnings Trend" data={earningsData} color="var(--color-primary)" className="chart-large" />
                    <BarChartCard title="Deliveries Completed" data={performanceData} color="var(--color-success)" />
                </div>
            </div>

            <div className="home-content">

                <div className="section-container">
                    <div className="section-header">
                        <h2>View Deliveries</h2>
                        <span className="arrow-icon">→</span>
                    </div>
                    <p className="text-secondary">0 active deliveries waiting</p>
                </div>

                <div className="section-container mt-6">
                    <h2>Recent Deliveries</h2>
                    <div className="empty-state-card">
                        <p className="text-secondary">No deliveries yet</p>
                    </div>
                </div>
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
