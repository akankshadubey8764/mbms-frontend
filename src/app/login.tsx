import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { LogIn, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import Logo from '../assets/images/logos/tpgit_logo.png';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../constants/roles';
import apiClient from '../api/apiClient';
import './Login.css';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'student',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
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

        if (!formData.email.endsWith('@tpgit.com')) {
            toast.error('Access restricted to @tpgit.com email addresses only.');
            return;
        }

        setLoading(true);
        const loginToast = toast.loading('Signing in...');

        try {
            const response = await apiClient.post('/auth/login', formData);
            const { token, user } = response.data;
            
            // Use AuthContext to update state and storage
            login(token, user);

            toast.success('Welcome back!', { id: loginToast });

            const role = user.role.toLowerCase();
            switch (role) {
                case ROLES.STUDENT: 
                    navigate('/student-dashboard'); 
                    break;
                case ROLES.ADMIN: 
                    navigate('/admin-dashboard'); 
                    break;
                case 'mess_admin':
                case 'mess manager':
                case ROLES.MESS_MANAGER:
                case 'mess': 
                    navigate('/mess-dashboard'); 
                    break;
                default: 
                    navigate('/');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Login failed.', { id: loginToast });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <button
                onClick={() => navigate('/')}
                className="login-back-btn"
            >
                <ArrowLeft size={20} />
                <span>Back to Home</span>
            </button>

            <div className="login-wrapper">
                <div className="login-header">
                    <div className="login-logo-box">
                        <img src={Logo} alt="TPGIT Logo" className="login-logo-img" />
                    </div>
                    <h1 className="login-brand-title">TPGIT HOSTEL</h1>
                    <p className="login-brand-subtitle">Mess Management System</p>
                </div>

                <div className="login-card">
                    <div className="login-card-header">
                        <h2 className="login-title">Welcome Back</h2>
                        <p className="login-subtitle">Signing in as {formData.role.replace('_', ' ')}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="login-field">
                            <label className="login-label">Email Address (@tpgit.com)</label>
                            <div className="login-input-wrapper">
                                <Mail className="login-input-icon" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="login-input"
                                    placeholder="example@tpgit.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="login-field">
                            <label className="login-label">Password</label>
                            <div className="login-input-wrapper">
                                <Lock className="login-input-icon" size={18} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="login-input"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="login-eye-btn"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="login-options">
                            <label className="login-remember">
                                <input type="checkbox" />
                                <span>Remember me</span>
                            </label>
                            <button 
                                type="button" 
                                onClick={() => toast.error('Please contact the Hostel Administrator to reset your password.', { icon: '🔑', duration: 6000 })}
                                className="login-forgot"
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                            >
                                Forgot password?
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="login-submit-btn"
                        >
                            <LogIn size={18} />
                            <span>{loading ? 'SIGNING IN...' : 'SIGN IN'}</span>
                        </button>
                    </form>

                    <div className="login-footer">
                        <p>
                            Don't have an account?{' '}
                            <Link to="/registration" className="login-signup-link">
                                Register now
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="login-copyright">
                    &copy; {new Date().getFullYear()} TPGIT Hostel. All rights reserved.
                </div>
            </div>
        </div>
    );
};

export default Login;
