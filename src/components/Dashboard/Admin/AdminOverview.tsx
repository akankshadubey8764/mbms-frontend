import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Users, Wallet, CheckCircle, FileText, TrendingUp, UserPlus, Clock, Package, MessageSquare, Utensils, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import apiClient from '../../../api/apiClient';
import './AdminOverview.css';

interface DashboardStats {
    totalStudents: number;
    totalRevenue: number;
    unpaidStudentsCount: number;
    inventoryExpenditure: number;
    activeStudents: number;
    pendingApprovals: number;
}

const AdminOverview: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats>({
        totalStudents: 0,
        totalRevenue: 0,
        unpaidStudentsCount: 0,
        inventoryExpenditure: 0,
        activeStudents: 0,
        pendingApprovals: 0,
    });
    const [loading, setLoading] = useState(true);
    const isFetching = useRef(false);

    const fetchStats = useCallback(async () => {
        if (isFetching.current) return;
        isFetching.current = true;
        try {
            const response = await apiClient.get('/admin/stats');
            const statsData = response.data?.stats || response.data || {};
            setStats(prev => ({ ...prev, ...statsData }));
        } catch (error) {
            console.error('Error fetching admin stats:', error);
        } finally {
            setLoading(false);
            isFetching.current = false;
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    if (loading) {
        return (
            <div className="admin-overview-container">
                <div className="ao-stats-grid">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="ao-stat-card skeleton" style={{ height: '100px' }}></div>
                    ))}
                </div>
                <div className="ao-content-grid" style={{ marginTop: '24px' }}>
                    <div className="ao-priority-container">
                        <div className="ao-priority-card skeleton" style={{ height: '400px' }}></div>
                    </div>
                    <div className="ao-side-panel">
                        <div className="ao-quick-links-container skeleton" style={{ height: '200px', marginBottom: '24px' }}></div>
                        <div className="ao-small-stats-card skeleton" style={{ height: '100px' }}></div>
                    </div>
                </div>
            </div>
        );
    }

    const {
        inventoryExpenditure = 0,
        totalRevenue = 0,
        unpaidStudentsCount = 0,
        pendingApprovals = 0,
        totalStudents = 0,
        activeStudents = 0
    } = stats;

    return (
        <div className="admin-overview-container animate-fade-in">
            {/* Main Stats Grid */}
            <div className="ao-stats-grid">
                <StatCard
                    label="Unpaid Students"
                    value={unpaidStudentsCount}
                    icon={AlertCircle}
                    color="rose"
                    sublabel="Current month pending"
                />
                <StatCard
                    label="Inventory Cost"
                    value={`₹${(inventoryExpenditure || 0).toLocaleString()}`}
                    icon={TrendingUp}
                    color="amber"
                    sublabel="Current month groceries"
                />
                <StatCard
                    label="Pending Requests"
                    value={pendingApprovals}
                    icon={Clock}
                    color="indigo"
                    sublabel="Awaiting approval"
                />
                <StatCard
                    label="Total Revenue"
                    value={`₹${(totalRevenue || 0).toLocaleString()}`}
                    icon={Wallet}
                    color="emerald"
                    sublabel="Total bill collected"
                />
            </div>

            <div className="ao-content-grid">
                {/* Priority Actions */}
                <div className="ao-priority-container">
                    <div className="ao-priority-card">
                        <div className="ao-priority-header">
                            <h3 className="ao-priority-title">Management Actions</h3>
                            <span className="ao-priority-badge">Admin Control</span>
                        </div>
                        <div className="ao-priority-list">
                            <TaskItem
                                title="Approve Student Registrations"
                                description={`${pendingApprovals > 0 ? `${pendingApprovals} students` : 'No students'} are waiting for approval.`}
                                icon={UserPlus}
                                color="rose"
                                action="Review Requests"
                                border="left-rose"
                                to="/admin-dashboard/approvals"
                            />
                            <TaskItem
                                title="Unpaid Bill Follow-up"
                                description={`${unpaidStudentsCount} students haven't paid this month's bill.`}
                                icon={AlertCircle}
                                color="amber"
                                action="View Bills"
                                border="left-amber"
                                to="/admin-dashboard/mess-bills"
                            />
                            <TaskItem
                                title="Generate Monthly Mess Bills"
                                description="Calculate and issue mess bills based on attendance data."
                                icon={FileText}
                                color="blue"
                                action="Manage Bills"
                                border="left-blue"
                                to="/admin-dashboard/mess-bills"
                            />
                            <TaskItem
                                title="Review Student Queries"
                                description="Check resolving status of submitted complaints."
                                icon={MessageSquare}
                                color="purple"
                                action="View Queries"
                                border="left-purple"
                                to="/admin-dashboard/queries"
                            />
                        </div>
                    </div>
                </div>

                {/* Statistics & Navigation */}
                <div className="ao-side-panel">
                    <div className="ao-quick-links-container">
                        <h3 className="ao-quick-links-title">Quick Settings</h3>
                        <div className="ao-quick-links-list">
                            <QuickLink label="Register Student" to="/admin-dashboard/students" icon={UserPlus} />
                            <QuickLink label="Manage Data" to="/admin-dashboard/students" icon={Users} />
                            <QuickLink label="Update Menu" to="/admin-dashboard/mess-menu" icon={Utensils} />
                            <QuickLink label="Inventory View" to="/admin-dashboard/inventory" icon={Package} />
                        </div>
                    </div>

                    <div className="ao-small-stats-card">
                        <div className="ao-small-stat">
                            <Users size={18} />
                            <div>
                                <p className="ao-small-stat-val">{totalStudents}</p>
                                <p className="ao-small-stat-lab">Total Residents</p>
                            </div>
                        </div>
                        <div className="ao-small-stat">
                            <CheckCircle size={18} />
                            <div>
                                <p className="ao-small-stat-val">{activeStudents}</p>
                                <p className="ao-small-stat-lab">Active Mess Users</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard: React.FC<{ label: string; value: any; icon: any; color: string; sublabel: string }> = ({ label, value, icon: Icon, color, sublabel }) => {
    return (
        <div className={`ao-stat-card ${color}`}>
            <div className="ao-stat-icon-wrapper">
                <p className="ao-stat-label">{label}</p>
                <div className="ao-stat-icon">
                    <Icon size={16} />
                </div>
            </div>
            <p className="ao-stat-value">{value}</p>
            <p className="ao-stat-sublabel">{sublabel}</p>
        </div>
    );
};

const TaskItem: React.FC<{ title: string; description: string; icon: any; color: string; action: string; to: string; border: string }> = ({ title, description, icon: Icon, color, action, to, border }) => {
    return (
        <Link to={to} className={`ao-task-item ${border}`}>
            <div className="ao-task-content">
                <div className={`ao-task-icon ${color}`}>
                    <Icon size={18} />
                </div>
                <div>
                    <h4 className="ao-task-title">{title}</h4>
                    <p className="ao-task-desc">{description}</p>
                </div>
            </div>
            <span className="ao-task-action">
                {action} →
            </span>
        </Link>
    );
};

const QuickLink: React.FC<{ label: string; to: string; icon: any }> = ({ label, to, icon: Icon }) => (
    <Link to={to} className="ao-quick-link-item">
        <Icon size={14} className="ao-quick-link-icon" />
        <span className="ao-quick-link-label">{label}</span>
    </Link>
);


export default AdminOverview;
