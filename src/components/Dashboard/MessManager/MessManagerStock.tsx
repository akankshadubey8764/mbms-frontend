import React, { useState, useEffect } from 'react';
import { Package, MinusCircle, Search, AlertCircle, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '../../../api/apiClient';
import './MessManagerStock.css';

interface StockItem {
    id: string;
    itemName: string;
    currentStock: number;
    unit: string;
}

const MessManagerStock: React.FC = () => {
    const [stocks, setStocks] = useState<StockItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [issuingId, setIssuingId] = useState<string | null>(null);
    const [issuedQty, setIssuedQty] = useState<number>(0);

    useEffect(() => {
        fetchStocks();
    }, []);

    const fetchStocks = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/admin/stock');
            if (response.data && response.data.data) {
                // Ensure the mapping matches what individual components expect
                const mappedData = response.data.data.map((item: any) => ({
                    id: item._id || item.id,
                    itemName: item.itemName,
                    currentStock: item.currentStock,
                    unit: item.unit
                }));
                setStocks(mappedData);
            }
        } catch (error) {
            console.error('Error fetching stocks:', error);
            toast.error('Failed to load stock data');
        } finally {
            setLoading(false);
        }
    };

    const handleIssueStock = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!issuingId || issuedQty <= 0) return;

        const item = stocks.find(s => s.id === issuingId);
        if (item && issuedQty > item.currentStock) {
            toast.error('Cannot issue more than available stock');
            return;
        }

        const loadingToast = toast.loading('Updating issued items...');
        try {
            await apiClient.patch('/mess/stock/issue', {
                itemId: issuingId,
                issuedQty: issuedQty
            });
            toast.success('Stock updated successfully', { id: loadingToast });
            setIssuingId(null);
            setIssuedQty(0);
            fetchStocks();
        } catch (error) {
            console.error('Error issuing stock:', error);
            toast.error('Failed to update stock', { id: loadingToast });
        }
    };

    const filteredStocks = stocks.filter(s =>
        s.itemName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="mms-container">
            <div className="mms-card">
                <div className="mms-card-header">
                    <div className="mms-header-text">
                        <h2 className="mms-card-title">Stock Issuance</h2>
                        <p className="mms-card-subtitle">Record item consumption for mess meals</p>
                    </div>
                    <div className="mms-search-box">
                        <Search size={18} className="mms-search-icon" />
                        <input
                            type="text"
                            placeholder="Find an item..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="mms-content">
                    {loading ? (
                        <div className="mms-loader-box">
                            <div className="mms-spinner"></div>
                            <p>Fetching inventory...</p>
                        </div>
                    ) : (
                        <div className="mms-stock-grid">
                            {filteredStocks.map((item) => (
                                <div key={item.id} className={`mms-stock-card ${issuingId === item.id ? 'active' : ''}`}>
                                    <div className="mms-stock-info">
                                        <div className="mms-stock-icon">
                                            <Package size={24} />
                                        </div>
                                        <div className="mms-stock-details">
                                            <h3 className="mms-item-name">{item.itemName}</h3>
                                            <p className="mms-item-available">
                                                Available: <span>{item.currentStock} {item.unit}</span>
                                            </p>
                                        </div>
                                    </div>

                                    {issuingId === item.id ? (
                                        <form onSubmit={handleIssueStock} className="mms-issue-form">
                                            <div className="mms-issue-input-group">
                                                <input
                                                    type="number"
                                                    autoFocus
                                                    placeholder="Qty"
                                                    value={issuedQty || ''}
                                                    onChange={(e) => setIssuedQty(Number(e.target.value))}
                                                    max={item.currentStock}
                                                    required
                                                />
                                                <span className="mms-unit-label">{item.unit}</span>
                                            </div>
                                            <div className="mms-issue-actions">
                                                <button type="button" onClick={() => setIssuingId(null)} className="mms-btn-cancel">Cancel</button>
                                                <button type="submit" className="mms-btn-confirm">Issue</button>
                                            </div>
                                        </form>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                setIssuingId(item.id);
                                                setIssuedQty(0);
                                            }}
                                            className="mms-btn-issue"
                                            disabled={item.currentStock <= 0}
                                        >
                                            <MinusCircle size={18} />
                                            <span>Issue Items</span>
                                        </button>
                                    )}

                                    {item.currentStock <= 3 && item.currentStock > 0 && (
                                        <div className="mms-low-stock-alert">
                                            <AlertCircle size={12} />
                                            <span>Low Stock Hint</span>
                                        </div>
                                    )}
                                    {item.currentStock === 0 && (
                                        <div className="mms-out-of-stock">
                                            <AlertCircle size={12} />
                                            <span>Out of Stock</span>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {filteredStocks.length === 0 && (
                                <div className="mms-empty-state">
                                    <p>No items found matching your search.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Tips */}
            <div className="mms-tips">
                <div className="mms-tip-item">
                    <CheckCircle2 size={16} className="mms-tip-icon" />
                    <span>Always update after every meal preparation</span>
                </div>
                <div className="mms-tip-item">
                    <CheckCircle2 size={16} className="mms-tip-icon" />
                    <span>Ensure quantities are accurate for inventory management</span>
                </div>
            </div>
        </div>
    );
};

export default MessManagerStock;
