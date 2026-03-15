import React, { useState, useEffect } from 'react';
import { Package, AlertTriangle, TrendingUp, Search, ChevronLeft, ChevronRight, History, ShoppingCart, User, Calendar } from 'lucide-react';
import apiClient from '../../../api/apiClient';
import toast from 'react-hot-toast';
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

interface PurchaseHistory {
    seller: string;
    itemName: string;
    quantity: number;
    rate: number;
    totalPrice: number;
    date: string;
}

const AdminInventory: React.FC = () => {
    const [stocks, setStocks] = useState<StockItem[]>([]);
    const [history, setHistory] = useState<PurchaseHistory[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);
    const [activeView, setActiveView] = useState<'stock' | 'history'>('stock');

    useEffect(() => {
        if (activeView === 'stock') {
            fetchInventory();
        } else {
            fetchHistory();
        }
    }, [currentPage, activeView]);

    const fetchInventory = async () => {
        setLoading(true);
        try {
            const skip = (currentPage - 1) * limit;
            const response = await apiClient.get('/admin/stock', { params: { skip, limit } });
            if (response.data && response.data.data) {
                setStocks(response.data.data);
                setTotal(response.data.total);
            }
        } catch (error) {
            console.error('Error fetching inventory:', error);
            toast.error('Failed to load inventory');
        } finally {
            setLoading(false);
        }
    };

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/mess/grocery');
            // Flatten the nested history from all items
            const allHistory: PurchaseHistory[] = [];
            response.data.forEach((item: any) => {
                if (item.purchaseHistory) {
                    item.purchaseHistory.forEach((h: any) => {
                        allHistory.push({
                            ...h,
                            itemName: item.itemName
                        });
                    });
                }
            });
            // Sort by date descending
            allHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setHistory(allHistory);
            setTotal(allHistory.length);
        } catch (error) {
            console.error('Error fetching history:', error);
            toast.error('Failed to load purchase history');
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

    const filteredHistory = history.filter(h =>
        (h.itemName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (h.seller || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const criticalCount = stocks.filter(s => s.status === 'Critical').length;
    const lowCount = stocks.filter(s => s.status === 'Low').length;

    return (
        <div className="ai-container animate-fade-in">
            {/* Quick Stats */}
            <div className="ai-stats-grid">
                <InventoryMiniCard label="Critical Items" value={criticalCount} icon={AlertTriangle} color="rose" />
                <InventoryMiniCard label="Low Stock Items" value={lowCount} icon={TrendingUp} color="amber" />
                <InventoryMiniCard label="Total Items Tracked" value={activeView === 'stock' ? total : stocks.length} icon={Package} color="blue" />
            </div>

            {/* View Toggle */}
            <div className="ai-view-header">
                <div className="ai-tabs">
                    <button
                        className={`ai-tab ${activeView === 'stock' ? 'active' : ''}`}
                        onClick={() => { setActiveView('stock'); setCurrentPage(1); }}
                    >
                        <ShoppingCart size={18} />
                        <span>Current Stock</span>
                    </button>
                    <button
                        className={`ai-tab ${activeView === 'history' ? 'active' : ''}`}
                        onClick={() => { setActiveView('history'); setCurrentPage(1); }}
                    >
                        <History size={18} />
                        <span>Purchase Records</span>
                    </button>
                </div>
            </div>

            {/* Inventory Table */}
            <div className="ai-content-card">
                <div className="ai-toolbar">
                    <div className="ai-search-wrapper">
                        <Search className="ai-search-icon" size={16} />
                        <input
                            type="text"
                            placeholder={activeView === 'stock' ? "Search stock..." : "Search records..."}
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="ai-search-input"
                        />
                    </div>
                </div>

                <div className="ai-table-wrapper">
                    <table className="ai-table">
                        <thead>
                            {activeView === 'stock' ? (
                                <tr>
                                    <th className="ai-th">Item Name</th>
                                    <th className="ai-th center">Current Stock</th>
                                    <th className="ai-th center">Min. Threshold</th>
                                    <th className="ai-th center">Status</th>
                                </tr>
                            ) : (
                                <tr>
                                    <th className="ai-th">Seller Name</th>
                                    <th className="ai-th">Item Name</th>
                                    <th className="ai-th center">Quantity</th>
                                    <th className="ai-th center">Rate</th>
                                    <th className="ai-th center">Total Price</th>
                                    <th className="ai-th center">Date</th>
                                </tr>
                            )}
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={6} className="ai-loader-row"><div className="ai-spinner"></div></td></tr>
                            ) : (activeView === 'stock' ? filteredStocks : filteredHistory).length === 0 ? (
                                <tr><td colSpan={6} className="ai-empty-row">No data available.</td></tr>
                            ) : activeView === 'stock' ? (
                                filteredStocks.map((item) => (
                                    <tr key={item._id}>
                                        <td className="ai-td">
                                            <div className="ai-item-cell">
                                                <div className="ai-item-avatar">{(item.itemName || 'I')[0]}</div>
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
                            ) : (
                                filteredHistory.map((h, idx) => (
                                    <tr key={idx}>
                                        <td className="ai-td">
                                            <div className="ai-seller-info">
                                                <User size={14} className="ai-seller-icon" />
                                                <span>{h.seller}</span>
                                            </div>
                                        </td>
                                        <td className="ai-td font-bold">{h.itemName}</td>
                                        <td className="ai-td center">{h.quantity}</td>
                                        <td className="ai-td center">₹{h.rate}</td>
                                        <td className="ai-td center font-bold">₹{h.totalPrice}</td>
                                        <td className="ai-td center">
                                            <div className="ai-date-info">
                                                <Calendar size={14} />
                                                <span>{new Date(h.date).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="ai-pagination">
                    <p className="ai-pagination-info">Showing {(activeView === 'stock' ? filteredStocks : filteredHistory).length} records</p>
                    <div className="ai-pagination-controls">
                        <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="ai-page-btn">
                            <ChevronLeft size={16} />
                        </button>
                        <span className="ai-page-current">{currentPage}</span>
                        <button disabled={currentPage * limit >= (activeView === 'stock' ? total : history.length)} onClick={() => setCurrentPage(p => p + 1)} className="ai-page-btn">
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
