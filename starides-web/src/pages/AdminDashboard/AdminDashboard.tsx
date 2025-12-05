import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useQuery, gql } from '@apollo/client';
import AnalyticsChart from '../../components/AnalyticsChart';
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
    const { logout } = useAuth();

    return (
        <div className="dashboard admin-dashboard">
            <nav className="dashboard-nav">
                <div className="container">
                    <div className="nav-content">
                        <Link to="/" className="logo">
                            <span className="logo-icon">⚙️</span>
                            <span className="logo-text">Starides Admin</span>
                        </Link>
                        <div className="nav-links">
                            <Link to="/admin" className="nav-link">Dashboard</Link>
                            <Link to="/admin/users" className="nav-link">Users</Link>
                            <Link to="/admin/restaurants" className="nav-link">Restaurants</Link>
                            <Link to="/admin/orders" className="nav-link">Orders</Link>
                            <button onClick={logout} className="btn btn-secondary">Logout</button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="dashboard-content">
                <Routes>
                    <Route index element={<AdminHome />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="restaurants" element={<AdminRestaurants />} />
                    <Route path="orders" element={<AdminOrders />} />
                </Routes>
            </div>
        </div>
    );
};

const AdminHome: React.FC = () => {
    const { data } = useQuery(GET_ADMIN_STATS);
    const stats = data?.adminStats;
    const orders = data?.orders || [];

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
            <h1 className="page-title">Admin Dashboard</h1>

            <div className="stats-grid">
                <div className="stat-card card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-info">
                        <h3>Total Users</h3>
                        <p className="stat-value">{stats?.totalCustomers || 0}</p>
                        <small>All registered users</small>
                    </div>
                </div>

                <div className="stat-card card">
                    <div className="stat-icon">🏪</div>
                    <div className="stat-info">
                        <h3>Restaurants</h3>
                        <p className="stat-value">{data?.restaurants?.length || 0}</p>
                        <small>Active restaurants</small>
                    </div>
                </div>

                <div className="stat-card card">
                    <div className="stat-icon">📦</div>
                    <div className="stat-info">
                        <h3>Total Orders</h3>
                        <p className="stat-value">{stats?.totalOrders || 0}</p>
                        <small>All time orders</small>
                    </div>
                </div>

                <div className="stat-card card">
                    <div className="stat-icon">💰</div>
                    <div className="stat-info">
                        <h3>Revenue</h3>
                        <p className="stat-value">${stats?.totalRevenue?.toFixed(2) || '0.00'}</p>
                        <small>Platform revenue</small>
                    </div>
                </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <AnalyticsChart
                    title="Platform Revenue - Last 7 Days"
                    data={chartData}
                    color="#8b5cf6"
                />
            </div>

            <div className="quick-actions">
                <Link to="/admin/users" className="action-card card">
                    <div className="action-icon">👥</div>
                    <h3>Manage Users</h3>
                    <p>View and manage all users</p>
                </Link>

                <Link to="/admin/restaurants" className="action-card card">
                    <div className="action-icon">🏪</div>
                    <h3>Manage Restaurants</h3>
                    <p>Approve and manage restaurants</p>
                </Link>

                <Link to="/admin/orders" className="action-card card">
                    <div className="action-icon">📦</div>
                    <h3>View Orders</h3>
                    <p>Monitor all platform orders</p>
                </Link>
            </div>
        </div>
    );
};

const AdminUsers: React.FC = () => {
    const { data, loading } = useQuery(GET_ADMIN_STATS);
    const users = data?.users || [];

    return (
        <div className="container">
            <h1 className="page-title">User Management</h1>

            {loading && <p>Loading users...</p>}

            <div className="users-table card">
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
    const { data, loading } = useQuery(GET_ADMIN_STATS);
    const restaurants = data?.restaurants || [];

    return (
        <div className="container">
            <h1 className="page-title">Restaurant Management</h1>

            {loading && <p>Loading restaurants...</p>}

            <div className="restaurants-table card">
                <table>
                    <thead>
                        <tr>
                            <th>Restaurant Name</th>
                            <th>Owner</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {restaurants.map((restaurant: any) => (
                            <tr key={restaurant.id}>
                                <td>{restaurant.name}</td>
                                <td>{restaurant.owner.firstName} {restaurant.owner.lastName}</td>
                                <td>
                                    <span className={`status-badge status-${restaurant.status.toLowerCase()}`}>
                                        {restaurant.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {restaurants.length === 0 && !loading && (
                    <div className="empty-state">No restaurants found</div>
                )}
            </div>
        </div>
    );
};

const AdminOrders: React.FC = () => {
    return (
        <div className="container">
            <h1 className="page-title">Order Management</h1>
            <div className="empty-state">
                <p>No orders yet</p>
                <p className="text-secondary">Orders will appear here once customers start ordering</p>
            </div>
        </div>
    );
};

export default AdminDashboard;
