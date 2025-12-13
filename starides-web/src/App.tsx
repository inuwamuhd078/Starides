import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { client } from './lib/apollo';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Landing from './pages/Landing/Landing';
import Restaurants from './pages/Restaurants/Restaurants';
import Orders from './pages/Orders/Orders';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import BrowseRestaurants from './pages/BrowseRestaurants/BrowseRestaurants';
import RestaurantDetail from './pages/RestaurantDetail/RestaurantDetail';
import Cart from './pages/Cart/Cart';
import Checkout from './pages/Checkout/Checkout';
import CustomerDashboard from './pages/CustomerDashboard/CustomerDashboard';
import VendorDashboard from './pages/VendorDashboard/VendorDashboard';
import RiderDashboard from './pages/RiderDashboard/RiderDashboard';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import { CartProvider } from './context/CartContext';
import ChatWidget from './components/Chat/ChatWidget';
import ChatButton from './components/Chat/ChatButton';
import MapFAB from './components/Map/MapFAB';
import MapModal from './components/Map/MapModal';
import './index.css';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({
    children,
    allowedRoles,
}) => {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

const AppRoutes: React.FC = () => {
    const { isAuthenticated, user } = useAuth();

    // Redirect authenticated users to their dashboard
    const getDashboardRoute = () => {
        if (!user) return '/';

        switch (user.role) {
            case 'CUSTOMER':
                return '/customer';
            case 'VENDOR':
                return '/vendor';
            case 'RIDER':
                return '/rider';
            case 'ADMIN':
                return '/admin';
            default:
                return '/';
        }
    };

    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route
                path="/login"
                element={isAuthenticated ? <Navigate to={getDashboardRoute()} replace /> : <Login />}
            />
            <Route
                path="/register"
                element={isAuthenticated ? <Navigate to={getDashboardRoute()} replace /> : <Register />}
            />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Restaurant Browsing & Ordering */}
            <Route path="/restaurants" element={<BrowseRestaurants />} />
            <Route path="/restaurant/:id" element={<RestaurantDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />

            {/* Demo Routes (work without backend) */}
            <Route path="/demo/restaurants" element={<Restaurants />} />
            {/* Protected Routes */}
            <Route
                path="/orders"
                element={
                    <ProtectedRoute allowedRoles={['CUSTOMER']}>
                        <Orders />
                    </ProtectedRoute>
                }
            />

            {/* Demo Routes */}
            <Route path="/demo/restaurants" element={<Restaurants />} />

            {/* Protected Routes */}
            <Route
                path="/customer/*"
                element={
                    <ProtectedRoute allowedRoles={['CUSTOMER']}>
                        <CustomerDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/vendor/*"
                element={
                    <ProtectedRoute allowedRoles={['VENDOR']}>
                        <VendorDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/rider/*"
                element={
                    <ProtectedRoute allowedRoles={['RIDER']}>
                        <RiderDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/*"
                element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

const GlobalWidgets: React.FC = () => {
    const [isChatOpen, setIsChatOpen] = React.useState(false);
    const [isMapOpen, setIsMapOpen] = React.useState(false);

    return (
        <>
            {/* Chat Components */}
            <ChatWidget isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
            <ChatButton isOpen={isChatOpen} onClick={() => setIsChatOpen(!isChatOpen)} />

            {/* Map Components */}
            <MapModal isOpen={isMapOpen} onClose={() => setIsMapOpen(false)} />
            <MapFAB isOpen={isMapOpen} onClick={() => setIsMapOpen(true)} />
        </>
    );
};

const App: React.FC = () => {
    return (
        <ApolloProvider client={client}>
            <ThemeProvider>
                <AuthProvider>
                    <CartProvider>
                        <Router>
                            <AppRoutes />
                            <GlobalWidgets />
                        </Router>
                    </CartProvider>
                </AuthProvider>
            </ThemeProvider>
        </ApolloProvider>
    );
};

export default App;
