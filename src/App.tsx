import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './app/home';
import About from './app/about';
import Contact from './app/contact';
import Registration from './app/registration';
import Login from './app/login';
import MensHostel from './app/mens-hostel';
import WomensHostel from './app/womens-hostel';

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
import AdminMessMenu from './components/Dashboard/Admin/AdminMessMenu';

// Mess Manager Dashboard Components
import MessManagerDashboardLayout from './components/Dashboard/MessManager/MessManagerDashboardLayout';
import MessManagerOverview from './components/Dashboard/MessManager/MessManagerOverview';
import MessManagerGrocery from './components/Dashboard/MessManager/MessManagerGrocery';
import MessManagerMenu from './components/Dashboard/MessManager/MessManagerMenu';
import MessManagerSettings from './components/Dashboard/MessManager/MessManagerSettings';

import { useAuth } from './context/AuthContext';
import Chatbot from './components/Chat/Chatbot';

// Protected Route Component
interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#1a1a1a]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

const App: React.FC = () => {
    return (
        <>
            <Toaster
                position="bottom-center"
                reverseOrder={false}
                gutter={8}
                toastOptions={{
                    className: 'font-sans text-sm font-medium',
                    duration: 4000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                        padding: '12px 20px',
                        borderRadius: '12px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    },
                    success: {
                        duration: 3000,
                        style: {
                            background: '#10b981', // Emerald-500
                        },
                    },
                    error: {
                        duration: 5000,
                        style: {
                            background: '#ef4444', // Red-500
                        },
                    },
                    // We can use generic toast with custom background for warnings
                }}
            />
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/registration" element={<Registration />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/mens-hostel" element={<MensHostel />} />
                    <Route path="/womens-hostel" element={<WomensHostel />} />

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
                        <Route path="mess-menu" element={<AdminMessMenu />} />
                        <Route path="queries" element={<AdminQueries />} />
                        <Route path="settings" element={<AdminSettings />} />
                    </Route>

                    {/* Mess Manager Dashboard Nested Routes */}
                    <Route
                        path="/mess-dashboard"
                        element={
                            <ProtectedRoute allowedRoles={['mess', 'mess_manager', 'mess_admin', 'mess manager']}>
                                <MessManagerDashboardLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<MessManagerOverview />} />
                        <Route path="grocery" element={<MessManagerGrocery />} />
                        <Route path="menu" element={<MessManagerMenu />} />
                        <Route path="settings" element={<MessManagerSettings />} />
                    </Route>

                    {/* Catch all - redirect to home */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                <Chatbot />
            </Router>
        </>
    );
};

export default App;
