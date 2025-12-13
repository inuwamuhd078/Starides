import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { useQuery } from '@apollo/client';
import { GET_MY_ORDERS } from '../../graphql/orders';
import './CustomerDashboard.css';

const CustomerDashboard: React.FC = () => {
    const { logout, user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { getItemCount } = useCart();

    return (
        <div className="admin-dashboard">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <Link to="/" className="sidebar-logo">
                        <span className="sidebar-logo-icon">⭐</span>
                        <span>STARIDES</span>
                    </Link>
                </div>

                <nav className="sidebar-nav">
                    <Link to="/customer" className="sidebar-nav-item active">
                        <span className="sidebar-nav-icon">🏠</span>
                        <span>Home</span>
                    </Link>
                    <Link to="/orders" className="sidebar-nav-item">
                        <span className="sidebar-nav-icon">📋</span>
                        <span>My Orders</span>
                    </Link>
                    <Link to="/cart" className="sidebar-nav-item">
                        <span className="sidebar-nav-icon">🛒</span>
                        <span>Cart ({getItemCount()})</span>
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
                    <Route index element={<CustomerHome />} />
                    <Route path="orders" element={<CustomerOrders />} />
                    <Route path="profile" element={<CustomerProfile />} />
                </Routes>
            </main>
        </div>
    );
};

const CustomerHome: React.FC = () => {
    const { user } = useAuth();

    return (
        <div>
            <h1 className="page-title">Welcome back, {user?.firstName}! 👋</h1>

            <div className="action-cards-grid">
                <Link to="/restaurants" className="action-card">
                    <div className="action-icon">🍽️</div>
                    <h3>Browse Restaurants</h3>
                    <p>Discover delicious food near you</p>
                    <span className="action-link">View Restaurants →</span>
                </Link>

                <Link to="/orders" className="action-card">
                    <div className="action-icon">📦</div>
                    <h3>My Orders</h3>
                    <p>Track your current and past orders</p>
                    <span className="action-link">View Orders →</span>
                </Link>
            </div>
        </div>
    );
};

const CustomerOrders: React.FC = () => {
    const { data, loading } = useQuery(GET_MY_ORDERS);
    const orders = data?.myOrders || [];

    return (
        <div>
            <h1 className="page-title">My Orders</h1>

            {loading && <p>Loading orders...</p>}

            {!loading && orders.length === 0 && (
                <div className="empty-state">
                    <p>No orders yet</p>
                    <Link to="/restaurants" className="btn btn-primary">Start Ordering</Link>
                </div>
            )}

            <div className="orders-list">
                {orders.map((order: any) => (
                    <div key={order.id} className="order-card card">
                        <div className="order-header">
                            <div>
                                <h3>{order.restaurant.name}</h3>
                                <p className="order-number">Order #{order.orderNumber}</p>
                            </div>
                            <span className={`status-badge status-${order.status.toLowerCase()}`}>
                                {order.status}
                            </span>
                        </div>

                        <div className="order-items">
                            {order.items.map((item: any, i: number) => (
                                <p key={i}>{item.quantity}x {item.name}</p>
                            ))}
                        </div>

                        <div className="order-footer">
                            <span className="order-total">${order.total.toFixed(2)}</span>
                            <span className="order-date">
                                {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CustomerProfile: React.FC = () => {
    const { user } = useAuth();

    return (
        <div>
            <h1 className="page-title">My Profile</h1>

            <div className="profile-card card">
                <h3>Personal Information</h3>
                <div className="profile-info">
                    <div className="info-row">
                        <span className="label">Name:</span>
                        <span>{user?.firstName} {user?.lastName}</span>
                    </div>
                    <div className="info-row">
                        <span className="label">Email:</span>
                        <span>{user?.email}</span>
                    </div>
                    <div className="info-row">
                        <span className="label">Phone:</span>
                        <span>{user?.phone}</span>
                    </div>
                    <div className="info-row">
                        <span className="label">Role:</span>
                        <span className="role-badge">{user?.role}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboard;
