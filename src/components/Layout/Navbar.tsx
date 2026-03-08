import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Info, Phone, UserPlus, LogIn, ChevronDown, User, ShieldCheck, ChefHat } from 'lucide-react';
import Logo from '../../assets/images/logos/TPGIT_HOSTELS.png';

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
    const location = useLocation();
    const dropdownRef = useRef<HTMLDivElement>(null);

    const isActive = (path: string) => {
        if (path === '/login') {
            return location.pathname === '/login';
        }
        return location.pathname === path;
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsLoginDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const navLinks = [
        { path: '/', label: 'Home', icon: Home },
        { path: '/about', label: 'About', icon: Info },
        { path: '/contact', label: 'Contact', icon: Phone },
        { path: '/registration', label: 'Register', icon: UserPlus },
    ];

    const loginRoles = [
        { role: 'student', label: 'Student Login', icon: User },
        { role: 'admin', label: 'Admin Login', icon: ShieldCheck },
        { role: 'mess', label: 'Mess Login', icon: ChefHat },
    ];

    return (
        <nav className="bg-dark shadow-lg sticky top-0 z-50 transition-all duration-300 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-3 group">
                        <div className="w-12 h-12 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500">
                            <img src={Logo} alt="TPGIT Hostel Logo" className="w-full h-full object-contain" />
                        </div>
                        <div className="hidden md:block">
                            <h1 className="text-base font-bold text-white tracking-widest group-hover:text-secondary transition-colors duration-300 uppercase">TPGIT HOSTEL</h1>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navLinks.map((link) => {
                            const active = isActive(link.path);
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`px-4 py-2 rounded-md text-[12px] font-bold uppercase tracking-wider transition-all duration-300 relative group/link ${active
                                        ? 'text-secondary'
                                        : 'text-gray-300 hover:text-white'
                                        }`}
                                >
                                    <span>{link.label}</span>
                                    <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-secondary transition-all duration-300 ${active ? 'w-1/2' : 'w-0 group-hover/link:w-1/2'}`}></span>
                                </Link>
                            );
                        })}

                        {/* Login Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsLoginDropdownOpen(!isLoginDropdownOpen)}
                                className={`px-4 py-2 rounded-md text-[12px] font-bold uppercase tracking-wider transition-all duration-300 flex items-center space-x-1 ${isActive('/login') ? 'text-secondary' : 'text-gray-300 hover:text-white'}`}
                            >
                                <span>Login</span>
                                <ChevronDown size={14} className={`transition-transform duration-300 ${isLoginDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isLoginDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl py-2 z-50 animate-fade-in border border-gray-100">
                                    {loginRoles.map((item) => (
                                        <Link
                                            key={item.role}
                                            to={`/login?role=${item.role}`}
                                            onClick={() => setIsLoginDropdownOpen(false)}
                                            className="flex items-center space-x-3 px-4 py-3 text-[12px] font-semibold text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-all duration-200 border-l-4 border-transparent hover:border-primary-600"
                                        >
                                            <item.icon size={16} />
                                            <span>{item.label}</span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isOpen && (
                <div className="md:hidden bg-dark border-t border-gray-700 animate-slide-in max-h-[80vh] overflow-y-auto">
                    <div className="px-4 py-4 space-y-1">
                        {navLinks.map((link) => {
                            const active = isActive(link.path);
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`block px-4 py-3 rounded-lg text-[12px] font-bold uppercase tracking-wider transition-all duration-300 ${active
                                        ? 'bg-secondary/10 text-secondary'
                                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}

                        {/* Mobile Login Roles */}
                        <div className="pt-2 border-t border-gray-700 mt-2">
                            <p className="px-4 py-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest">Login Options</p>
                            {loginRoles.map((item) => (
                                <Link
                                    key={item.role}
                                    to={`/login?role=${item.role}`}
                                    onClick={() => setIsOpen(false)}
                                    className="block px-4 py-3 rounded-lg text-[12px] font-bold text-gray-400 hover:text-white transition-colors flex items-center space-x-2"
                                >
                                    <item.icon size={16} />
                                    <span>{item.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
