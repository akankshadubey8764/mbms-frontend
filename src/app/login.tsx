import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Mail, Lock, User } from 'lucide-react';
import apiClient from '../api/apiClient';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'student',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await apiClient.post('/auth/login', formData);
            const { token, role: apiRole } = response.data;

            // Normalize role to handle potential case variations (e.g. 'Student' vs 'student')
            const role = apiRole?.toLowerCase();
            console.log('Login Response:', { token, originalRole: apiRole, normalizedRole: role });

            localStorage.setItem('authToken', token);
            localStorage.setItem('userRole', role);

            // Redirect based on role
            switch (role) {
                case 'student':
                    navigate('/student-dashboard');
                    break;
                case 'admin':
                    navigate('/admin-dashboard');
                    break;
                case 'mess':
                    navigate('/mess-users-dashboard');
                    break;
                default:
                    console.warn('Unknown role received:', role);
                    navigate('/');
            }
        } catch (error: any) {
            alert(error.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                {/* Logo/Header */}
                <div className="text-center mb-8 animate-fade-in">
                    <div className="inline-block w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-2xl">
                        <span className="text-primary-600 font-bold text-3xl">T</span>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2">TPGIT Hostel</h1>
                    <p className="text-blue-100">Mess Management System</p>
                </div>

                {/* Login Form */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 animate-fade-in">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
                        <p className="text-gray-600">Sign in to your account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Role Selection */}
                        <div>
                            <label className="form-label">Login As</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3.5 text-gray-400" size={20} />
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="form-input pl-10"
                                    required
                                >
                                    <option value="student">Student</option>
                                    <option value="admin">Admin</option>
                                    <option value="mess">Mess Manager</option>
                                </select>
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="form-label">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="form-input pl-10"
                                    placeholder="your.email@example.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="form-label">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="form-input pl-10"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">Remember me</span>
                            </label>
                            <a href="#" className="text-sm text-primary-600 hover:text-primary-700 font-semibold">
                                Forgot password?
                            </a>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
                        >
                            <LogIn size={20} />
                            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
                        </button>
                    </form>

                    {/* Register Link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/registration" className="text-primary-600 hover:text-primary-700 font-semibold">
                                Register here
                            </Link>
                        </p>
                    </div>

                    {/* Back to Home */}
                    <div className="mt-4 text-center">
                        <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
                            ← Back to Home
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8 text-blue-100">
                    <p className="text-sm">
                        &copy; {new Date().getFullYear()} TPGIT Hostel. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
