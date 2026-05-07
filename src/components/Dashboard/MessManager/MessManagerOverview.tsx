import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Package, TrendingUp, ShoppingCart, AlertCircle, Calculator, FileText, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import apiClient from '../../../api/apiClient';
import './MessManagerOverview.css';

interface DashboardStats {
    totalItems: number;
    lowStockCount: number;
    criticalStockCount: number;
    monthlyExpenditure: number;
}

const MessManagerOverview: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats>({
        totalItems: 0,
        lowStockCount: 0,
        criticalStockCount: 0,
        monthlyExpenditure: 0
    });
    const [loading, setLoading] = useState(true);
    const isFetching = useRef(false);

    const fetchDashboardData = useCallback(async () => {
        if (isFetching.current) return;
        isFetching.current = true;
        try {
            // Fetch Stock Data
            const stockResponse = await apiClient.get('/admin/stock');
            const inventoryData = stockResponse.data.data || [];

            // Fetch History for Expenditure calculation
            const groceryResponse = await apiClient.get('/mess/grocery');
            const now = new Date();
            const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

            let monthlyTotal = 0;
            (groceryResponse.data || []).forEach((item: any) => {
                if (item.purchaseHistory) {
                    item.purchaseHistory.forEach((h: any) => {
                        const hMonth = new Date(h.date).toISOString().slice(0, 7);
                        if (hMonth === currentMonth) {
                            monthlyTotal += h.totalPrice;
                        }
                    });
                }
            });

            setStats({
                totalItems: inventoryData.length,
                lowStockCount: inventoryData.filter((s: any) => s.status === 'Low').length,
                criticalStockCount: inventoryData.filter((s: any) => s.status === 'Critical').length,
                monthlyExpenditure: monthlyTotal
            });

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
            isFetching.current = false;
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    if (loading) {
        return (
            <div className="mo-loader-container">
                <div className="mo-loader-spinner"></div>
            </div>
        );
    }

    const {
        totalItems = 0,
        lowStockCount = 0,
        criticalStockCount = 0,
        monthlyExpenditure = 0
    } = stats;

    return (
        <div className="mess-overview-container animate-fade-in">
            {/* Main Stats Grid */}
            <div className="mo-stats-grid">
                <StatCard
                    label="Stock Expenditure"
                    value={`₹${(monthlyExpenditure || 0).toLocaleString()}`}
                    icon={Calculator}
                    color="indigo"
                    sublabel="Current Month Total"
                />
                <StatCard
                    label="Critical Items"
                    value={criticalStockCount}
                    icon={AlertCircle}
                    color="rose"
                    sublabel="Items needing restock"
                />
                <StatCard
                    label="Low Stock"
                    value={lowStockCount}
                    icon={TrendingUp}
                    color="amber"
                    sublabel="Consider restock soon"
                />
                <StatCard
                    label="Total Inventory"
                    value={totalItems}
                    icon={Package}
                    color="emerald"
                    sublabel="Items currently tracked"
                />
            </div>

            <div className="mo-content-grid">
                {/* Priority Actions */}
                <div className="mo-priority-container">
                    <div className="mo-priority-card">
                        <div className="mo-priority-header">
                            <h3 className="mo-priority-title">Management Actions</h3>
                            <span className="mo-priority-badge">Mess Control</span>
                        </div>
                        <div className="mo-priority-list">
                            <TaskItem
                                title="Update Grocery Stock"
                                description={`${criticalStockCount} items critically low on stock.`}
                                icon={ShoppingCart}
                                color="rose"
                                action="Restock"
                                border="left-rose"
                                to="/mess-dashboard/grocery"
                            />
                            <TaskItem
                                title="Plan Mess Menu"
                                description="Review and update this week's food menu."
                                icon={FileText}
                                color="amber"
                                action="Edit Menu"
                                border="left-amber"
                                to="/mess-dashboard/menu"
                            />
                            <TaskItem
                                title="Stock Utilization"
                                description="Check usage statistics for essential items."
                                icon={TrendingUp}
                                color="blue"
                                action="View Stocks"
                                border="left-blue"
                                to="/mess-dashboard/grocery"
                            />
                        </div>
                    </div>
                </div>

                {/* Statistics & Navigation */}
                <div className="mo-side-panel">
                    <div className="mo-quick-links-container">
                        <h3 className="mo-quick-links-title">Quick Settings</h3>
                        <div className="mo-quick-links-list">
                            <QuickLink label="Grocery Stock" to="/mess-dashboard/grocery" icon={Package} />
                            <QuickLink label="Update Menu" to="/mess-dashboard/menu" icon={FileText} />
                            <QuickLink label="Account Settings" to="/mess-dashboard/settings" icon={Calculator} />
                        </div>
                    </div>

                    <div className="mo-small-stats-card">
                        <div className="mo-small-stat">
                            <div className="mo-small-stat-info">
                                <span className="mo-small-stat-label">Stock Status</span>
                                <span className="mo-small-stat-value">{totalItems - criticalStockCount} Good</span>
                            </div>
                            <CheckCircle size={20} className="text-emerald-500" />
                        </div>
                        <div className="mo-small-stat">
                            <div className="mo-small-stat-info">
                                <span className="mo-small-stat-label">Needs Attention</span>
                                <span className="mo-small-stat-value">{criticalStockCount + lowStockCount} Items</span>
                            </div>
                            <AlertCircle size={20} className="text-amber-500" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Sub-components matching AdminOverview
const StatCard: React.FC<{ label: string; value: any; icon: any; color: string; sublabel: string }> = ({ label, value, icon: Icon, color, sublabel }) => (
    <div className={`mo-stat-card ${color}`}>
        <div className="mo-stat-icon-wrapper">
            <span className="mo-stat-label">{label}</span>
            <div className="mo-stat-icon">
                <Icon size={18} />
            </div>
        </div>
        <div>
            <h4 className="mo-stat-value">{value}</h4>
            <p className="mo-stat-sublabel">{sublabel}</p>
        </div>
    </div>
);

const TaskItem: React.FC<{ title: string; description: string; icon: any; color: string; action: string; border: string; to: string }> = ({ title, description, icon: Icon, color, action, to }) => (
    <Link to={to} className={`mo-task-item`}>
        <div className="mo-task-content">
            <div className={`mo-task-icon ${color}`}>
                <Icon size={18} />
            </div>
            <div>
                <h4 className="mo-task-title">{title}</h4>
                <p className="mo-task-desc">{description}</p>
            </div>
        </div>
        <span className="mo-task-action">{action} &rarr;</span>
    </Link>
);

const QuickLink: React.FC<{ label: string; to: string; icon: any }> = ({ label, to, icon: Icon }) => (
    <Link to={to} className="mo-quick-link">
        <Icon size={16} />
        <span>{label}</span>
    </Link>
);

export default MessManagerOverview;
