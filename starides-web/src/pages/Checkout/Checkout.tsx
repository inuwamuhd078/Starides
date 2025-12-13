import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { CREATE_ORDER } from '../../graphql/orders';
import { ADD_ADDRESS } from '../../graphql/queries';
import AddressSelector from '../../components/Map/AddressSelector';
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
        latitude: 0,
        longitude: 0
    });
    const [specialInstructions, setSpecialInstructions] = useState('');

    const [addAddress] = useMutation(ADD_ADDRESS);
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
            // 1. Save the address first
            const addressLabel = `Delivery ${new Date().toLocaleTimeString()}`; // Unique label
            const { data: addressData } = await addAddress({
                variables: {
                    input: {
                        label: addressLabel,
                        street: address.street,
                        city: address.city,
                        state: address.state,
                        zipCode: address.zipCode,
                        latitude: (address as any).latitude || 40.7128,
                        longitude: (address as any).longitude || -74.0060,
                        isDefault: true
                    }
                }
            });

            // 2. Find the new address ID
            // The mutation returns the updated User object with addresses
            const newAddress = addressData.addAddress.addresses.find(
                (a: any) => a.label === addressLabel
            );

            if (!newAddress || !newAddress.id) {
                throw new Error('Failed to save delivery address');
            }

            // 3. Create order with the new address ID
            await createOrder({
                variables: {
                    input: {
                        restaurantId,
                        items: items.map(item => ({
                            menuItemId: item.menuItemId,
                            quantity: item.quantity,
                            specialInstructions: item.specialInstructions // Pass item-level instructions if any
                        })),
                        paymentMethod,
                        addressId: newAddress.id,
                        specialInstructions,
                    },
                },
            });
        } catch (err) {
            console.error('Checkout error:', err);
            alert('Failed to place order. Please try again.');
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
                                <AddressSelector
                                    onAddressSelect={(newAddress) => {
                                        setAddress({
                                            street: newAddress.street,
                                            city: newAddress.city,
                                            state: newAddress.state,
                                            zipCode: newAddress.zipCode,
                                            latitude: newAddress.latitude,
                                            longitude: newAddress.longitude
                                        });
                                    }}
                                />
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
