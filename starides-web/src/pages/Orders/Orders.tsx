import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_MY_ORDERS } from '../../graphql/orders';
import logo from '../../assets/logo.png';
import { useCart } from '../../context/CartContext';
import OrderTracker from '../../components/Orders/OrderTracker';
import './Orders.css';

interface OrderItem {
    name: string;
    quantity: number;
    price: number;
}

interface Order {
    id: string;
    orderNumber: string;
    status: string;
    total: number;
    subtotal: number;
    deliveryFee: number;
    tax: number;
    createdAt: string;
    estimatedDeliveryTime: string;
    restaurant: {
        id: string;
        name: string;
        logo: string;
    };
    items: OrderItem[];
}

const Orders: React.FC = () => {
    const navigate = useNavigate();
    const { addItem, clearCart } = useCart();
    const { data, loading, error, refetch } = useQuery(GET_MY_ORDERS, {
        pollInterval: 30000, // Refresh every 30s
    });

    const handleReorder = (order: Order) => {
        // Basic re-order logic: clear cart and add items
        if (window.confirm(`Start a new order from ${order.restaurant.name}? This will clear your current cart.`)) {
            clearCart();
            order.items.forEach(item => {
                // Add each item to the cart
                // Note: We are using a simplified object here as we might not have all item details like 'restaurantId' directly on the item
                // We rely on the order's restaurant info.
                addItem({
                    menuItemId: `${item.name} -${Date.now()} `, // Temporary ID generation if true ID missing
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    restaurantId: order.restaurant.id,
                    restaurantName: order.restaurant.name,
                    specialInstructions: ''
                });
            });
            navigate(`/ cart`); // Go to cart instead of restaurant to checkout immediately
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'DELIVERED': return 'badge-success';
            case 'OUT_FOR_DELIVERY': return 'badge-info';
            case 'PREPARING': return 'badge-warning';
            case 'CANCELLED': return 'badge-error';
            case 'PENDING': return 'badge-warning'; // Yellow for pending
            case 'CONFIRMED': return 'badge-success'; // Green for confirmed
            default: return 'badge-info';
        }
    };

    const formatStatus = (status: string) => status.replace(/_/g, ' ');

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    };

    if (loading) return (
        <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading your orders...</p>
        </div>
    );

    if (error) return (
        <div className="error-container">
            <p>Error loading orders: {error.message}</p>
            <button className="btn btn-primary" onClick={() => refetch()}>Try Again</button>
        </div>
    );

    const orders = data?.myOrders || [];

    return (
        <div className="orders-page">
            <header className="page-header">
                <div className="container">
                    <div className="header-content">
                        <Link to="/" className="logo">
                            <img src={logo} alt="Starides Logo" className="logo-img" />
                            <span className="logo-text">Starides</span>
                        </Link>
                        <nav className="header-nav">
                            <Link to="/" className="btn btn-ghost">Home</Link>
                            <Link to="/restaurants" className="btn btn-ghost">Restaurants</Link>
                        </nav>
                    </div>
                </div>
            </header>

            <section className="orders-section">
                <div className="container">
                    <div className="section-header">
                        <h1 className="section-title">My <span className="text-gradient">Orders</span></h1>
                        <p className="section-description">Track your delivery and view order history</p>
                    </div>

                    {orders.length === 0 ? (
                        <div className="no-orders text-center">
                            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
                            <h3>No orders yet</h3>
                            <p>You haven't placed any orders. Hungry?</p>
                            <Link to="/restaurants" className="btn btn-primary mt-4">Browse Restaurants</Link>
                        </div>
                    ) : (
                        <div className="orders-list">
                            {orders.map((order: Order) => (
                                <div key={order.id} className="order-card card">
                                    <div className="order-header">
                                        <div className="order-info">
                                            <div className="restaurant-badge">
                                                <span className="restaurant-logo-small">{order.restaurant.logo || '🍔'}</span>
                                                <span className="restaurant-name-small">{order.restaurant.name}</span>
                                            </div>
                                            <div className="order-number">#{order.orderNumber}</div>
                                        </div>
                                        <span className={`badge ${getStatusColor(order.status)} `}>
                                            {formatStatus(order.status)}
                                        </span>
                                    </div>

                                    {/* Tracking Stepper for Active Orders */}
                                    {['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY'].includes(order.status) && (
                                        <div className="order-tracking-container">
                                            <OrderTracker status={order.status} />
                                        </div>
                                    )}

                                    <div className="order-items">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="order-item">
                                                <span className="item-quantity">{item.quantity}x</span>
                                                <span className="item-name">{item.name}</span>
                                                <span className="item-price">${item.price.toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="order-pricing-summary">
                                        <div className="pricing-row">
                                            <span>Subtotal</span>
                                            <span>${(order.subtotal || 0).toFixed(2)}</span>
                                        </div>
                                        <div className="pricing-row">
                                            <span>Delivery Fee</span>
                                            <span>${(order.deliveryFee || 0).toFixed(2)}</span>
                                        </div>
                                        <div className="pricing-row">
                                            <span>Tax</span>
                                            <span>${(order.tax || 0).toFixed(2)}</span>
                                        </div>
                                        <div className="pricing-row total">
                                            <span>Total</span>
                                            <span>${order.total.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <div className="order-footer">
                                        <div className="order-meta">
                                            <div className="meta-item">
                                                <span className="meta-icon">📅</span>
                                                <span className="meta-text">{formatDate(order.createdAt)}</span>
                                            </div>
                                            {order.status === 'OUT_FOR_DELIVERY' && (
                                                <div className="meta-item warning">
                                                    <span className="meta-icon">🛵</span>
                                                    <span>Arriving: {formatDate(order.estimatedDeliveryTime)}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="order-actions">
                                            <button
                                                className="btn btn-outline btn-sm"
                                                onClick={() => handleReorder(order)}
                                            >
                                                Order Again
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Orders;
