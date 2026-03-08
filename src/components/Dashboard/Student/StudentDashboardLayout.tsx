import React, { useState } from 'react';
import { Wallet, MessageSquare, User, Lock, LogOut, LayoutDashboard, UtensilsCrossed, Menu, X } from 'lucide-react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';

const StudentDashboardLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        navigate('/login');
    };

    const navLinks = [
        { path: '/student-dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
        { path: '/student-dashboard/profile', label: 'User Profile', icon: User },
        { path: '/student-dashboard/mess-bill', label: 'Mess Bill', icon: Wallet },
        { path: '/student-dashboard/mess-menu', label: 'Mess Menu', icon: UtensilsCrossed },
        { path: '/student-dashboard/queries', label: 'Raise Queries', icon: MessageSquare },
        { path: '/student-dashboard/change-password', label: 'Update Password', icon: Lock },
    ];

    const isActive = (path: string, exact = false) => {
        if (exact) return location.pathname === path;
        return location.pathname.startsWith(path);
    };

    return (
        <div className="flex min-h-screen bg-[#f8fafc]">
            {/* Sidebar - Desktop */}
            <div className="hidden md:flex flex-col w-72 bg-gray-900 text-white fixed h-full shadow-2xl z-20">
                <div className="p-8">
                    <div className="flex items-center space-x-3 mb-10">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                            <span className="text-white font-bold text-xl uppercase font-display">T</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-display font-bold tracking-tight">STUDENT</h2>
                            <p className="text-[10px] text-gray-400 uppercase tracking-[2px]">Portal v1.0</p>
                        </div>
                    </div>

                    <nav className="space-y-1.5">
                        {navLinks.map((link) => {
                            const active = isActive(link.path, link.exact);
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-300 group ${active
                                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                        }`}
                                >
                                    <Icon size={20} className={active ? 'text-white' : 'group-hover:scale-110 transition-transform'} />
                                    <span className="font-display font-semibold text-sm tracking-wide">{link.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="mt-auto p-8">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-300 group shadow-sm hover:shadow-rose-500/20"
                    >
                        <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
                        <span className="font-display font-bold text-sm tracking-wide">Logout</span>
                    </button>
                </div>
            </div>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 w-full bg-gray-900 px-4 py-4 flex items-center justify-between z-30 shadow-lg">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg uppercase font-display">T</span>
                    </div>
                    <h2 className="text-white font-display font-bold text-sm tracking-wider uppercase">Student Portal</h2>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Backdrop */}
            {isMobileMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Menu Sidebar */}
            <div className={`md:hidden fixed inset-y-0 left-0 w-72 bg-gray-900 text-white z-50 transform transition-transform duration-300 ease-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-8">
                    <div className="flex items-center space-x-3 mb-10">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                            <span className="text-white font-bold text-xl uppercase font-display">T</span>
                        </div>
                        <h2 className="text-xl font-display font-bold tracking-tight">STUDENT</h2>
                    </div>

                    <nav className="space-y-1.5">
                        {navLinks.map((link) => {
                            const active = isActive(link.path, link.exact);
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-300 group ${active
                                        ? 'bg-primary text-white'
                                        : 'text-gray-400 hover:bg-gray-800'
                                        }`}
                                >
                                    <Icon size={20} />
                                    <span className="font-display font-semibold text-sm">{link.label}</span>
                                </Link>
                            );
                        })}
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-300"
                        >
                            <LogOut size={20} />
                            <span className="font-display font-bold text-sm">Logout</span>
                        </button>
                    </nav>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 md:ml-72 pt-20 md:pt-0 p-4 md:p-10">
                <div className="max-w-7xl mx-auto py-6">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default StudentDashboardLayout;
