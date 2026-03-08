import React, { useState, useEffect } from 'react';
import { Package, AlertTriangle, TrendingUp, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import apiClient from '../../../api/apiClient';
import './AdminInventory.css';

interface StockItem {
    _id: string;
    itemName: string;
    currentStock: number;
    minimumStock: number;
    unit: string;
    category: string;
    status: 'Good' | 'Low' | 'Critical';
}

const AdminInventory: React.FC = () => {
    const [stocks, setStocks] = useState<StockItem[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);

    useEffect(() => {
        fetchInventory();
    }, [currentPage]);

    const fetchInventory = async () => {
        setLoading(true);
        try {
            const skip = (currentPage - 1) * limit;
            const response = await apiClient.get('/admin/stock', { params: { skip, limit } });
            if (response.data && response.data.data) {
                setStocks(response.data.data);
                setTotal(response.data.total);
            } else {
                setStocks([]);
                setTotal(0);
            }
        } catch (error) {
            console.error('Error fetching inventory:', error);
            setStocks([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Good': return 'ai-status-good';
            case 'Low': return 'ai-status-low';
            case 'Critical': return 'ai-status-critical';
            default: return 'ai-status-default';
        }
    };

    const filteredStocks = stocks.filter(s =>
        (s.itemName || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const criticalCount = stocks.filter(s => s.status === 'Critical').length;
    const lowCount = stocks.filter(s => s.status === 'Low').length;

    return (
        <div className="ai-container">
            {/* <div className="ai-header-container">
                <div>
                    <h1 className="ai-header-title">Stock Inventory</h1>
                    <p className="ai-header-subtitle">Monitor and manage mess groceries and essential supplies</p>
                </div>
            </div> */}

            {/* Quick Stats */}
            <div className="ai-stats-grid">
                <InventoryMiniCard label="Critical Items" value={criticalCount} icon={AlertTriangle} color="rose" />
                <InventoryMiniCard label="Low Stock Items" value={lowCount} icon={TrendingUp} color="amber" />
                <InventoryMiniCard label="Total Items Tracked" value={total} icon={Package} color="blue" />
            </div>

            {/* Inventory Table */}
            <div className="ai-content-card">
                <div className="ai-toolbar">
                    <div className="ai-search-wrapper">
                        <Search className="ai-search-icon" size={16} />
                        <input
                            type="text"
                            placeholder="Search inventory..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="ai-search-input"
                        />
                    </div>
                    <span className="ai-item-count">
                        {total} items tracked
                    </span>
                </div>

                <div className="ai-table-wrapper">
                    <table className="ai-table">
                        <thead>
                            <tr>
                                <th className="ai-th">Item Name</th>
                                <th className="ai-th center">Current Stock</th>
                                <th className="ai-th center">Min. Threshold</th>
                                <th className="ai-th center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={4} className="ai-loader-row">Loading Stock Data...</td></tr>
                            ) : filteredStocks.length === 0 ? (
                                <tr><td colSpan={4} className="ai-empty-row">No inventory data available. Add groceries via the Mess Manager panel.</td></tr>
                            ) : (
                                filteredStocks.map((item) => (
                                    <tr key={item._id}>
                                        <td className="ai-td">
                                            <div className="ai-item-cell">
                                                <div className="ai-item-avatar">
                                                    {(item.itemName || 'I')[0]}
                                                </div>
                                                <div>
                                                    <p className="ai-item-name">{item.itemName}</p>
                                                    <p className="ai-item-category">{item.category}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="ai-td center">
                                            <div className="ai-stock-cell">
                                                <span className="ai-stock-value">{item.currentStock}</span>
                                                <span className="ai-stock-unit">{item.unit}</span>
                                            </div>
                                        </td>
                                        <td className="ai-td center">
                                            <div className="ai-stock-cell">
                                                <span className="ai-stock-min">{item.minimumStock}</span>
                                                <span className="ai-stock-unit">{item.unit}</span>
                                            </div>
                                        </td>
                                        <td className="ai-td center">
                                            <span className={`ai-status-badge ${getStatusColor(item.status)}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="ai-pagination">
                    <p className="ai-pagination-info">
                        Showing {filteredStocks.length} of {total} items
                    </p>
                    <div className="ai-pagination-controls">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => p - 1)}
                            className="ai-page-btn"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <span className="ai-page-current">{currentPage}</span>
                        <button
                            disabled={currentPage * limit >= total}
                            onClick={() => setCurrentPage(p => p + 1)}
                            className="ai-page-btn"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const InventoryMiniCard: React.FC<{ label: string; value: any; icon: any; color: string }> = ({ label, value, icon: Icon, color }) => {
    return (
        <div className={`ai-stat-card ${color}`}>
            <div className="ai-stat-content">
                <p className="ai-stat-label">{label}</p>
                <p className="ai-stat-value">{value}</p>
            </div>
            <Icon size={24} className="ai-stat-icon" />
        </div>
    );
};

export default AdminInventory;
