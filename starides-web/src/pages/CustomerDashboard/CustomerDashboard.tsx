import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useQuery } from '@apollo/client';
import { GET_MY_ORDERS } from '../../graphql/orders';
import './CustomerDashboard.css';

const CustomerDashboard: React.FC = () => {
    const { logout } = useAuth();
    const { getItemCount } = useCart();

    return (
        <div className="dashboard">
            <nav className="dashboard-nav">
                <div className="container">
                    <div className="nav-content">
                        <Link to="/" className="logo">
                            <span className="logo-icon">🚀</span>
                            <span className="logo-text">Starides</span>
                        </Link>
                        <div className="nav-links">
                            <Link to="/restaurants" className="nav-link">Browse Restaurants</Link>
                            <Link to="/customer/orders" className="nav-link">My Orders</Link>
                            <Link to="/customer/profile" className="nav-link">Profile</Link>
                            <Link to="/cart" className="btn btn-ghost">
                                🛒 Cart ({getItemCount()})
                            </Link>
                            <button onClick={logout} className="btn btn-secondary">Logout</button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="dashboard-content">
                <Routes>
                    <Route index element={<CustomerHome />} />
                    <Route path="orders" element={<CustomerOrders />} />
                    <Route path="profile" element={<CustomerProfile />} />
                </Routes>
            </div>
        </div>
    );
};

const CustomerHome: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className="container dashboard-home">
            <h1 className="page-title">Welcome back, {user?.firstName}! 👋</h1>

            <div className="quick-actions">
                <Link to="/restaurants" className="action-card card">
                    <div className="action-icon">🍽️</div>
                    <h3>Browse Restaurants</h3>
                    <p>Discover delicious food near you</p>
                </Link>

                <Link to="/customer/orders" className="action-card card">
                    <div className="action-icon">📦</div>
                    <h3>My Orders</h3>
                    <p>Track your current and past orders</p>
                </Link>

                <Link to="/customer/profile" className="action-card card">
                    <div className="action-icon">👤</div>
                    <h3>Profile</h3>
                    <p>Manage your account settings</p>
                </Link>
            </div>
        </div>
    );
};

const CustomerOrders: React.FC = () => {
    const { data, loading } = useQuery(GET_MY_ORDERS);
    const orders = data?.myOrders || [];

    return (
        <div className="container">
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
        <div className="container">
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
