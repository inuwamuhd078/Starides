import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { gql } from '@apollo/client';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './BrowseRestaurants.css';

const GET_RESTAURANTS = gql`
  query GetRestaurants {
    restaurants(status: APPROVED) {
      id
      name
      description
      logo
      cuisine
      rating
      totalReviews
      isOpen
      deliveryFee
      minimumOrder
      estimatedDeliveryTime
      address {
        city
        state
      }
    }
  }
`;

const BrowseRestaurants: React.FC = () => {
    const { user } = useAuth();
    const { getItemCount } = useCart();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCuisine, setSelectedCuisine] = useState('All');

    const { data, loading, error } = useQuery(GET_RESTAURANTS);

    const restaurants = data?.restaurants || [];

    // Filter restaurants
    const filteredRestaurants = restaurants.filter((restaurant: any) => {
        const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCuisine = selectedCuisine === 'All' || restaurant.cuisine.includes(selectedCuisine);
        return matchesSearch && matchesCuisine;
    });

    // Get unique cuisines
    const allCuisines = restaurants.flatMap((r: any) => r.cuisine);
    const uniqueCuisines: string[] = ['All', ...(Array.from(new Set(allCuisines)) as string[])];

    return (
        <div className="browse-page">
            {/* Header */}
            <header className="browse-header">
                <div className="container">
                    <div className="header-content">
                        <Link to="/" className="logo">
                            <span className="logo-icon">🚀</span>
                            <span className="logo-text">Starides</span>
                        </Link>
                        <div className="header-actions">
                            {user && (
                                <>
                                    <Link to="/orders" className="btn btn-ghost">
                                        My Orders
                                    </Link>
                                    <Link to="/cart" className="btn btn-primary cart-btn">
                                        🛒 Cart ({getItemCount()})
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <div className="container browse-container">
                {/* Search and Filters */}
                <div className="search-section">
                    <h1 className="page-title">Browse Restaurants</h1>
                    <div className="search-bar">
                        <input
                            type="text"
                            className="input search-input"
                            placeholder="Search restaurants..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="cuisine-filters">
                        {uniqueCuisines.map((cuisine: string) => (
                            <button
                                key={cuisine}
                                className={`filter-btn ${selectedCuisine === cuisine ? 'active' : ''}`}
                                onClick={() => setSelectedCuisine(cuisine as string)}
                            >
                                {cuisine}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading restaurants...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="alert alert-error">
                        <span>⚠️</span>
                        <span>Failed to load restaurants. Please try again.</span>
                    </div>
                )}

                {/* Restaurants Grid */}
                {!loading && !error && (
                    <div className="restaurants-grid">
                        {filteredRestaurants.length === 0 ? (
                            <div className="empty-state">
                                <p>No restaurants found</p>
                            </div>
                        ) : (
                            filteredRestaurants.map((restaurant: any) => (
                                <Link
                                    key={restaurant.id}
                                    to={`/restaurant/${restaurant.id}`}
                                    className="restaurant-card card"
                                >
                                    <div className="restaurant-image">
                                        {restaurant.logo ? (
                                            <img src={restaurant.logo} alt={restaurant.name} />
                                        ) : (
                                            <div className="placeholder-image">🍽️</div>
                                        )}
                                        {!restaurant.isOpen && (
                                            <div className="closed-badge">Closed</div>
                                        )}
                                    </div>

                                    <div className="restaurant-info">
                                        <h3 className="restaurant-name">{restaurant.name}</h3>
                                        <p className="restaurant-description">{restaurant.description}</p>

                                        <div className="restaurant-meta">
                                            <div className="meta-item">
                                                <span className="icon">⭐</span>
                                                <span>{restaurant.rating.toFixed(1)} ({restaurant.totalReviews})</span>
                                            </div>
                                            <div className="meta-item">
                                                <span className="icon">🚚</span>
                                                <span>${restaurant.deliveryFee.toFixed(2)}</span>
                                            </div>
                                            <div className="meta-item">
                                                <span className="icon">⏱️</span>
                                                <span>{restaurant.estimatedDeliveryTime} min</span>
                                            </div>
                                        </div>

                                        <div className="restaurant-cuisines">
                                            {restaurant.cuisine.slice(0, 3).map((c: string, i: number) => (
                                                <span key={i} className="cuisine-tag">{c}</span>
                                            ))}
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BrowseRestaurants;
