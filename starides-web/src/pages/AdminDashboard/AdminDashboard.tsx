import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useQuery, useMutation, gql } from '@apollo/client';
import { HomeIcon, OrdersIcon, UsersIcon, StoreIcon, ClockIcon, BikeIcon, CurrencyIcon } from '../../components/Icons';
import logo from '../../assets/logo.png';
import './AdminDashboard.css';

const GET_ADMIN_STATS = gql`
  query GetAdminStats {
    adminStats {
      totalOrders
      totalRevenue
      averageOrderValue
      totalCustomers
    }
    orders {
      id
      total
      createdAt
    }
    users {
      id
      firstName
      lastName
      email
      role
      isActive
    }
    restaurants {
      id
      name
      status
      owner {
        firstName
        lastName
      }
    }
  }
`;

const AdminDashboard: React.FC = () => {
    const { logout, user } = useAuth();
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="admin-dashboard">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <Link to="/" className="sidebar-logo">
                        <img src={logo} alt="Starides Logo" className="sidebar-logo-img" />
                        <span>STARIDES</span>
                    </Link>
                </div>

                <nav className="sidebar-nav">
                    <Link to="/admin" className="sidebar-nav-item active">
                        <HomeIcon className="sidebar-nav-icon" />
                        <span>Home</span>
                    </Link>
                    <Link to="/admin/orders" className="sidebar-nav-item">
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
            <main className="admin-main-content">
                <Routes>
                    <Route index element={<AdminHome />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="restaurants" element={<AdminRestaurants />} />
                    <Route path="orders" element={<AdminOrders />} />
                </Routes>
            </main>
        </div>
    );
};

const AdminHome: React.FC = () => {
    const { data } = useQuery(GET_ADMIN_STATS);
    const stats = data?.adminStats;
    const restaurants = data?.restaurants || [];
    const users = data?.users || [];

    // Count pending vendors and riders
    const pendingVendors = restaurants.filter((r: any) => r.status === 'PENDING').length;
    const pendingRiders = users.filter((u: any) => u.role === 'RIDER' && !u.isActive).length;
    const totalRiders = users.filter((u: any) => u.role === 'RIDER').length;
    const totalVendors = restaurants.length;
    const totalUsers = users.filter((u: any) => u.role === 'CUSTOMER').length;

    return (
        <div>
            <h1 className="page-title">Admin Dashboard</h1>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon-wrapper text-secondary">
                        <UsersIcon className="stat-icon" />
                    </div>
                    <div className="stat-content">
                        <p className="stat-value">{totalUsers}</p>
                        <h3>Users</h3>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon-wrapper text-accent">
                        <StoreIcon className="stat-icon" />
                    </div>
                    <div className="stat-content">
                        <p className="stat-value">{totalVendors}</p>
                        <h3>Vendors</h3>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon-wrapper text-warning">
                        <ClockIcon className="stat-icon" />
                    </div>
                    <div className="stat-content">
                        <p className="stat-value">{pendingVendors}</p>
                        <h3>Pending</h3>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon-wrapper text-success">
                        <BikeIcon className="stat-icon" />
                    </div>
                    <div className="stat-content">
                        <p className="stat-value">{totalRiders}</p>
                        <h3>Riders</h3>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon-wrapper text-info">
                        <OrdersIcon className="stat-icon" />
                    </div>
                    <div className="stat-content">
                        <p className="stat-value">{stats?.totalOrders || 0}</p>
                        <h3>Orders</h3>
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
                <Link to="/admin/restaurants" className="action-card">
                    <div className="action-icon-wrapper text-primary">
                        <StoreIcon className="action-icon" />
                    </div>
                    <div className="action-content">
                        <h3>Manage Vendors</h3>
                        <p>{pendingVendors} vendors pending approval</p>
                        <span className="action-link">View Vendors →</span>
                    </div>
                </Link>

                <Link to="/admin/users" className="action-card">
                    <div className="action-icon-wrapper text-primary">
                        <BikeIcon className="action-icon" />
                    </div>
                    <div className="action-content">
                        <h3>Manage Riders</h3>
                        <p>{pendingRiders} riders pending verification</p>
                        <span className="action-link">View Riders →</span>
                    </div>
                </Link>
            </div>
        </div>
    );
};

