import React, { useState } from 'react';
import {
    Users, Wallet, FileText, Settings, LogOut, LayoutDashboard,
    CheckCircle, ShoppingCart, Utensils, Menu, X
} from 'lucide-react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import './AdminDashboardLayout.css';

const AdminDashboardLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const getPageTitle = () => {
        const path = location.pathname;
        if (path.includes('/students')) return 'Hostel Students';
        if (path.includes('/approvals')) return 'View Requests';
        if (path.includes('/mess-bills')) return 'Mess Bills';
        if (path.includes('/inventory')) return 'Inventory';
        if (path.includes('/mess-menu')) return 'Mess Menu';
        if (path.includes('/queries')) return 'View Queries';
        if (path.includes('/settings')) return 'System Settings';
        return 'Overview';
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        navigate('/login');
    };

    const navLinks = [
        { path: '/admin-dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
        { path: '/admin-dashboard/students', label: 'Students List', icon: Users },
        { path: '/admin-dashboard/approvals', label: 'View Requests', icon: CheckCircle },
        { path: '/admin-dashboard/mess-bills', label: 'Mess Bills', icon: Wallet },
        { path: '/admin-dashboard/inventory', label: 'Inventory', icon: ShoppingCart },
        { path: '/admin-dashboard/mess-menu', label: 'Mess Menu', icon: Utensils },
        { path: '/admin-dashboard/queries', label: 'View Queries', icon: FileText },
        { path: '/admin-dashboard/settings', label: 'System Settings', icon: Settings },
    ];

    const isActive = (path: string, exact = false) => {
        if (exact) return location.pathname === path;
        return location.pathname.startsWith(path);
    };

    return (
        <div className="adl-layout">
            {/* Sidebar - Desktop */}
            <div className="adl-sidebar">
                <div className="adl-sidebar-inner">
                    <div className="adl-sidebar-logo-container">
                        <img src="/images/logos/tpgit_logo.png" alt="TPGIT" className="adl-logo-img" />
                        <div className="adl-logo-text-wrapper">
                            <h2 className="adl-logo-title">TPGIT</h2>
                            <p className="adl-logo-subtitle">Admin Controller</p>
                        </div>
                    </div>

                    <nav className="adl-nav">
                        {navLinks.map((link) => {
                            const active = isActive(link.path, link.exact);
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`adl-nav-link ${active ? 'active' : ''}`}
                                    title={link.label}
                                >
                                    <div className="adl-nav-icon-wrapper">
                                        <Icon size={20} className="adl-nav-icon" />
                                    </div>
                                    <span className="adl-nav-text">{link.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="adl-sidebar-footer">
                    <div className="adl-system-status">
                        <p className="adl-status-title">System Status</p>
                        <div className="adl-status-indicator">
                            <div className="adl-status-dot"></div>
                            <span className="adl-status-text">Servers Operational</span>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="adl-logout-btn"
                        title="Logout"
                    >
                        <div className="adl-nav-icon-wrapper">
                            <LogOut size={20} className="adl-logout-icon" />
                        </div>
                        <span className="adl-logout-text">Logout</span>
                    </button>
                </div>
            </div>

            {/* Header & Main Content */}
            <div className="adl-main-container">
                {/* Desktop Top Header */}
                <header className="adl-desktop-header">
                    <div>
                        <h1 className="adl-header-title">{getPageTitle()}</h1>
                    </div>
                    <div className="adl-header-actions">
                        <button
                            onClick={handleLogout}
                            className="adl-header-logout"
                            title="Logout"
                        >
                            <span className="adl-header-logout-text">Logout</span>
                            <LogOut size={18} className="adl-header-logout-icon" />
                        </button>
                    </div>
                </header>

                {/* Mobile Header */}
                <header className="adl-mobile-header">
                    <div className="adl-mobile-brand">
                        <img src="/images/logos/tpgit_logo.png" alt="TPGIT" className="adl-mobile-logo-img" />
                        <h2 className="adl-mobile-title">TPGIT Admin</h2>
                    </div>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="adl-mobile-menu-btn"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </header>

                {/* Mobile Menu Sidebar */}
                <div className={`adl-mobile-sidebar-wrapper ${isMobileMenuOpen ? 'open' : ''}`}>
                    <div
                        className="adl-mobile-overlay"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    <div className="adl-mobile-sidebar">
                        <div className="adl-mobile-sidebar-inner">
                            <div className="adl-mobile-sidebar-brand">
                                <img src="/images/logos/tpgit_logo.png" alt="TPGIT" className="adl-mobile-logo-img" />
                                <h2 className="adl-mobile-title">TPGIT HOSTEL</h2>
                            </div>

                            <nav className="adl-mobile-sidebar-nav">
                                {navLinks.map((link) => {
                                    const active = isActive(link.path, link.exact);
                                    const Icon = link.icon;
                                    return (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`adl-mobile-nav-link ${active ? 'active' : 'inactive'}`}
                                        >
                                            <Icon size={20} />
                                            <span className="adl-mobile-nav-text">{link.label}</span>
                                        </Link>
                                    );
                                })}
                            </nav>

                            <button
                                onClick={handleLogout}
                                className="adl-mobile-logout"
                            >
                                <LogOut size={20} />
                                <span className="adl-mobile-logout-text">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <main className="adl-content-area" style={{ padding: '0px 16px' }}>
                    <div className="adl-content-inner">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboardLayout;
