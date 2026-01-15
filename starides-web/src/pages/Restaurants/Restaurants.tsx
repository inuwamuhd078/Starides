import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockRestaurants } from '../../data/mockData';
import logo from '../../assets/logo.png';
import './Restaurants.css';

const Restaurants: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCuisine, setSelectedCuisine] = useState('All');

    const cuisines = ['All', 'Italian', 'American', 'Japanese', 'Mexican', 'Thai', 'Asian'];

    const filteredRestaurants = mockRestaurants.filter((restaurant) => {
        const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCuisine =
            selectedCuisine === 'All' || restaurant.cuisine.includes(selectedCuisine);
        return matchesSearch && matchesCuisine;
    });

    return (
        <div className="restaurants-page">
            {/* Header */}
            <header className="page-header">
                <div className="container">
                    <div className="header-content">
                        <Link to="/" className="logo">
                            <img src={logo} alt="Starides Logo" className="logo-img" />
                            <span className="logo-text">Starides</span>
                        </Link>
                        <nav className="header-nav">
                            <Link to="/" className="btn btn-ghost">Home</Link>
                            <Link to="/demo/orders" className="btn btn-ghost">My Orders</Link>
                            <div className="user-menu">
                                <span className="user-avatar">👤</span>
                                <span className="user-name">Demo User</span>
                            </div>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="restaurants-hero">
                <div className="container">
                    <h1 className="hero-title">
                        Discover <span className="text-gradient">Delicious Food</span>
                    </h1>
                    <p className="hero-subtitle">Order from the best restaurants in your area</p>

                    {/* Search and Filters */}
                    <div className="search-section">
                        <div className="search-bar">
                            <span className="search-icon">🔍</span>
                            <input
                                type="text"
                                className="input search-input"
                                placeholder="Search restaurants..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="cuisine-filters">
                            {cuisines.map((cuisine) => (
                                <button
                                    key={cuisine}
                                    className={`filter-btn ${selectedCuisine === cuisine ? 'active' : ''}`}
                                    onClick={() => setSelectedCuisine(cuisine)}
                                >
                                    {cuisine}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Restaurants Grid */}
            <section className="restaurants-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">
                            {filteredRestaurants.length} Restaurant{filteredRestaurants.length !== 1 ? 's' : ''}{' '}
                            Available
                        </h2>
                    </div>

                    <div className="restaurants-grid">
                        {filteredRestaurants.map((restaurant) => (
                            <Link
                                key={restaurant.id}
                                to={`/demo/restaurant/${restaurant.id}`}
                                className="restaurant-card card"
                            >
                                <div className="restaurant-logo">{restaurant.logo}</div>
                                <div className="restaurant-info">
                                    <h3 className="restaurant-name">{restaurant.name}</h3>
                                    <p className="restaurant-description">{restaurant.description}</p>

                                    <div className="restaurant-meta">
                                        <div className="meta-item">
                                            <span className="meta-icon">⭐</span>
                                            <span className="meta-text">
                                                {restaurant.rating} ({restaurant.totalReviews})
                                            </span>
                                        </div>
                                        <div className="meta-item">
                                            <span className="meta-icon">🕐</span>
                                            <span className="meta-text">{restaurant.estimatedDeliveryTime} min</span>
                                        </div>
                                        <div className="meta-item">
                                            <span className="meta-icon">💵</span>
                                            <span className="meta-text">${restaurant.deliveryFee} delivery</span>
                                        </div>
                                    </div>

                                    <div className="restaurant-cuisines">
                                        {restaurant.cuisine.map((c) => (
                                            <span key={c} className="badge badge-info">
                                                {c}
                                            </span>
                                        ))}
                                    </div>

                                    {restaurant.isOpen ? (
                                        <span className="badge badge-success restaurant-status">Open Now</span>
                                    ) : (
                                        <span className="badge badge-error restaurant-status">Closed</span>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>

                    {filteredRestaurants.length === 0 && (
                        <div className="no-results">
                            <div className="no-results-icon">🔍</div>
                            <h3>No restaurants found</h3>
                            <p>Try adjusting your search or filters</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Restaurants;
