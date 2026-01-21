import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Info, Phone, UserPlus, LogIn } from 'lucide-react';

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    const navLinks = [
        { path: '/', label: 'Home', icon: Home },
        { path: '/about', label: 'About', icon: Info },
        { path: '/contact', label: 'Contact', icon: Phone },
        { path: '/registration', label: 'Register', icon: UserPlus },
        { path: '/login', label: 'Login', icon: LogIn },
    ];

    return (
        <nav className="bg-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-800 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-xl">T</span>
                        </div>
                        <div className="hidden md:block">
                            <h1 className="text-xl font-bold text-gray-900">TPGIT Hostel</h1>
                            <p className="text-xs text-gray-600">Mess Management System</p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${isActive(link.path)
                                            ? 'bg-primary-600 text-white shadow-md'
                                            : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                                        }`}
                                >
                                    <Icon size={18} />
                                    <span>{link.label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-200 animate-slide-in">
                    <div className="px-4 py-4 space-y-2">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${isActive(link.path)
                                            ? 'bg-primary-600 text-white shadow-md'
                                            : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                                        }`}
                                >
                                    <Icon size={20} />
                                    <span>{link.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
