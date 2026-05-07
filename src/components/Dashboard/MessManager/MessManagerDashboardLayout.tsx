import React, { useState } from 'react';
import {
    LayoutDashboard, ShoppingCart, Utensils, Settings, LogOut, Menu, X
} from 'lucide-react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import './MessManagerDashboardLayout.css';

const MessManagerDashboardLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isPinned, setIsPinned] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        navigate('/login');
    };

    const navLinks = [
        { path: '/mess-dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
        { path: '/mess-dashboard/grocery', label: 'Grocery Management', icon: ShoppingCart },
        { path: '/mess-dashboard/menu', label: 'Mess Menu', icon: Utensils },
        { path: '/mess-dashboard/settings', label: 'Update Password', icon: Settings },
    ];

    const isActive = (path: string, exact = false) => {
        if (exact) return location.pathname === path;
        return location.pathname.startsWith(path);
    };

    const getPageTitle = () => {
        const path = location.pathname;
        if (path.includes('/grocery')) return 'Grocery Management';
        if (path.includes('/menu')) return 'Mess Menu';
        if (path.includes('/settings')) return 'Update Password';
        return 'Overview';
    };

    const toggleSidebar = () => {
        if (window.innerWidth <= 768) {
            setIsMobileMenuOpen(true);
        } else {
            setIsPinned(!isPinned);
        }
    };

    const closeSidebar = () => {
        setIsPinned(false);
        setIsMobileMenuOpen(false);
    };

    return (
        <div className={`mdl-layout ${isPinned ? 'layout-pinned' : 'layout-unpinned'}`}>
            <header className="mdl-top-header">
                <div className="mdl-header-brand">
                    <button onClick={toggleSidebar} className="mdl-menu-btn">
                        <Menu size={20} />
                    </button>
                    <img src="/images/logos/tpgit_logo.png" alt="TPGIT" className="mdl-logo-img" />
                    <div className="mdl-brand-text">
                        <span className="mdl-brand-title">TPGIT HOSTEL</span>
                        <span className="mdl-brand-subtitle">Mess Management</span>
                    </div>
                </div>
                <div className="mdl-header-actions">
                    <button onClick={handleLogout} className="mdl-logout-btn">
                        <span>Logout</span>
                        <LogOut size={16} />
                    </button>
                </div>
            </header>

            {/* Mobile Overlay */}
            <div
                className={`mdl-mobile-overlay ${isMobileMenuOpen ? 'visible' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
            ></div>

            {/* Sidebar (Desktop mini/hover logic + Mobile drawer) */}
            <aside className={`mdl-sidebar ${isPinned ? 'pinned' : ''} ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                {(isPinned || isMobileMenuOpen) && (
                    <div className="mdl-sidebar-header">
                        <div className="mdl-header-brand">
                            <img src="/images/logos/tpgit_logo.png" alt="TPGIT" className="mdl-logo-img" />
                            <div className="mdl-brand-text">
                                <span className="mdl-brand-title">TPGIT HOSTEL</span>
                                <span className="mdl-brand-subtitle">Mess Management</span>
                            </div>
                        </div>
                        <button onClick={closeSidebar} className="mdl-close-btn" title="Close Panel">
                            <X size={18} />
                        </button>
                    </div>
                )}

                <nav className="mdl-nav">
                    {navLinks.map((link) => {
                        const active = isActive(link.path, link.exact);
                        const Icon = link.icon;
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => {
                                    if (window.innerWidth <= 768) {
                                        setIsMobileMenuOpen(false);
                                    }
                                }}
                                className={`mdl-nav-link ${active ? 'active' : ''}`}
                                title={link.label}
                            >
                                <div className="mdl-nav-icon">
                                    <Icon size={18} />
                                </div>
                                <span className="mdl-nav-label">{link.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="mdl-drawer-footer">
                    <button onClick={handleLogout} className="mdl-nav-link text-red w-full bg-transparent border-none text-left cursor-pointer appearance-none ml-0" title="Logout">
                        <div className="mdl-nav-icon">
                            <LogOut size={18} />
                        </div>
                        <span className="mdl-nav-label">Logout</span>
                    </button>
                </div>
            </aside>

            <main className="mdl-main-content">
                <div className="mdl-page-header">
                    <h1 className="mdl-page-title">{getPageTitle()}</h1>
                </div>
                <div className="mdl-content-inner">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MessManagerDashboardLayout;
