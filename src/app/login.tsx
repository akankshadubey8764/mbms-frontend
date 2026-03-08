import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { LogIn, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import Logo from '../assets/images/logos/tpgit_logo.png';
import { toast } from 'react-hot-toast';
import apiClient from '../api/apiClient';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'student', // Default role
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Capture role from query params if available (set by Navbar)
        const params = new URLSearchParams(location.search);
        const roleParam = params.get('role');
        if (roleParam) {
            setFormData(prev => ({ ...prev, role: roleParam }));
        }
    }, [location]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Domain validation
        if (!formData.email.endsWith('@tpgit.com')) {
            toast.error('Access restricted to @tpgit.com email addresses only.');
            return;
        }

        setLoading(true);
        const loginToast = toast.loading('Signing in...');

        try {
            const response = await apiClient.post('/auth/login', formData);
            const { token, user } = response.data;
            const apiRole = user?.role;

            const role = apiRole?.toLowerCase();
            console.log('Login Response:', { token, originalRole: apiRole, normalizedRole: role });

            localStorage.setItem('authToken', token);
            localStorage.setItem('userRole', role);

            toast.success('Welcome back!', { id: loginToast });

            // Redirect based on role
            switch (role) {
                case 'student':
                    navigate('/student-dashboard');
                    break;
                case 'admin':
                    navigate('/admin-dashboard');
                    break;
                case 'mess_manager':
                case 'mess':
                    navigate('/mess-users-dashboard');
                    break;
                default:
                    console.warn('Unknown role received:', role);
                    navigate('/');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.', { id: loginToast });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 flex items-center justify-center px-4 overflow-hidden font-sans relative">
            {/* Back Button */}
            <button
                onClick={() => navigate('/')}
                className="absolute top-8 left-8 text-white flex items-center space-x-2 hover:text-secondary-light transition-colors group cursor-pointer z-10"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-semibold text-sm uppercase tracking-wider">Back to Home</span>
            </button>

            <div className="max-w-md w-full py-4 relative z-0">
                {/* Logo/Header */}
                <div className="text-center mb-6 animate-fade-in">
                    <div className="inline-block w-24 h-24 p-2 bg-white rounded-full flex items-center justify-center mb-4 shadow-2xl transform hover:scale-110 transition-transform duration-500">
                        <img src={Logo} alt="TPGIT Logo" className="w-full h-full object-contain" />
                    </div>
                    <h1 className="text-3xl font-display font-bold text-white mb-1 uppercase tracking-widest">TPGIT HOSTEL</h1>
                    <p className="text-blue-100 font-medium opacity-90">Mess Management System</p>
                </div>

                {/* Login Form */}
                <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 animate-fade-in border border-white/20">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-display font-bold text-gray-900">Welcome Back</h2>
                        <p className="text-gray-500 text-sm italic">Signing in as {formData.role.replace('_', ' ')}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="form-label text-[10px] uppercase tracking-wider text-gray-500 mb-1">Email Address (@tpgit.com)</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="form-input pl-10 h-11 text-xs bg-gray-50 border-gray-200 focus:bg-white"
                                    placeholder="example@tpgit.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="form-label text-[10px] uppercase tracking-wider text-gray-500 mb-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="form-input pl-10 pr-10 h-11 text-xs bg-gray-50 border-gray-200 focus:bg-white"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-gray-400 hover:text-primary-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between mt-2">
                            <label className="flex items-center group cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                />
                                <span className="ml-2 text-[10px] text-gray-600 group-hover:text-gray-900 transition-colors">Remember me</span>
                            </label>
                            <a href="#" className="text-[10px] text-primary-600 hover:text-primary-700 font-bold transition-colors">
                                Forgot password?
                            </a>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary h-11 flex items-center justify-center space-x-2 disabled:opacity-50 mt-4 shadow-lg hover:shadow-primary/30"
                        >
                            <LogIn size={18} />
                            <span className="font-bold tracking-wide text-xs">{loading ? 'SIGNING IN...' : 'SIGN IN'}</span>
                        </button>
                    </form>

                    {/* Register Link */}
                    <div className="mt-6 text-center text-[11px] border-t border-gray-100 pt-6">
                        <p className="text-gray-500">
                            Don't have an account?{' '}
                            <Link to="/registration" className="text-primary-600 hover:text-primary-700 font-bold transition-colors underline decoration-2">
                                Register now
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8 text-blue-100">
                    <p className="text-[10px]">
                        &copy; {new Date().getFullYear()} TPGIT Hostel. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
