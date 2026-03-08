import React, { useState, useEffect } from 'react';
import { Users, Wallet, CheckCircle, FileText, TrendingUp, UserPlus, Clock, Package, MessageSquare, Utensils } from 'lucide-react';
import { Link } from 'react-router-dom';
import apiClient from '../../../api/apiClient';
import './AdminOverview.css';

interface DashboardStats {
    totalStudents: number;
    totalRevenue: number;
    activeStudents: number;
    pendingApprovals: number;
}

const AdminOverview: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats>({
        totalStudents: 0,
        totalRevenue: 0,
        activeStudents: 0,
        pendingApprovals: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await apiClient.get('/admin/stats');
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching admin stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="ao-loader-container">
                <div className="ao-loader-spinner"></div>
            </div>
        );
    }

    return (
        <div className="admin-overview-container">
            {/* <div>
                <h1 className="ao-header-title">Admin Overview</h1>
                <p className="ao-header-subtitle">Control center for TPGIT Hostel Mess Management</p>
            </div> */}

            {/* Main Stats Grid */}
            <div className="ao-stats-grid">
                <StatCard
                    label="Total Students"
                    value={stats.totalStudents}
                    icon={Users}
                    color="blue"
                    sublabel="Approved residents"
                />
                <StatCard
                    label="Total Revenue"
                    value={`₹${stats.totalRevenue.toLocaleString()}`}
                    icon={Wallet}
                    color="emerald"
                    sublabel="Total mess bill collected"
                />
                <StatCard
                    label="Active Mess Users"
                    value={stats.activeStudents}
                    icon={CheckCircle}
                    color="purple"
                    sublabel="Currently enrolled"
                />
                <StatCard
                    label="Pending Requests"
                    value={stats.pendingApprovals}
                    icon={Clock}
                    color="rose"
                    sublabel="Awaiting approval"
                />
            </div>

            <div className="ao-content-grid">
                {/* Priority Actions */}
                <div className="ao-priority-container">
                    <div className="ao-priority-card">
                        <div className="ao-priority-header">
                            <h3 className="ao-priority-title">Priority Actions</h3>
                            <span className="ao-priority-badge">Dashboard Tasks</span>
                        </div>
                        <div className="ao-priority-list">
                            <TaskItem
                                title="Approve Student Registrations"
                                description={`${stats.pendingApprovals > 0 ? `${stats.pendingApprovals} students` : 'No students'} are waiting for approval.`}
                                icon={UserPlus}
                                color="rose"
                                action="Review Requests"
                                to="/admin-dashboard/approvals"
                            />
                            <TaskItem
                                title="Generate Monthly Mess Bills"
                                description="Calculate and issue mess bills based on attendance data."
                                icon={FileText}
                                color="blue"
                                action="Manage Bills"
                                to="/admin-dashboard/mess-bills"
                            />
                            <TaskItem
                                title="Check Inventory Stock"
                                description="Monitor grocery and supply levels for the mess kitchen."
                                icon={TrendingUp}
                                color="amber"
                                action="View Stock"
                                to="/admin-dashboard/inventory"
                            />
                            <TaskItem
                                title="View Student Queries"
                                description="Review complaints and queries submitted by hostel residents."
                                icon={MessageSquare}
                                color="purple"
                                action="View Queries"
                                to="/admin-dashboard/queries"
                            />
                        </div>
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <div className="ao-quick-links-container">
                        <h3 className="ao-quick-links-title">Quick Navigation</h3>
                        <div className="ao-quick-links-list">
                            <QuickLink label="Add New Student" to="/admin-dashboard/students" icon={UserPlus} />
                            <QuickLink label="View Students List" to="/admin-dashboard/students" icon={Users} />
                            <QuickLink label="Update Mess Menu" to="/admin-dashboard/mess-menu" icon={Utensils} />
                            <QuickLink label="Grocery / Inventory" to="/admin-dashboard/inventory" icon={Package} />
                            <QuickLink label="System Settings" to="/admin-dashboard/settings" icon={FileText} />
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
                    <Icon size={20} />
                </div>
            </div>
            <p className="ao-stat-value">{value}</p>
            <p className="ao-stat-sublabel">{sublabel}</p>
        </div>
    );
};

const TaskItem: React.FC<{ title: string; description: string; icon: any; color: string; action: string; to: string }> = ({ title, description, icon: Icon, color, action, to }) => {
    return (
        <Link to={to} className="ao-task-item group">
            <div className="ao-task-content">
                <div className={`ao-task-icon ${color}`}>
                    <Icon size={20} />
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
    <Link to={to} className="ao-quick-link-item group">
        <Icon size={16} className="ao-quick-link-icon" />
        <span className="ao-quick-link-label">{label}</span>
    </Link>
);

export default AdminOverview;
