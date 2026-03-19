import React, { useState, useEffect } from 'react';
import { Package, TrendingUp, ShoppingCart, AlertTriangle, Clock, ChevronRight, Calculator } from 'lucide-react';
import apiClient from '../../../api/apiClient';
import './MessManagerOverview.css';

interface StockItem {
    _id: string;
    itemName: string;
    currentStock: number;
    minimumStock: number;
    status: 'Good' | 'Low' | 'Critical';
    unit: string;
}

interface DashboardStats {
    totalItems: number;
    lowStockCount: number;
    criticalStockCount: number;
    monthlyExpenditure: number;
}

const MessManagerOverview: React.FC = () => {
    const [stocks, setStocks] = useState<StockItem[]>([]);
    const [stats, setStats] = useState<DashboardStats>({
        totalItems: 0,
        lowStockCount: 0,
        criticalStockCount: 0,
        monthlyExpenditure: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // Fetch Stock Data
            const stockResponse = await apiClient.get('/admin/stock');
            const inventoryData = stockResponse.data.data || [];
            setStocks(inventoryData);

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
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Good': return 'mmo-status-good';
            case 'Low': return 'mmo-status-low';
            case 'Critical': return 'mmo-status-critical';
            default: return 'mmo-status-default';
        }
    };

    if (loading) {
        return (
            <div className="mmo-loader-container">
                <div className="mmo-loader"></div>
                <p className="font-bold text-slate-400 mt-4 uppercase tracking-widest text-xs">Assembling Dashboard...</p>
            </div>
        );
    }

    const criticalItems = stocks.filter(s => s.status === 'Critical');

    return (
        <div className="mmo-container animate-fade-in">
            <div className="mmo-header-alt">
                <div className="flex items-center gap-4">
                    <img src="/images/logos/tpgit_logo.png" alt="TPGIT" className="w-16 h-16" />
                    <div>
                        <h1 className="mmo-title-alt">Mess Operations</h1>
                        <p className="mmo-subtitle-alt">TPGIT Hostel Mess Management Portal</p>
                    </div>
                </div>
                <div className="mmo-date-display">
                    <Clock size={16} />
                    <span>{new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
                </div>
            </div>

            {/* Core Metrics */}
            <div className="mmo-stats-grid">
                <MetricCard
                    label="Stock Expenditure"
                    value={`₹${(stats.monthlyExpenditure || 0).toLocaleString()}`}
                    icon={Calculator}
                    color="sky"
                    subtitle="Current Month Total"
                />
                <MetricCard
                    label="Critical Items"
                    value={stats.criticalStockCount}
                    icon={AlertTriangle}
                    color="rose"
                    subtitle="Items needing restock"
                />
                <MetricCard
                    label="Low Stock"
                    value={stats.lowStockCount}
                    icon={TrendingUp}
                    color="amber"
                    subtitle="Consider restock soon"
                />
                <MetricCard
                    label="Total Inventory"
                    value={stats.totalItems}
                    icon={ShoppingCart}
                    color="emerald"
                    subtitle="Items currently tracked"
                />
            </div>

            <div className="mmo-main-content">
                {/* Left Panel: Critical Restock */}
                <div className="mmo-panel">
                    <div className="mmo-panel-header">
                        <div>
                            <h2 className="mmo-panel-title">Priority Restock</h2>
                            <p className="mmo-panel-desc">Items below safety threshold</p>
                        </div>
                        <span className="mmo-badge-rose">{criticalItems.length} items</span>
                    </div>
                    <div className="mmo-panel-body">
                        {criticalItems.length > 0 ? (
                            <div className="mmo-critical-items">
                                {criticalItems.map(item => (
                                    <div key={item._id} className="mmo-restock-card">
                                        <div className="mmo-restock-info">
                                            <p className="mmo-restock-name">{item.itemName}</p>
                                            <p className="mmo-restock-qty">Current: <span className="text-rose-600 font-bold">{item.currentStock} {item.unit}</span></p>
                                        </div>
                                        <div className="mmo-restock-target">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">Threshold</p>
                                            <p className="font-bold">{item.minimumStock}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="mmo-empty-state">
                                <Package size={40} className="text-slate-200 mb-2" />
                                <p>All items above critical level.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel: Inventory Quick Look */}
                <div className="mmo-panel flex-grow">
                    <div className="mmo-panel-header">
                        <h2 className="mmo-panel-title">Inventory Health</h2>
                        <button className="mmo-panel-link">View Full Stock <ChevronRight size={14} /></button>
                    </div>
                    <div className="mmo-panel-body no-padding">
                        <table className="mmo-table-alt">
                            <thead>
                                <tr>
                                    <th>Item Name</th>
                                    <th className="center">Current Stock</th>
                                    <th className="center">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stocks.slice(0, 8).map(item => (
                                    <tr key={item._id}>
                                        <td className="font-bold text-slate-700">{item.itemName}</td>
                                        <td className="center font-black text-slate-600">{item.currentStock} <span className="text-[10px] lowercase text-slate-400 font-medium">{item.unit}</span></td>
                                        <td className="center">
                                            <span className={`mmo-status-pill ${getStatusColor(item.status)}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MetricCard: React.FC<{ label: string; value: any; icon: any; color: string; subtitle: string }> = ({ label, value, icon: Icon, color, subtitle }) => (
    <div className={`mmo-metric-card ${color}`}>
        <div className="mmo-metric-main">
            <div>
                <p className="mmo-metric-label">{label}</p>
                <p className="mmo-metric-value">{value}</p>
            </div>
            <div className="mmo-metric-icon">
                <Icon size={24} />
            </div>
        </div>
        <p className="mmo-metric-subtitle">{subtitle}</p>
    </div>
);

export default MessManagerOverview;
