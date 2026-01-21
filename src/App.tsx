import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './app/home';
import About from './app/about';
import Contact from './app/contact';
import Registration from './app/registration';
import Login from './app/login';
import StudentDashboard from './app/student-dashboard';
import AdminDashboard from './app/admin-dashboard';
import MessUsersDashboard from './app/mess-users-dashboard';

// Protected Route Component
interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (userRole && !allowedRoles.includes(userRole)) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/registration" element={<Registration />} />
                <Route path="/login" element={<Login />} />

                {/* Protected Routes */}
                <Route
                    path="/student-dashboard"
                    element={
                        <ProtectedRoute allowedRoles={['student']}>
                            <StudentDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin-dashboard"
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/mess-users-dashboard"
                    element={
                        <ProtectedRoute allowedRoles={['mess']}>
                            <MessUsersDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Catch all - redirect to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
};

export default App;
