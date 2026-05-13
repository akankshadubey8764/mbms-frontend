import React, { useEffect, useState } from 'react';
import { Wallet, Clock, CheckCircle2, UserCircle, Building, X, AlertTriangle, BellRing } from 'lucide-react';
import apiClient from '../../../api/apiClient';
import './StudentOverview.css';

interface DashboardStats {
    totalBills: number;
    pendingBills: number;
    totalAttendance: number;
    lastPaymentDate: string | null;
    studentName: string;
    regNo: string;
    block: string;
    roomNo: string;
}

const StudentOverview: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    const [notifications, setNotifications] = useState<any[]>([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [profileRes, billRes, notifRes] = await Promise.all([
                    apiClient.get('/students/profile'),
                    apiClient.get('/students/mess-bills/history'),
                    apiClient.get('/students/notifications')
                ]);

                const profile = profileRes.data;
                const bills = billRes.data || [];
                const unreadNotifs = (notifRes.data || []).filter((n: any) => !n.read);
                setNotifications(unreadNotifs);
                
                const pendingBills = bills.filter((b: any) => b.paymentStatus !== 'PAID').length;
                const latestBill = bills.length > 0 ? bills[bills.length - 1] : null;

                setStats({
                    totalBills: bills.length,
                    pendingBills,
                    totalAttendance: 100, // Placeholder if not in profile
                    lastPaymentDate: latestBill ? latestBill.calculatedAt : null,
                    studentName: `${profile.firstName} ${profile.lastName}`,
                    regNo: profile.regNumber,
                    block: profile.block,
                    roomNo: profile.roomNo.toString()
                });
            } catch (error) {
                console.error('Failed to fetch dashboard data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const markAsRead = async (id: string) => {
        try {
            await apiClient.patch(`/students/notifications/${id}/read`);
            setNotifications(prev => prev.filter(n => n._id !== id));
        } catch (err) {
            console.error('Failed to mark as read', err);
        }
    };

    if (loading) return null;

    const statItems = [
        { label: 'Unpaid Bills', value: stats?.pendingBills || 0, icon: Wallet, color: 'bg-blue-soft' },
        { label: 'Attendance', value: `${stats?.totalAttendance}%`, icon: Clock, color: 'bg-emerald-soft' },
        { label: 'Room No', value: stats?.roomNo || '-', icon: Building, color: 'bg-amber-soft' },
        { label: 'Status', value: 'Active', icon: CheckCircle2, color: 'bg-purple-soft' },
    ];

    return (
        <div className="so-container">
            {/* Payment Reminder Alert */}
            {stats && stats.pendingBills > 0 && (
                <div className="so-reminder-alert">
                    <div className="so-reminder-icon">
                        <AlertTriangle size={20} />
                    </div>
                    <div className="so-reminder-content">
                        <h3>Outstanding Payment Reminder</h3>
                        <p>You have <strong>{stats.pendingBills} unpaid</strong> mess bill{stats.pendingBills > 1 ? 's' : ''}. Please clear your dues as soon as possible.</p>
                    </div>
                    <button className="so-reminder-btn" onClick={() => window.location.href='/student-dashboard/mess-bill'}>
                        View Bills
                    </button>
                </div>
            )}

            {/* Notifications Section */}
            {notifications.length > 0 && (
                <div className="so-notif-section">
                    {notifications.map(notif => (
                        <div key={notif._id} className={`so-notif-banner ${notif.type === 'BILL_PUBLISHED' ? 'bill-announcement' : ''}`}>
                            <div className="so-notif-content">
                                <BellRing size={16} className="so-notif-icon-main" />
                                <p className="so-notif-text">{notif.message}</p>
                            </div>
                            <button onClick={() => markAsRead(notif._id)} className="so-notif-close-btn" title="Dismiss">
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
            {/* Quick Stats Grid */}
            <div className="so-grid">
                {statItems.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                        <div key={idx} className="so-stat-card">
                            <div className={`so-icon-box ${item.color}`}>
                                <Icon size={24} />
                            </div>
                            <div className="so-stat-info">
                                <span className="so-stat-label">{item.label}</span>
                                <span className="so-stat-value">{item.value}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Main Content Card */}
            <div className="so-main-card">
                <div className="so-card-header">
                    <div className="so-header-bg-circle"></div>
                    <div className="so-header-content">
                        <span className="so-welcome-tag">Student Dashboard</span>
                        <h1 className="so-welcome-title">Welcome back, {stats?.studentName}!</h1>
                        <p className="so-welcome-text">Manage your hostel details, track your mess bills, and stay updated with live announcements from the mess management.</p>
                    </div>
                </div>

                <div className="so-card-body">
                    <h2 className="so-section-title">
                        <UserCircle size={22} className="text-primary-600" />
                        Quick Profile Overview
                    </h2>
                    
                    <div className="so-info-grid">
                        <div className="so-info-item">
                            <span className="so-info-label">Registration Number</span>
                            <p className="so-info-value">{stats?.regNo}</p>
                        </div>
                        <div className="so-info-item">
                            <span className="so-info-label">Assigned Hostel Block</span>
                            <p className="so-info-value">{stats?.block}</p>
                        </div>
                        <div className="so-info-item">
                            <span className="so-info-label">Room Assignment</span>
                            <p className="so-info-value">Room #{stats?.roomNo}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentOverview;
