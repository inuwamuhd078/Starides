import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_RESTAURANT_WITH_MENU } from '../../graphql/queries';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './RestaurantDetail.css';

const RestaurantDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addItem, getItemCount } = useCart();

    const { data, loading, error } = useQuery(GET_RESTAURANT_WITH_MENU, {
        variables: { id },
    });

    const restaurant = data?.restaurant;
    const menuItems = data?.menuItems || [];

    const handleAddToCart = (item: any) => {
        if (!user) {
            navigate('/login');
            return;
        }

        addItem({
            menuItemId: item.id,
            name: item.name,
            price: item.price,
            quantity: 1,
            restaurantId: restaurant.id,
            restaurantName: restaurant.name,
        });
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading restaurant...</p>
            </div>
        );
    }

    if (error || !restaurant) {
        return (
            <div className="error-container">
                <p>Failed to load restaurant</p>
                <Link to="/restaurants" className="btn btn-primary">
                    Back to Restaurants
                </Link>
            </div>
        );
    }

    // Group menu items by category
    const groupedItems = menuItems.reduce((acc: any, item: any) => {
        if (!acc[item.category]) {
            acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
    }, {});

    return (
        <div className="restaurant-detail-page">
            {/* Header */}
            <header className="detail-header">
                <div className="container">
                    <div className="header-content">
                        <Link to="/restaurants" className="back-btn">
                            ← Back
                        </Link>
                        <Link to="/cart" className="btn btn-primary cart-btn">
                            🛒 Cart ({getItemCount()})
                        </Link>
                    </div>
                </div>
            </header>

            {/* Restaurant Info */}
            <div className="restaurant-hero">
                <div className="container">
                    <div className="hero-content">
                        <h1 className="restaurant-title">{restaurant.name}</h1>
                        <p className="restaurant-desc">{restaurant.description}</p>

                        <div className="restaurant-stats">
                            <div className="stat">
                                <span className="icon">⭐</span>
                                <span>{restaurant.rating.toFixed(1)} ({restaurant.totalReviews} reviews)</span>
                            </div>
                            <div className="stat">
                                <span className="icon">🚚</span>
                                <span>${restaurant.deliveryFee.toFixed(2)} delivery</span>
                            </div>
                            <div className="stat">
                                <span className="icon">⏱️</span>
                                <span>{restaurant.estimatedDeliveryTime} min</span>
                            </div>
                            <div className="stat">
                                <span className="icon">💵</span>
                                <span>${restaurant.minimumOrder.toFixed(2)} minimum</span>
                            </div>
                        </div>

                        <div className="restaurant-cuisines">
                            {restaurant.cuisine.map((c: string, i: number) => (
                                <span key={i} className="cuisine-badge">{c}</span>
                            ))}
                        </div>

                        {!restaurant.isOpen && (
                            <div className="closed-notice">
                                ⚠️ This restaurant is currently closed
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Menu */}
            <div className="container menu-container">
                <h2 className="menu-title">Menu</h2>

                {Object.keys(groupedItems).length === 0 ? (
                    <p className="empty-menu">No menu items available</p>
                ) : (
                    Object.entries(groupedItems).map(([category, items]: [string, any]) => (
                        <div key={category} className="menu-category">
                            <h3 className="category-title">{category.replace('_', ' ')}</h3>
                            <div className="menu-items">
                                {items.map((item: any) => (
                                    <div key={item.id} className="menu-item card">
                                        <div className="item-info">
                                            <h4 className="item-name">{item.name}</h4>
                                            <p className="item-description">{item.description}</p>

                                            <div className="item-tags">
                                                {item.isVegetarian && <span className="tag">🌱 Vegetarian</span>}
                                                {item.isVegan && <span className="tag">🥬 Vegan</span>}
                                                {item.isGlutenFree && <span className="tag">🌾 Gluten-Free</span>}
                                                {item.spicyLevel > 0 && (
                                                    <span className="tag">🌶️ Spicy {item.spicyLevel}</span>
                                                )}
                                            </div>

                                            <div className="item-footer">
                                                <span className="item-price">${item.price.toFixed(2)}</span>
                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() => handleAddToCart(item)}
                                                    disabled={!item.isAvailable || !restaurant.isOpen}
                                                >
                                                    {!item.isAvailable ? 'Unavailable' : 'Add to Cart'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default RestaurantDetail;
