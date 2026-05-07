import React, { useState } from 'react';
import { Wallet, MessageSquare, User, Lock, LogOut, LayoutDashboard, UtensilsCrossed, Menu, X } from 'lucide-react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import './StudentDashboardLayout.css';

const StudentDashboardLayout: React.FC = () => {
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
        { path: '/student-dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
        { path: '/student-dashboard/profile', label: 'User Profile', icon: User },
        { path: '/student-dashboard/mess-bill', label: 'Mess Bill', icon: Wallet },
        { path: '/student-dashboard/mess-menu', label: 'Mess Menu', icon: UtensilsCrossed },
        { path: '/student-dashboard/queries', label: 'Support Center', icon: MessageSquare },
        { path: '/student-dashboard/change-password', label: 'Security Settings', icon: Lock },
    ];

    const isActive = (path: string, exact = false) => {
        if (exact) return location.pathname === path;
        return location.pathname.startsWith(path);
    };

    const getPageTitle = () => {
        const path = location.pathname;
        if (path.includes('/profile')) return 'User Profile';
        if (path.includes('/mess-bill')) return 'Mess Bill History';
        if (path.includes('/mess-menu')) return 'Mess Menu';
        if (path.includes('/queries')) return 'Support Center';
        if (path.includes('/change-password')) return 'Security Settings';
        return 'Dashboard Overview';
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
        <div className={`sdl-layout ${isPinned ? 'layout-pinned' : 'layout-unpinned'}`}>
            <header className="sdl-top-header">
                <div className="sdl-header-brand">
                    <button onClick={toggleSidebar} className="sdl-menu-btn">
                        <Menu size={20} />
                    </button>
                    <img src="/images/logos/tpgit_logo.png" alt="TPGIT" className="sdl-logo-img" />
                    <div className="sdl-brand-text">
                        <span className="sdl-brand-title">TPGIT HOSTEL</span>
                        <span className="sdl-brand-subtitle">Student Portal</span>
                    </div>
                </div>
                <div className="sdl-header-actions">
                    <button onClick={handleLogout} className="sdl-logout-btn">
                        <span>Logout</span>
                        <LogOut size={16} />
                    </button>
                </div>
            </header>

            {/* Mobile Overlay */}
            <div
                className={`sdl-mobile-overlay ${isMobileMenuOpen ? 'visible' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
            ></div>

            {/* Sidebar (Desktop mini/hover logic + Mobile drawer) */}
            <aside className={`sdl-sidebar ${isPinned ? 'pinned' : ''} ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                {(isPinned || isMobileMenuOpen) && (
                    <div className="sdl-sidebar-header">
                        <div className="sdl-header-brand">
                            <img src="/images/logos/tpgit_logo.png" alt="TPGIT" className="sdl-logo-img" />
                            <div className="sdl-brand-text">
                                <span className="sdl-brand-title">TPGIT HOSTEL</span>
                                <span className="sdl-brand-subtitle">Student Portal</span>
                            </div>
                        </div>
                        {/* Close button inside sidebar */}
                        <button onClick={closeSidebar} className="sdl-close-btn" title="Close Panel">
                            <X size={18} />
                        </button>
                    </div>
                )}

                <nav className="sdl-nav">
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
                                className={`sdl-nav-link ${active ? 'active' : ''}`}
                            >
                                <div className="sdl-nav-icon">
                                    <Icon size={18} />
                                </div>
                                <span className="sdl-nav-label">{link.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="sdl-drawer-footer">
                    <button onClick={handleLogout} className="sdl-nav-link text-red w-full bg-transparent border-none text-left cursor-pointer appearance-none ml-0">
                        <div className="sdl-nav-icon">
                            <LogOut size={18} />
                        </div>
                        <span className="sdl-nav-label">Logout</span>
                    </button>
                </div>
            </aside>

            <main className="sdl-main-content">
                <div className="sdl-page-header">
                    <h1 className="sdl-page-title">{getPageTitle()}</h1>
                </div>
                <div className="sdl-content-inner">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default StudentDashboardLayout;
