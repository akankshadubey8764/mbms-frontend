import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './app/home';
import About from './app/about';
import Contact from './app/contact';
import Registration from './app/registration';
import Login from './app/login';

// Student Dashboard Components
import StudentDashboardLayout from './components/Dashboard/Student/StudentDashboardLayout';
import StudentOverview from './components/Dashboard/Student/StudentOverview';
import StudentProfile from './components/Dashboard/Student/StudentProfile';
import StudentMessBill from './components/Dashboard/Student/StudentMessBill';
import StudentMessMenu from './components/Dashboard/Student/StudentMessMenu';
import StudentQueries from './components/Dashboard/Student/StudentQueries';
import StudentChangePassword from './components/Dashboard/Student/StudentChangePassword';

// Admin Dashboard Components
import AdminDashboardLayout from './components/Dashboard/Admin/AdminDashboardLayout';
import AdminOverview from './components/Dashboard/Admin/AdminOverview';
import AdminStudentsList from './components/Dashboard/Admin/AdminStudentsList';
import AdminApprovals from './components/Dashboard/Admin/AdminApprovals';
import AdminMessBills from './components/Dashboard/Admin/AdminMessBills';
import AdminInventory from './components/Dashboard/Admin/AdminInventory';
import AdminQueries from './components/Dashboard/Admin/AdminQueries';
import AdminSettings from './components/Dashboard/Admin/AdminSettings';

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
        <>
            <Toaster position="top-right" />
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/registration" element={<Registration />} />
                    <Route path="/login" element={<Login />} />

                    {/* Student Dashboard Nested Routes */}
                    <Route
                        path="/student-dashboard"
                        element={
                            <ProtectedRoute allowedRoles={['student']}>
                                <StudentDashboardLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<StudentOverview />} />
                        <Route path="profile" element={<StudentProfile />} />
                        <Route path="mess-bill" element={<StudentMessBill />} />
                        <Route path="mess-menu" element={<StudentMessMenu />} />
                        <Route path="queries" element={<StudentQueries />} />
                        <Route path="change-password" element={<StudentChangePassword />} />
                    </Route>

                    {/* Admin Dashboard Nested Routes */}
                    <Route
                        path="/admin-dashboard"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <AdminDashboardLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<AdminOverview />} />
                        <Route path="students" element={<AdminStudentsList />} />
                        <Route path="approvals" element={<AdminApprovals />} />
                        <Route path="mess-bills" element={<AdminMessBills />} />
                        <Route path="inventory" element={<AdminInventory />} />
                        <Route path="mess-menu" element={<StudentMessMenu />} /> {/* Reusing the menu component */}
                        <Route path="queries" element={<AdminQueries />} />
                        <Route path="settings" element={<AdminSettings />} />
                    </Route>

                    {/* Mess Manager Dashboard */}
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
        </>
    );
};

export default App;
