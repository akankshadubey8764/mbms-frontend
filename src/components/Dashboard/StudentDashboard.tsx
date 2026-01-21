import React, { useState, useEffect } from 'react';
import { Wallet, Calendar, MessageSquare, User, Lock, LogOut, LayoutDashboard, UtensilsCrossed } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../../api/apiClient';

interface StudentData {
    name: string;
    regNumber: string;
    department: string;
    year: string;
    roomNo: string;
    block: string;
    messBill: number;
    daysPresent: number;
    daysAbsent: number;
}

const StudentDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [studentData, setStudentData] = useState<StudentData | null>(null);
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState('');
    const [submittingFeedback, setSubmittingFeedback] = useState(false);

    useEffect(() => {
        fetchStudentData();
    }, []);

    const fetchStudentData = async () => {
        try {
            const response = await apiClient.get('/student/dashboard');
            setStudentData(response.data);
        } catch (error) {
            console.error('Error fetching student data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        navigate('/login');
    };

    const handleFeedbackSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmittingFeedback(true);

        try {
            await apiClient.post('/student/feedback', { message: feedback });
            alert('Feedback submitted successfully!');
            setFeedback('');
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to submit feedback');
        } finally {
            setSubmittingFeedback(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-gray-900 text-white fixed h-full shadow-2xl">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-center mb-8">Student Portal</h2>
                    <nav className="space-y-2">
                        <Link
                            to="/student-dashboard"
                            className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-primary-600 text-white transition-colors"
                        >
                            <LayoutDashboard size={20} />
                            <span>Dashboard</span>
                        </Link>
                        <Link
                            to="/student-dashboard/profile"
                            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            <User size={20} />
                            <span>User Profile</span>
                        </Link>
                        <Link
                            to="/student-dashboard/mess-bill"
                            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            <Wallet size={20} />
                            <span>Mess Bill</span>
                        </Link>
                        <Link
                            to="/student-dashboard/mess-menu"
                            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            <UtensilsCrossed size={20} />
                            <span>Mess Menu</span>
                        </Link>
                        <Link
                            to="/student-dashboard/queries"
                            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            <MessageSquare size={20} />
                            <span>Raise Queries</span>
                        </Link>
                        <Link
                            to="/student-dashboard/change-password"
                            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            <Lock size={20} />
                            <span>Update Password</span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-600 transition-colors"
                        >
                            <LogOut size={20} />
                            <span>Logout</span>
                        </button>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="ml-64 flex-1 p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Welcome Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Welcome, {studentData?.name || 'Student'}!
                        </h1>
                        <p className="text-gray-600">Here's your hostel dashboard overview</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        {/* Mess Bill Card */}
                        <div className="dashboard-card bg-gradient-to-br from-primary-500 to-primary-700 text-white">
                            <div className="flex items-center justify-between mb-4">
                                <Wallet size={32} />
                                <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">
                                    Current Month
                                </span>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Mess Bill</h3>
                            <p className="text-4xl font-bold">₹{studentData?.messBill || 2000}</p>
                        </div>

                        {/* Days Present Card */}
                        <div className="dashboard-card bg-gradient-to-br from-green-500 to-green-700 text-white">
                            <div className="flex items-center justify-between mb-4">
                                <Calendar size={32} />
                                <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">
                                    This Month
                                </span>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Days Present</h3>
                            <p className="text-4xl font-bold">{studentData?.daysPresent || 0}</p>
                        </div>

                        {/* Days Absent Card */}
                        <div className="dashboard-card bg-gradient-to-br from-red-500 to-red-700 text-white">
                            <div className="flex items-center justify-between mb-4">
                                <Calendar size={32} />
                                <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">
                                    This Month
                                </span>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Days Absent</h3>
                            <p className="text-4xl font-bold">{studentData?.daysAbsent || 0}</p>
                        </div>
                    </div>

                    {/* Student Info */}
                    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Student Information</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Registration Number</p>
                                <p className="text-lg font-semibold text-gray-900">{studentData?.regNumber}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Department</p>
                                <p className="text-lg font-semibold text-gray-900">{studentData?.department}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Year</p>
                                <p className="text-lg font-semibold text-gray-900">{studentData?.year}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Room & Block</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {studentData?.roomNo}, {studentData?.block}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Feedback Section */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Submit Feedback / Query</h2>
                        <form onSubmit={handleFeedbackSubmit}>
                            <textarea
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                placeholder="Share your feedback or raise a query..."
                                rows={5}
                                className="form-input resize-none mb-4"
                                required
                            ></textarea>
                            <button
                                type="submit"
                                disabled={submittingFeedback}
                                className="btn-primary disabled:opacity-50"
                            >
                                {submittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
