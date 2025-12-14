import React, { useState } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useQuery, useMutation } from '@apollo/client';
import { CREATE_RESTAURANT, GET_MY_RESTAURANT, CREATE_MENU_ITEM, GET_MENU_ITEMS, GET_VENDOR_STATS, TOGGLE_RESTAURANT_OPEN } from '../../graphql/restaurants';
import { HomeIcon, OrdersIcon, StoreIcon, ClockIcon, CheckCircleIcon, CurrencyIcon } from '../../components/Icons';
import logo from '../../assets/logo.png';
import './VendorDashboard.css';

const VendorDashboard: React.FC = () => {
    const { logout, user } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="vendor-dashboard">
            {/* Mobile Hamburger Button */}
            <button
                className="mobile-menu-btn"
                onClick={toggleSidebar}
                aria-label="Toggle Menu"
            >
                <span className="hamburger-icon">☰</span>
            </button>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div className="sidebar-overlay" onClick={closeSidebar}></div>
            )}

            {/* Sidebar */}
            <aside className={`admin-sidebar vendor-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <Link to="/" className="sidebar-logo" onClick={closeSidebar}>
                        <img src={logo} alt="Starides Logo" className="sidebar-logo-img" />
                        <span>STARIDES</span>
                    </Link>
                    <button className="close-sidebar-btn hidden-desktop" onClick={closeSidebar}>
                        ✕
                    </button>
                </div>

                <nav className="sidebar-nav">
                    <Link to="/vendor" className="sidebar-nav-item active" onClick={closeSidebar}>
                        <HomeIcon className="sidebar-nav-icon" />
                        <span>Home</span>
                    </Link>
                    <Link to="/vendor/orders" className="sidebar-nav-item" onClick={closeSidebar}>
                        <OrdersIcon className="sidebar-nav-icon" />
                        <span>My Orders</span>
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
            <main className="vendor-main-content">
                <Routes>
                    <Route index element={<VendorHome />} />
                    <Route path="orders" element={<VendorOrders />} />
                    <Route path="menu" element={<VendorMenu />} />
                    <Route path="restaurant" element={<VendorRestaurant />} />
                </Routes>
            </main>
        </div>
    );
};

const VendorHome: React.FC = () => {
    const { user } = useAuth();
    const { data } = useQuery(GET_VENDOR_STATS, {
        variables: { restaurantId: user?.restaurantId },
        skip: !user?.restaurantId,
    });

    const { data: restaurantData } = useQuery(GET_MY_RESTAURANT, {
        variables: { ownerId: user?.id },
        skip: !user?.id,
    });

    const restaurant = restaurantData?.restaurants?.[0] || data?.restaurantStats;
    const stats = data?.restaurantStats;
    const orders = data?.restaurantOrders || [];

    // Calculate order stats
    const pendingOrders = orders.filter((o: any) => o.status === 'PENDING' || o.status === 'CONFIRMED').length;
    const completedOrders = orders.filter((o: any) => o.status === 'DELIVERED').length;

    return (
        <div>
            {/* Restaurant Header */}
            {restaurant && (
                <div className="restaurant-header-section">
                    <h1 className="restaurant-name">{restaurant.name || 'ABU EATS'}</h1>
                    <span className={`status-pill ${restaurant.status === 'ACTIVE' || restaurant.status === 'APPROVED' ? 'status-active' : 'status-pending'}`}>
                        {restaurant.status === 'PENDING' ? 'Pending Approval' : restaurant.status || 'Active'}
                    </span>
                </div>
            )}

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon-wrapper text-info">
                        <OrdersIcon className="stat-icon" />
                    </div>
                    <div className="stat-content">
                        <p className="stat-value">{stats?.totalOrders || 0}</p>
                        <h3>Total Orders</h3>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon-wrapper text-warning">
                        <ClockIcon className="stat-icon" />
                    </div>
                    <div className="stat-content">
                        <p className="stat-value">{pendingOrders}</p>
                        <h3>Pending</h3>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon-wrapper text-success">
                        <CheckCircleIcon className="stat-icon" />
                    </div>
                    <div className="stat-content">
                        <p className="stat-value">{completedOrders}</p>
                        <h3>Completed</h3>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon-wrapper text-primary">
                        <CurrencyIcon className="stat-icon" />
                    </div>
                    <div className="stat-content">
                        <p className="stat-value">${stats?.totalRevenue?.toFixed(0) || '0'}</p>
                        <h3>Revenue</h3>
                    </div>
                </div>
            </div>

            <div className="action-cards-grid">
                <Link to="/vendor/menu" className="action-card">
                    <div className="action-icon-wrapper text-info">
                        <StoreIcon className="action-icon" />
                    </div>
                    <div className="action-content">
                        <h3>Manage Products</h3>
                        <p>{data?.menuItems?.length || 1} of 1 products active</p>
                        <span className="action-link">View Products →</span>
                    </div>
                </Link>

                <Link to="/vendor/orders" className="action-card">
                    <div className="action-icon-wrapper text-primary">
                        <OrdersIcon className="action-icon" />
                    </div>
                    <div className="action-content">
                        <h3>View Orders</h3>
                        <p>{pendingOrders} pending orders to process</p>
                        <span className="action-link">View Orders →</span>
                    </div>
                </Link>
            </div>

            {/* Recent Orders */}
            <div className="recent-orders-section mt-6">
                <h2>Recent Orders</h2>
                {orders.length === 0 ? (
                    <div className="empty-state-card">
                        <p className="text-secondary">No orders yet</p>
                    </div>
                ) : (
                    <div>
                        {/* Orders list would go here */}
                        <div className="empty-state-card">No orders yet</div>
                    </div>
                )}
            </div>
        </div>
    );
};

const VendorOrders: React.FC = () => {
    const { user } = useAuth();
    const { data } = useQuery(GET_MY_RESTAURANT, {
        variables: { ownerId: user?.id },
        skip: !user?.id,
    });
    const restaurant = data?.restaurants?.[0];

    if (!restaurant) {
        return (
            <div>
                <h1 className="page-title">Orders</h1>
                <div className="empty-state">
                    <p>No restaurant registered yet</p>
                    <p className="text-secondary">Create a restaurant to start receiving orders</p>
                    <Link to="/vendor/restaurant" className="btn btn-primary">Create Restaurant</Link>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="page-title">Orders</h1>
            <div className="empty-state">
                <p>No orders yet</p>
                <p className="text-secondary">Orders will appear here when customers place them</p>
            </div>
        </div>
    );
};

const VendorMenu: React.FC = () => {
    const { user } = useAuth();
    const { data: restaurantData } = useQuery(GET_MY_RESTAURANT, {
        variables: { ownerId: user?.id },
        skip: !user?.id,
    });

    const restaurant = restaurantData?.restaurants?.[0];
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newItem, setNewItem] = useState({
        name: '',
        description: '',
        price: '',
        category: 'MAIN_COURSE',
        preparationTime: 15,
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: false,
        spicyLevel: 0
    });

    const { data: menuData, refetch } = useQuery(GET_MENU_ITEMS, {
        variables: { restaurantId: restaurant?.id },
        skip: !restaurant?.id
    });

    const [createMenuItem, { loading: creating }] = useMutation(CREATE_MENU_ITEM, {
        onCompleted: () => {
            setIsModalOpen(false);
            setNewItem({
                name: '',
                description: '',
                price: '',
                category: 'MAIN_COURSE',
                preparationTime: 15,
                isVegetarian: false,
                isVegan: false,
                isGlutenFree: false,
                spicyLevel: 0
            });
            refetch();
            alert('Menu item added successfully!');
        },
        onError: (err) => {
            alert(err.message);
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!restaurant) return;

        createMenuItem({
            variables: {
                restaurantId: restaurant.id,
                input: {
                    ...newItem,
                    price: parseFloat(newItem.price),
                    preparationTime: parseInt(newItem.preparationTime.toString())
                }
            }
        });
    };

    if (!restaurant) {
        return (
            <div>
                <h1 className="page-title">Menu Management</h1>
                <div className="empty-state">
                    <p>No restaurant registered yet</p>
                    <p className="text-secondary">Create a restaurant first to add menu items</p>
                    <Link to="/vendor/restaurant" className="btn btn-primary">Create Restaurant</Link>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Menu Management</h1>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    Add New Item
                </button>
            </div>

            {menuData?.menuItems?.length === 0 ? (
                <div className="empty-state">
                    <p>No menu items yet</p>
                    <p className="text-secondary">Start adding delicious food to your menu!</p>
                </div>
            ) : (
                <div className="menu-grid">
                    {menuData?.menuItems?.map((item: any) => (
                        <div key={item.id} className="menu-item-card card">
                            <div className="menu-item-header">
                                <h3>{item.name}</h3>
                                <span className="price">${item.price}</span>
                            </div>
                            <p className="description">{item.description}</p>
                            <div className="tags">
                                <span className="badge badge-info">{item.category}</span>
                                {item.isVegetarian && <span className="badge badge-success">VEG</span>}
                                {item.spicyLevel > 0 && <span className="badge badge-warning">🌶️ {item.spicyLevel}</span>}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className="modal-overlay" style={{ zIndex: 99999, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.7)' }}>
                    <div className="modal card" style={{ padding: 0, maxHeight: '85vh', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 100000, backgroundColor: 'var(--color-bg-secondary)' }}>
                        <div className="modal-header" style={{ padding: '1.5rem', flexShrink: 0 }}>
                            <h2>Add Menu Item</h2>
                            <button className="btn-ghost" onClick={() => setIsModalOpen(false)}>✕</button>
                        </div>
                        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
                            <div className="form-group">
                                <label>Item Name</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={newItem.name}
                                    onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    className="input"
                                    value={newItem.description}
                                    onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Price ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="input"
                                        value={newItem.price}
                                        onChange={e => setNewItem({ ...newItem, price: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Category</label>
                                    <select
                                        className="input"
                                        value={newItem.category}
                                        onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                                    >
                                        <option value="APPETIZER">Appetizer</option>
                                        <option value="MAIN_COURSE">Main Course</option>
                                        <option value="DESSERT">Dessert</option>
                                        <option value="BEVERAGE">Beverage</option>
                                        <option value="SIDE_DISH">Side Dish</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Prep Time (mins)</label>
                                    <input
                                        type="number"
                                        className="input"
                                        value={newItem.preparationTime}
                                        onChange={e => setNewItem({ ...newItem, preparationTime: parseInt(e.target.value) })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Spicy Level (0-5)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="5"
                                        className="input"
                                        value={newItem.spicyLevel}
                                        onChange={e => setNewItem({ ...newItem, spicyLevel: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div className="checkbox-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={newItem.isVegetarian}
                                        onChange={e => setNewItem({ ...newItem, isVegetarian: e.target.checked })}
                                    /> Vegetarian
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={newItem.isVegan}
                                        onChange={e => setNewItem({ ...newItem, isVegan: e.target.checked })}
                                    /> Vegan
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={newItem.isGlutenFree}
                                        onChange={e => setNewItem({ ...newItem, isGlutenFree: e.target.checked })}
                                    /> Gluten Free
                                </label>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={creating}>
                                    {creating ? 'Adding...' : 'Add Item'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const VendorRestaurant: React.FC = () => {
    const { user } = useAuth();
    const { data, loading: queryLoading } = useQuery(GET_MY_RESTAURANT, {
        variables: { ownerId: user?.id },
        skip: !user?.id,
    });

    const [createRestaurant, { loading: mutationLoading, error }] = useMutation(CREATE_RESTAURANT, {
        refetchQueries: [{ query: GET_MY_RESTAURANT, variables: { ownerId: user?.id } }],
    });

    // Import the Toggle Mutation
    const [toggleOpen] = useMutation(TOGGLE_RESTAURANT_OPEN);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        cuisine: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        phone: '',
        email: '',
        deliveryFee: 5.0,
        minimumOrder: 10.0,
        estimatedDeliveryTime: 30,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleToggleOpen = async (restaurantId: string) => {
        try {
            await toggleOpen({ variables: { id: restaurantId } });
        } catch (err) {
            console.error('Failed to toggle status:', err);
            alert('Failed to update status');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createRestaurant({
                variables: {
                    input: {
                        ...formData,
                        cuisine: formData.cuisine.split(',').map((c) => c.trim()),
                        latitude: 0, // Mock coordinates for now
                        longitude: 0,
                    },
                },
            });
            alert('Restaurant created successfully!');
        } catch (err) {
            console.error(err);
        }
    };

    if (queryLoading) return <div className="container">Loading...</div>;

    const restaurant = data?.restaurants?.[0];

    if (restaurant) {
        return (
            <div className="container">
                <h1 className="page-title">Restaurant Management</h1>
                <div className="card">
                    <div className="restaurant-header">
                        <h2>{restaurant.name}</h2>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <span className={`status-badge status-${restaurant.status?.toLowerCase() || 'pending'}`}>
                                {restaurant.status || 'Pending'}
                            </span>
                            {/* Open/Close Toggle */}
                            <label className="toggle-switch" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={restaurant.isOpen}
                                    onChange={() => handleToggleOpen(restaurant.id)}
                                    style={{ width: '20px', height: '20px' }}
                                />
                                <span style={{ fontWeight: 600, color: restaurant.isOpen ? 'var(--color-success)' : 'var(--color-text-secondary)' }}>
                                    {restaurant.isOpen ? 'OPEN FOR ORDERS' : 'CLOSED'}
                                </span>
                            </label>
                        </div>
                    </div>

                    <div className="restaurant-details">
                        <div className="detail-group">
                            <label>Description</label>
                            <p>{restaurant.description}</p>
                        </div>

                        <div className="detail-group">
                            <label>Cuisine</label>
                            <p>{restaurant.cuisine.join(', ')}</p>
                        </div>

                        <div className="detail-group">
                            <label>Contact</label>
                            <p>{restaurant.phone} | {restaurant.email}</p>
                        </div>

                        <div className="detail-group">
                            <label>Address</label>
                            <p>{restaurant.address.street}, {restaurant.address.city}, {restaurant.address.state} {restaurant.address.zipCode}</p>
                        </div>

                        <div className="detail-group">
                            <label>Settings</label>
                            <p>Delivery Fee: ${restaurant.deliveryFee}</p>
                            <p>Min Order: ${restaurant.minimumOrder}</p>
                            <p>Est. Time: {restaurant.estimatedDeliveryTime} min</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <h1 className="page-title">Restaurant Management</h1>

            <div className="card">
                <h2>Create Your Restaurant</h2>
                <form onSubmit={handleSubmit} className="restaurant-form">
                    {error && <div className="alert alert-error">{error.message}</div>}

                    <div className="form-group">
                        <label>Restaurant Name</label>
                        <input
                            type="text"
                            name="name"
                            className="input"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            className="input textarea"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Cuisines (comma separated)</label>
                        <input
                            type="text"
                            name="cuisine"
                            className="input"
                            placeholder="Italian, Pizza, Pasta"
                            value={formData.cuisine}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                className="input"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                className="input"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <h3>Address</h3>
                    <div className="form-group">
                        <label>Street</label>
                        <input
                            type="text"
                            name="street"
                            className="input"
                            value={formData.street}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>City</label>
                            <input
                                type="text"
                                name="city"
                                className="input"
                                value={formData.city}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>State</label>
                            <input
                                type="text"
                                name="state"
                                className="input"
                                value={formData.state}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Zip Code</label>
                            <input
                                type="text"
                                name="zipCode"
                                className="input"
                                value={formData.zipCode}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <h3>Settings</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Delivery Fee ($)</label>
                            <input
                                type="number"
                                name="deliveryFee"
                                className="input"
                                value={formData.deliveryFee}
                                onChange={handleChange}
                                step="0.01"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Min Order ($)</label>
                            <input
                                type="number"
                                name="minimumOrder"
                                className="input"
                                value={formData.minimumOrder}
                                onChange={handleChange}
                                step="0.01"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Est. Delivery Time (min)</label>
                            <input
                                type="number"
                                name="estimatedDeliveryTime"
                                className="input"
                                value={formData.estimatedDeliveryTime}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={mutationLoading}>
                        {mutationLoading ? 'Creating...' : 'Create Restaurant'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default VendorDashboard;