const AdminUsers: React.FC = () => {
    const { data, loading } = useQuery(GET_ADMIN_STATS);
    const users = data?.users || [];

    return (
        <div>
            <h1 className="page-title">User Management</h1>

            {loading && <p>Loading users...</p>}

            <div className="users-table">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user: any) => (
                            <tr key={user.id}>
                                <td>{user.firstName} {user.lastName}</td>
                                <td>{user.email}</td>
                                <td><span className="role-badge">{user.role}</span></td>
                                <td>
                                    <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                                        {user.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {users.length === 0 && !loading && (
                    <div className="empty-state">No users found</div>
                )}
            </div>
        </div>
    );
};

const AdminRestaurants: React.FC = () => {
    const [filter, setFilter] = React.useState<string>('ALL');
    const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const { data, loading, refetch } = useQuery(gql`
        query GetAllRestaurants {
            restaurants {
                id
                name
                status
                cuisine
                phone
                email
                address {
                    city
                    state
                }
                owner {
                    id
                    firstName
                    lastName
                    email
                }
            }
        }
    `);

    const [updateRestaurantStatus] = useMutation(gql`
        mutation UpdateRestaurantStatus($id: ID!, $status: String!) {
            updateRestaurantStatus(id: $id, status: $status) {
                id
                name
                status
            }
        }
    `);

    const handleStatusUpdate = async (restaurantId: string, newStatus: string, restaurantName: string) => {
        try {
            await updateRestaurantStatus({
                variables: { id: restaurantId, status: newStatus }
            });
            setMessage({
                type: 'success',
                text: `${restaurantName} has been ${newStatus.toLowerCase()}`
            });
            refetch();
            setTimeout(() => setMessage(null), 3000);
        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error.message || 'Failed to update restaurant status'
            });
            setTimeout(() => setMessage(null), 3000);
        }
    };

    if (loading) return <div>Loading restaurants...</div>;

    const restaurants = data?.restaurants || [];
    const filteredRestaurants = filter === 'ALL'
        ? restaurants
        : restaurants.filter((r: any) => r.status === filter);

    const pendingCount = restaurants.filter((r: any) => r.status === 'PENDING').length;
    const approvedCount = restaurants.filter((r: any) => r.status === 'APPROVED').length;

    return (
        <div>
            <h1 className="page-title">Restaurant Management</h1>

            {/* Success/Error Message */}
            {message && (
                <div style={{
                    padding: '1rem',
                    marginBottom: '1.5rem',
                    borderRadius: '0.5rem',
                    background: message.type === 'success' ? '#D1FAE5' : '#FEE2E2',
                    color: message.type === 'success' ? '#065F46' : '#991B1B',
                    border: `1px solid ${message.type === 'success' ? '#A7F3D0' : '#FECACA'}`
                }}>
                    {message.text}
                </div>
            )}

            {/* Filter Tabs */}
            <div style={{
                display: 'flex',
                gap: '1rem',
                marginBottom: '2rem',
                borderBottom: '2px solid var(--color-border)'
            }}>
                <button
                    onClick={() => setFilter('ALL')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: filter === 'ALL' ? '2px solid #6366F1' : '2px solid transparent',
                        color: filter === 'ALL' ? '#6366F1' : 'var(--color-text-secondary)',
                        fontWeight: filter === 'ALL' ? '600' : '400',
                        cursor: 'pointer',
                        marginBottom: '-2px'
                    }}
                >
                    All ({restaurants.length})
                </button>
                <button
                    onClick={() => setFilter('PENDING')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: filter === 'PENDING' ? '2px solid #6366F1' : '2px solid transparent',
                        color: filter === 'PENDING' ? '#6366F1' : 'var(--color-text-secondary)',
                        fontWeight: filter === 'PENDING' ? '600' : '400',
                        cursor: 'pointer',
                        marginBottom: '-2px'
                    }}
                >
                    Pending ({pendingCount})
                </button>
                <button
                    onClick={() => setFilter('APPROVED')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: filter === 'APPROVED' ? '2px solid #6366F1' : '2px solid transparent',
                        color: filter === 'APPROVED' ? '#6366F1' : 'var(--color-text-secondary)',
                        fontWeight: filter === 'APPROVED' ? '600' : '400',
                        cursor: 'pointer',
                        marginBottom: '-2px'
                    }}
                >
                    Approved ({approvedCount})
                </button>
            </div>

            {/* Restaurants Grid */}
            <div style={{ display: 'grid', gap: '1.5rem' }}>
                {filteredRestaurants.map((restaurant: any) => (
                    <div key={restaurant.id} style={{
                        background: 'var(--color-bg-secondary)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '1rem',
                        padding: '1.5rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-text-primary)' }}>
                                {restaurant.name}
                            </h3>
                            <p style={{ margin: '0 0 0.5rem 0', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                                Owner: {restaurant.owner.firstName} {restaurant.owner.lastName} ({restaurant.owner.email})
                            </p>
                            <p style={{ margin: '0 0 0.5rem 0', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                                Location: {restaurant.address.city}, {restaurant.address.state}
                            </p>
                            <p style={{ margin: '0', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                                Cuisine: {restaurant.cuisine.join(', ')}
                            </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span className={`status-badge status-${restaurant.status.toLowerCase()}`}>
                                {restaurant.status}
                            </span>
                            {restaurant.status === 'PENDING' && (
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        onClick={() => handleStatusUpdate(restaurant.id, 'APPROVED', restaurant.name)}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            background: '#10B981',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '0.5rem',
                                            cursor: 'pointer',
                                            fontWeight: '500'
                                        }}
                                    >
                                        ✓ Approve
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate(restaurant.id, 'REJECTED', restaurant.name)}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            background: '#EF4444',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '0.5rem',
                                            cursor: 'pointer',
                                            fontWeight: '500'
                                        }}
                                    >
                                        ✕ Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {filteredRestaurants.length === 0 && (
                <div className="empty-state">
                    No {filter.toLowerCase()} restaurants found
                </div>
            )}
        </div>
    );
};

const AdminOrders: React.FC = () => {
    return (
        <div>
            <h1 className="page-title">Order Management</h1>
            <div className="empty-state">
                <p>No orders yet</p>
                <p className="text-secondary">Orders will appear here once customers start ordering</p>
            </div>
        </div>
    );
};

export default AdminDashboard;
