import React from 'react';
import { Link } from 'react-router-dom';
import { mockOrders } from '../../data/mockData';
import './Orders.css';

const Orders: React.FC = () => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'DELIVERED':
                return 'badge-success';
            case 'OUT_FOR_DELIVERY':
                return 'badge-info';
            case 'PREPARING':
                return 'badge-warning';
            case 'CANCELLED':
                return 'badge-error';
            default:
                return 'badge-info';
        }
    };

    const formatStatus = (status: string) => {
        return status.replace(/_/g, ' ');
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="orders-page">
            {/* Header */}
            <header className="page-header">
                <div className="container">
                    <div className="header-content">
                        <Link to="/" className="logo">
                            <span className="logo-icon">🚀</span>
                            <span className="logo-text">Starides</span>
                        </Link>
                        <nav className="header-nav">
                            <Link to="/" className="btn btn-ghost">Home</Link>
                            <Link to="/demo/restaurants" className="btn btn-ghost">Restaurants</Link>
                            <div className="user-menu">
                                <span className="user-avatar">👤</span>
                                <span className="user-name">Demo User</span>
                            </div>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Orders Section */}
            <section className="orders-section">
                <div className="container">
                    <div className="section-header">
                        <h1 className="section-title">
                            My <span className="text-gradient">Orders</span>
                        </h1>
                        <p className="section-description">Track and manage your food orders</p>
                    </div>

                    <div className="orders-list">
                        {mockOrders.map((order) => (
                            <div key={order.id} className="order-card card">
                                <div className="order-header">
                                    <div className="order-info">
                                        <div className="restaurant-badge">
                                            <span className="restaurant-logo-small">{order.restaurant.logo}</span>
                                            <span className="restaurant-name-small">{order.restaurant.name}</span>
                                        </div>
                                        <div className="order-number">Order #{order.orderNumber}</div>
                                    </div>
                                    <span className={`badge ${getStatusColor(order.status)}`}>
                                        {formatStatus(order.status)}
                                    </span>
                                </div>

                                <div className="order-items">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="order-item">
                                            <span className="item-quantity">{item.quantity}x</span>
                                            <span className="item-name">{item.name}</span>
                                            <span className="item-price">${item.price.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="order-footer">
                                    <div className="order-meta">
                                        <div className="meta-item">
                                            <span className="meta-icon">📅</span>
                                            <span className="meta-text">{formatDate(order.createdAt)}</span>
                                        </div>
                                        {order.status === 'OUT_FOR_DELIVERY' && (
                                            <div className="meta-item">
                                                <span className="meta-icon">🕐</span>
                                                <span className="meta-text">
                                                    Arriving {formatDate(order.estimatedDeliveryTime)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="order-total">
                                        <span className="total-label">Total:</span>
                                        <span className="total-amount">${order.total.toFixed(2)}</span>
                                    </div>
                                </div>

                                {order.status === 'OUT_FOR_DELIVERY' && (
                                    <div className="order-tracking">
                                        <div className="tracking-progress">
                                            <div className="progress-bar">
                                                <div className="progress-fill" style={{ width: '75%' }}></div>
                                            </div>
                                            <div className="tracking-steps">
                                                <div className="tracking-step completed">
                                                    <div className="step-icon">✓</div>
                                                    <div className="step-label">Confirmed</div>
                                                </div>
                                                <div className="tracking-step completed">
                                                    <div className="step-icon">✓</div>
                                                    <div className="step-label">Preparing</div>
                                                </div>
                                                <div className="tracking-step active">
                                                    <div className="step-icon">🚗</div>
                                                    <div className="step-label">On the way</div>
                                                </div>
                                                <div className="tracking-step">
                                                    <div className="step-icon">📦</div>
                                                    <div className="step-label">Delivered</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {mockOrders.length === 0 && (
                        <div className="no-orders">
                            <div className="no-orders-icon">📦</div>
                            <h3>No orders yet</h3>
                            <p>Start ordering from your favorite restaurants!</p>
                            <Link to="/demo/restaurants" className="btn btn-primary">
                                Browse Restaurants
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Orders;
