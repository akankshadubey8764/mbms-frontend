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
    const [isPinned, setIsPinned] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        <div className={`adl-layout ${isPinned ? 'layout-pinned' : 'layout-unpinned'}`}>
            <header className="adl-top-header">
                <div className="adl-header-brand">
                    <button onClick={toggleSidebar} className="adl-menu-btn">
                        <Menu size={20} />
                    </button>
                    <img src="/images/logos/tpgit_logo.png" alt="TPGIT" className="adl-logo-img" />
                    <div className="adl-brand-text">
                        <span className="adl-brand-title">TPGIT HOSTEL</span>
                        <span className="adl-brand-subtitle">Admin Portal</span>
                    </div>
                </div>
                <div className="adl-header-actions">
                    <button onClick={handleLogout} className="adl-logout-btn">
                        <span>Logout</span>
                        <LogOut size={16} />
                    </button>
                </div>
            </header>

            {/* Mobile Overlay */}
            <div
                className={`adl-mobile-overlay ${isMobileMenuOpen ? 'visible' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
            ></div>

            {/* Sidebar (Desktop mini/hover logic + Mobile drawer) */}
            <aside className={`adl-sidebar ${isPinned ? 'pinned' : ''} ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                {(isPinned || isMobileMenuOpen) && (
                    <div className="adl-sidebar-header">
                        <div className="adl-header-brand">
                            <img src="/images/logos/tpgit_logo.png" alt="TPGIT" className="adl-logo-img" />
                            <div className="adl-brand-text">
                                <span className="adl-brand-title">TPGIT HOSTEL</span>
                                <span className="adl-brand-subtitle">Admin Portal</span>
                            </div>
                        </div>
                        <button onClick={closeSidebar} className="adl-close-btn" title="Close Panel">
                            <X size={18} />
                        </button>
                    </div>
                )}

                <nav className="adl-nav">
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
                                className={`adl-nav-link ${active ? 'active' : ''}`}
                            >
                                <div className="adl-nav-icon">
                                    <Icon size={18} />
                                </div>
                                <span className="adl-nav-label">{link.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="adl-drawer-footer">
                    <button onClick={handleLogout} className="adl-nav-link text-red w-full bg-transparent border-none text-left cursor-pointer appearance-none ml-0">
                        <div className="adl-nav-icon">
                            <LogOut size={18} />
                        </div>
                        <span className="adl-nav-label">Logout</span>
                    </button>
                </div>
            </aside>

            <main className="adl-main-content">
                <div className="adl-page-header">
                    <h1 className="adl-page-title">{getPageTitle()}</h1>
                </div>
                <div className="adl-content-inner">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminDashboardLayout;
