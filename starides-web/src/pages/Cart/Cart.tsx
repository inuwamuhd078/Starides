import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './Cart.css';

const Cart: React.FC = () => {
    const navigate = useNavigate();
    const { items, removeItem, updateQuantity, getTotal, clearCart } = useCart();

    if (items.length === 0) {
        return (
            <div className="cart-page">
                <div className="container">
                    <div className="empty-cart">
                        <div className="empty-icon">🛒</div>
                        <h2>Your cart is empty</h2>
                        <p>Add some delicious items to get started!</p>
                        <Link to="/restaurants" className="btn btn-primary">
                            Browse Restaurants
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const restaurantName = items[0]?.restaurantName;
    const subtotal = getTotal();
    const deliveryFee = 5.00; // You can get this from restaurant data
    const tax = subtotal * 0.1;
    const total = subtotal + deliveryFee + tax;

    return (
        <div className="cart-page">
            <div className="container">
                <div className="cart-header">
                    <h1 className="page-title">Your Cart</h1>
                    <button onClick={clearCart} className="btn btn-ghost">
                        Clear Cart
                    </button>
                </div>

                <div className="cart-content">
                    <div className="cart-items">
                        <div className="restaurant-info-card card">
                            <h3>🍽️ {restaurantName}</h3>
                        </div>

                        {items.map((item) => (
                            <div key={item.menuItemId} className="cart-item card">
                                <div className="item-details">
                                    <h4 className="item-name">{item.name}</h4>
                                    <p className="item-price">${item.price.toFixed(2)} each</p>
                                </div>

                                <div className="item-actions">
                                    <div className="quantity-controls">
                                        <button
                                            className="qty-btn"
                                            onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                                        >
                                            −
                                        </button>
                                        <span className="quantity">{item.quantity}</span>
                                        <button
                                            className="qty-btn"
                                            onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                                        >
                                            +
                                        </button>
                                    </div>

                                    <div className="item-total">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </div>

                                    <button
                                        className="remove-btn"
                                        onClick={() => removeItem(item.menuItemId)}
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary card">
                        <h3 className="summary-title">Order Summary</h3>

                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>

                        <div className="summary-row">
                            <span>Delivery Fee</span>
                            <span>${deliveryFee.toFixed(2)}</span>
                        </div>

                        <div className="summary-row">
                            <span>Tax (10%)</span>
                            <span>${tax.toFixed(2)}</span>
                        </div>

                        <div className="summary-divider"></div>

                        <div className="summary-row total-row">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>

                        <button
                            className="btn btn-primary btn-block"
                            onClick={() => navigate('/checkout')}
                        >
                            Proceed to Checkout
                        </button>

                        <Link to="/restaurants" className="continue-shopping">
                            ← Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
