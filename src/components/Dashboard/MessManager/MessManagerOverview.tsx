import React, { useState, useEffect } from 'react';
import { Package, TrendingUp, ShoppingCart, BarChart3, AlertTriangle } from 'lucide-react';
import apiClient from '../../../api/apiClient';
import './MessManagerOverview.css';

interface StockItem {
    id: string;
    itemName: string;
    currentStock: number;
    minimumStock: number;
    status: 'Good' | 'Low' | 'Critical';
}

const MessManagerOverview: React.FC = () => {
    const [stocks, setStocks] = useState<StockItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Reusing admin stock endpoint but it works for manager too
            const response = await apiClient.get('/admin/stock');
            if (response.data && response.data.data) {
                setStocks(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
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
                <p>Loading overview data...</p>
            </div>
        );
    }

    const criticalItems = stocks.filter(s => s.status === 'Critical');
    const lowItems = stocks.filter(s => s.status === 'Low');

    return (
        <div className="mmo-container">
            <div className="mmo-welcome">
                <h1 className="mmo-title">Operations Overview</h1>
                <p className="mmo-subtitle">Monitor stock levels and manage grocery deliveries</p>
            </div>

            {/* Stats Cards */}
            <div className="mmo-stats-grid">
                <div className="mmo-stat-card mmo-sky">
                    <div className="mmo-stat-info">
                        <span className="mmo-stat-label">Total Items</span>
                        <span className="mmo-stat-value">{stocks.length}</span>
                    </div>
                    <div className="mmo-stat-icon-bg">
                        <ShoppingCart size={24} />
                    </div>
                </div>
                <div className="mmo-stat-card mmo-emerald">
                    <div className="mmo-stat-info">
                        <span className="mmo-stat-label">In Stock</span>
                        <span className="mmo-stat-value">{stocks.filter(s => s.status === 'Good').length}</span>
                    </div>
                    <div className="mmo-stat-icon-bg">
                        <Package size={24} />
                    </div>
                </div>
                <div className="mmo-stat-card mmo-amber">
                    <div className="mmo-stat-info">
                        <span className="mmo-stat-label">Low Stock</span>
                        <span className="mmo-stat-value">{lowItems.length}</span>
                    </div>
                    <div className="mmo-stat-icon-bg">
                        <TrendingUp size={24} />
                    </div>
                </div>
                <div className="mmo-stat-card mmo-rose">
                    <div className="mmo-stat-info">
                        <span className="mmo-stat-label">Critical</span>
                        <span className="mmo-stat-value">{criticalItems.length}</span>
                    </div>
                    <div className="mmo-stat-icon-bg">
                        <AlertTriangle size={24} />
                    </div>
                </div>
            </div>

            <div className="mmo-content-grid">
                {/* Critical Issues */}
                <div className="mmo-card mmo-critical-panel">
                    <div className="mmo-card-header">
                        <h2 className="mmo-card-title">Immediate Attention Required</h2>
                        <span className="mmo-count-badge">{criticalItems.length}</span>
                    </div>
                    <div className="mmo-card-body">
                        {criticalItems.length > 0 ? (
                            <div className="mmo-issue-list">
                                {criticalItems.map(item => (
                                    <div key={item.id} className="mmo-issue-item">
                                        <div className="mmo-issue-icon">!</div>
                                        <div className="mmo-issue-details">
                                            <p className="mmo-issue-name">{item.itemName}</p>
                                            <p className="mmo-issue-desc">Only {item.currentStock} units remaining (Threshold: {item.minimumStock})</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="mmo-empty-text">No critical stock issues at the moment.</p>
                        )}
                    </div>
                </div>

                {/* Stock Status Table */}
                <div className="mmo-card mmo-stock-panel">
                    <div className="mmo-card-header">
                        <h2 className="mmo-card-title">Stock Status Overview</h2>
                    </div>
                    <div className="mmo-card-body no-padding">
                        <div className="mmo-table-wrapper">
                            <table className="mmo-table">
                                <thead>
                                    <tr>
                                        <th>Item Name</th>
                                        <th>Current Stock</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stocks.slice(0, 8).map(item => (
                                        <tr key={item.id}>
                                            <td className="mmo-item-name">{item.itemName}</td>
                                            <td className="mmo-item-qty">{item.currentStock}</td>
                                            <td>
                                                <span className={`mmo-status-badge ${getStatusColor(item.status)}`}>
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

            {/* Analytics Placeholder */}
            <div className="mmo-card mmo-analytics-panel">
                <div className="mmo-card-header">
                    <h2 className="mmo-card-title">Consumption Analytics</h2>
                    <p className="mmo-card-subtitle text-xs uppercase font-bold tracking-widest text-slate-400">Past 30 Days</p>
                </div>
                <div className="mmo-card-body">
                    <div className="mmo-analytics-grid">
                        <div className="mmo-chart-placeholder sky">
                            <BarChart3 size={32} />
                            <p>Monthly Consumption Trends</p>
                        </div>
                        <div className="mmo-chart-placeholder emerald">
                            <TrendingUp size={32} />
                            <p>Stock Utilization Patterns</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessManagerOverview;
