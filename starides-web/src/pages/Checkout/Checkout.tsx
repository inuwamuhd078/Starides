import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { CREATE_ORDER } from '../../graphql/orders';
import './Checkout.css';

const Checkout: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { items, getTotal, clearCart } = useCart();

    const [paymentMethod, setPaymentMethod] = useState('CASH');
    const [address, setAddress] = useState({
        street: '',
        city: '',
        state: '',
        zipCode: '',
    });
    const [specialInstructions, setSpecialInstructions] = useState('');

    const [createOrder, { loading }] = useMutation(CREATE_ORDER, {
        onCompleted: (data) => {
            clearCart();
            navigate(`/order/${data.createOrder.id}`);
        },
        onError: (error) => {
            alert(`Order failed: ${error.message}`);
        },
    });

    if (!user) {
        navigate('/login');
        return null;
    }

    if (items.length === 0) {
        navigate('/cart');
        return null;
    }

    const restaurantId = items[0].restaurantId;
    const subtotal = getTotal();
    const deliveryFee = 5.00;
    const tax = subtotal * 0.1;
    const total = subtotal + deliveryFee + tax;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!address.street || !address.city || !address.state || !address.zipCode) {
            alert('Please fill in all address fields');
            return;
        }

        try {
            await createOrder({
                variables: {
                    input: {
                        restaurantId,
                        items: items.map(item => ({
                            menuItemId: item.menuItemId,
                            quantity: item.quantity,
                        })),
                        paymentMethod,
                        addressId: '0', // Using temporary address
                        specialInstructions,
                    },
                },
            });
        } catch (err) {
            // Error handled by onError
        }
    };

    return (
        <div className="checkout-page">
            <div className="container">
                <h1 className="page-title">Checkout</h1>

                <form onSubmit={handleSubmit} className="checkout-form">
                    <div className="checkout-content">
                        {/* Left Column - Forms */}
                        <div className="checkout-forms">
                            {/* Delivery Address */}
                            <div className="form-section card">
                                <h2 className="section-title">Delivery Address</h2>

                                <div className="form-group">
                                    <label className="form-label">Street Address</label>
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="123 Main St"
                                        value={address.street}
                                        onChange={(e) => setAddress({ ...address, street: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">City</label>
                                        <input
                                            type="text"
                                            className="input"
                                            placeholder="New York"
                                            value={address.city}
                                            onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">State</label>
                                        <input
                                            type="text"
                                            className="input"
                                            placeholder="NY"
                                            value={address.state}
                                            onChange={(e) => setAddress({ ...address, state: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">ZIP Code</label>
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="10001"
                                        value={address.zipCode}
                                        onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="form-section card">
                                <h2 className="section-title">Payment Method</h2>

                                <div className="payment-options">
                                    <label className="payment-option">
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="CASH"
                                            checked={paymentMethod === 'CASH'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        />
                                        <span>💵 Cash on Delivery</span>
                                    </label>

                                    <label className="payment-option">
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="CARD"
                                            checked={paymentMethod === 'CARD'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        />
                                        <span>💳 Credit/Debit Card</span>
                                    </label>

                                    <label className="payment-option">
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="WALLET"
                                            checked={paymentMethod === 'WALLET'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        />
                                        <span>👛 Digital Wallet</span>
                                    </label>
                                </div>
                            </div>

                            {/* Special Instructions */}
                            <div className="form-section card">
                                <h2 className="section-title">Special Instructions</h2>

                                <textarea
                                    className="input textarea"
                                    placeholder="Add any special instructions for your order..."
                                    value={specialInstructions}
                                    onChange={(e) => setSpecialInstructions(e.target.value)}
                                    rows={4}
                                />
                            </div>
                        </div>

                        {/* Right Column - Order Summary */}
                        <div className="order-summary card">
                            <h2 className="section-title">Order Summary</h2>

                            <div className="summary-items">
                                {items.map((item) => (
                                    <div key={item.menuItemId} className="summary-item">
                                        <span>{item.quantity}x {item.name}</span>
                                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="summary-divider"></div>

                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>

                            <div className="summary-row">
                                <span>Delivery Fee</span>
                                <span>${deliveryFee.toFixed(2)}</span>
                            </div>

                            <div className="summary-row">
                                <span>Tax</span>
                                <span>${tax.toFixed(2)}</span>
                            </div>

                            <div className="summary-divider"></div>

                            <div className="summary-row total-row">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary btn-block"
                                disabled={loading}
                            >
                                {loading ? 'Placing Order...' : 'Place Order'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Checkout;
