import React, { useState } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useQuery, useMutation } from '@apollo/client';
import { CREATE_RESTAURANT, GET_MY_RESTAURANT, CREATE_MENU_ITEM, GET_MENU_ITEMS, GET_VENDOR_STATS } from '../../graphql/restaurants';
import AnalyticsChart from '../../components/AnalyticsChart';
import './VendorDashboard.css';

const VendorDashboard: React.FC = () => {
    const { logout } = useAuth();

    return (
        <div className="dashboard vendor-dashboard">
            <nav className="dashboard-nav">
                <div className="container">
                    <div className="nav-content">
                        <Link to="/" className="logo">
                            <span className="logo-icon">🍽️</span>
                            <span className="logo-text">Starides Vendor</span>
                        </Link>
                        <div className="nav-links">
                            <Link to="/vendor" className="nav-link">Dashboard</Link>
                            <Link to="/vendor/orders" className="nav-link">Orders</Link>
                            <Link to="/vendor/menu" className="nav-link">Menu</Link>
                            <Link to="/vendor/restaurant" className="nav-link">Restaurant</Link>
                            <button onClick={logout} className="btn btn-secondary">Logout</button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="dashboard-content">
                <Routes>
                    <Route index element={<VendorHome />} />
                    <Route path="orders" element={<VendorOrders />} />
                    <Route path="menu" element={<VendorMenu />} />
                    <Route path="restaurant" element={<VendorRestaurant />} />
                </Routes>
            </div>
        </div>
    );
};

const VendorHome: React.FC = () => {
    const { user } = useAuth();
    const { data } = useQuery(GET_VENDOR_STATS, {
        variables: { restaurantId: user?.restaurantId },
        skip: !user?.restaurantId,
    });

    const restaurant = data?.restaurantStats;
    const orders = data?.restaurantOrders || [];

    // Process orders for chart (Revenue by Date)
    const chartData = React.useMemo(() => {
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();

        return last7Days.map(date => {
            const dayRevenue = orders
                .filter((o: any) => o.createdAt.startsWith(date))
                .reduce((sum: number, o: any) => sum + o.total, 0);
            return {
                name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
                value: dayRevenue
            };
        });
    }, [orders]);

    return (
        <div className="container">
            <h1 className="page-title">Vendor Dashboard</h1>

            <div className="stats-grid">
                <div className="stat-card card">
                    <div className="stat-icon">📦</div>
                    <div className="stat-info">
                        <h3>Total Orders</h3>
                        <p className="stat-value">{restaurant?.totalOrders || 0}</p>
                        <small>All time orders</small>
                    </div>
                </div>

                <div className="stat-card card">
                    <div className="stat-icon">💰</div>
                    <div className="stat-info">
                        <h3>Revenue</h3>
                        <p className="stat-value">${restaurant?.totalRevenue?.toFixed(2) || '0.00'}</p>
                        <small>All time earnings</small>
                    </div>
                </div>

                <div className="stat-card card">
                    <div className="stat-icon">⭐</div>
                    <div className="stat-info">
                        <h3>Avg. Order</h3>
                        <p className="stat-value">${restaurant?.averageOrderValue?.toFixed(2) || '0.00'}</p>
                        <small>Per order average</small>
                    </div>
                </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <AnalyticsChart
                    title="Revenue - Last 7 Days"
                    data={chartData}
                    color="#0ea5e9"
                />
            </div>

            <div className="quick-actions">
                <Link to="/vendor/restaurant" className="action-card card">
                    <div className="action-icon">🏪</div>
                    <h3>Manage Restaurant</h3>
                    <p>Update info, hours, and settings</p>
                </Link>

                <Link to="/vendor/menu" className="action-card card">
                    <div className="action-icon">📋</div>
                    <h3>Manage Menu</h3>
                    <p>Add, edit, or remove menu items</p>
                </Link>

                <Link to="/vendor/orders" className="action-card card">
                    <div className="action-icon">📦</div>
                    <h3>View Orders</h3>
                    <p>Track and manage incoming orders</p>
                </Link>
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
            <div className="container">
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
        <div className="container">
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
            <div className="container">
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
        <div className="container">
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
                        <span className={`status-badge status-${restaurant.status?.toLowerCase() || 'pending'}`}>
                            {restaurant.status || 'Pending'}
                        </span>
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
