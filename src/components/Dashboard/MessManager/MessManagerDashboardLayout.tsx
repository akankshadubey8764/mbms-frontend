import React, { useState } from 'react';
import {
    LayoutDashboard,
    ShoppingCart,
    Package,
    Utensils,
    LogOut,
    Menu,
    X,
    Settings,
} from 'lucide-react';

import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import './MessManagerDashboardLayout.css';

const MessManagerDashboardLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const getPageTitle = () => {
        const path = location.pathname;
        if (path.includes('/grocery')) return 'Add Grocery Bill';
        if (path.includes('/issue')) return 'Update Issued Items';
        if (path.includes('/menu')) return 'Mess Menu';
        if (path.includes('/settings')) return 'Settings';
        return 'Overview';

    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        navigate('/login');
    };

    const navLinks = [
        { path: '/mess-dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
        { path: '/mess-dashboard/grocery', label: 'Grocery Bill', icon: ShoppingCart },
        { path: '/mess-dashboard/issue', label: 'Issued Items', icon: Package },
        { path: '/mess-dashboard/menu', label: 'Mess Menu', icon: Utensils },
        { path: '/mess-dashboard/settings', label: 'Settings', icon: Settings },
    ];


    const isActive = (path: string, exact = false) => {
        if (exact) return location.pathname === path;
        return location.pathname.startsWith(path);
    };

    return (
        <div className="mdl-layout">
            {/* Sidebar - Desktop */}
            <div className="mdl-sidebar">
                <div className="mdl-sidebar-inner">
                    <div className="mdl-sidebar-logo-container">
                        <div className="mdl-logo-icon">
                            <span className="mdl-logo-letter">M</span>
                        </div>
                        <div className="mdl-logo-text-wrapper">
                            <h2 className="mdl-logo-title">MANAGER</h2>
                            <p className="mdl-logo-subtitle">Mess Portal</p>
                        </div>
                    </div>

                    <nav className="mdl-nav">
                        {navLinks.map((link) => {
                            const active = isActive(link.path, link.exact);
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`mdl-nav-link ${active ? 'active' : ''}`}
                                    title={link.label}
                                >
                                    <div className="mdl-nav-icon-wrapper">
                                        <Icon size={20} className="mdl-nav-icon" />
                                    </div>
                                    <span className="mdl-nav-text">{link.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="mdl-sidebar-footer">
                    <button
                        onClick={handleLogout}
                        className="mdl-logout-btn"
                        title="Logout"
                    >
                        <div className="mdl-nav-icon-wrapper">
                            <LogOut size={20} className="mdl-logout-icon" />
                        </div>
                        <span className="mdl-logout-text">Logout</span>
                    </button>
                </div>
            </div>

            {/* Header & Main Content */}
            <div className="mdl-main-container">
                {/* Desktop Top Header */}
                <header className="mdl-desktop-header">
                    <div>
                        <h1 className="mdl-header-title">{getPageTitle()}</h1>
                    </div>
                    <div className="mdl-header-actions">
                        <button
                            onClick={handleLogout}
                            className="mdl-header-logout"
                            title="Logout"
                        >
                            <span className="mdl-header-logout-text">Logout</span>
                            <LogOut size={18} className="mdl-header-logout-icon" />
                        </button>
                    </div>
                </header>

                {/* Mobile Header */}
                <header className="mdl-mobile-header">
                    <div className="mdl-mobile-brand">
                        <div className="mdl-mobile-logo">
                            <span>M</span>
                        </div>
                        <h2 className="mdl-mobile-title">Mess Manager</h2>
                    </div>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="mdl-mobile-menu-btn"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </header>

                {/* Mobile Menu Sidebar */}
                <div className={`mdl-mobile-sidebar-wrapper ${isMobileMenuOpen ? 'open' : ''}`}>
                    <div
                        className="mdl-mobile-overlay"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    <div className="mdl-mobile-sidebar">
                        <div className="mdl-mobile-sidebar-inner">
                            <div className="mdl-mobile-sidebar-brand">
                                <div className="mdl-mobile-logo">
                                    <span>M</span>
                                </div>
                                <h2 className="mdl-mobile-title">MANAGER</h2>
                            </div>

                            <nav className="mdl-mobile-sidebar-nav">
                                {navLinks.map((link) => {
                                    const active = isActive(link.path, link.exact);
                                    const Icon = link.icon;
                                    return (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`mdl-mobile-nav-link ${active ? 'active' : 'inactive'}`}
                                        >
                                            <Icon size={20} />
                                            <span className="mdl-mobile-nav-text">{link.label}</span>
                                        </Link>
                                    );
                                })}
                            </nav>

                            <button
                                onClick={handleLogout}
                                className="mdl-mobile-logout"
                            >
                                <LogOut size={20} />
                                <span className="mdl-mobile-logout-text">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <main className="mdl-content-area">
                    <div className="mdl-content-inner">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MessManagerDashboardLayout;
