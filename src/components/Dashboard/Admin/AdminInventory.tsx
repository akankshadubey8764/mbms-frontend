import React, { useState, useEffect } from 'react';
import { User, Calendar } from 'lucide-react';
import apiClient from '../../../api/apiClient';
import toast from 'react-hot-toast';
import './AdminInventory.css';

interface MonthlyStockItem {
    _id: string;
    itemName: string;
    seller: string;
    quantityBought: number;
    unit: string;
    photo?: string;
    pricePerKg: number;
    totalPrice: number;
    quantityRemaining?: number;
    comments?: string;
}

interface MonthlyStock {
    _id: string;
    month: number;
    year: number;
    items: MonthlyStockItem[];
}

const AdminInventory: React.FC = () => {
    const [stock, setStock] = useState<MonthlyStock | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    useEffect(() => {
        fetchMonthlyStock();
    }, [selectedMonth, selectedYear]);

    const fetchMonthlyStock = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/mess/monthly-stock', {
                params: { month: selectedMonth, year: selectedYear }
            });
            setStock(response.data);
        } catch (error) {
            console.error('Error fetching monthly stock:', error);
            toast.error('Failed to load inventory data');
        } finally {
            setLoading(false);
        }
    };

    const grandTotal = stock?.items?.reduce((sum, item) => sum + item.totalPrice, 0) || 0;

    return (
        <div className="ai-container animate-fade-in">
            {/* View Header with Filters */}
            <div className="ai-view-header">
                {/* <div>
                    <h2 className="ai-title">Inventory Dashboard</h2>
                    <p className="ai-subtitle">Track monthly grocery purchases and stock levels</p>
                </div> */}

                <div className="ai-filters">
                    <div className="ai-select-group">
                        <Calendar size={18} />
                        <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))}>
                            {months.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                        </select>
                    </div>
                    <div className="ai-select-group">
                        <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
                            {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* Inventory Table */}
            <div className="ai-content-card">
                <div className="ai-table-wrapper">
                    <table className="ai-table">
                        <thead>
                            <tr>
                                <th className="ai-th">S.No</th>
                                <th className="ai-th">Item Name</th>
                                <th className="ai-th">Seller Place</th>
                                <th className="ai-th center">Qty Bought</th>
                                <th className="ai-th center">Photo</th>
                                <th className="ai-th center">Price/Kg</th>
                                <th className="ai-th center">Total Price</th>
                                <th className="ai-th center">Qty Remaining</th>
                                <th className="ai-th">Comments</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={9} className="ai-loader-row"><div className="ai-spinner"></div></td></tr>
                            ) : !stock?.items || stock.items.length === 0 ? (
                                <tr><td colSpan={9} className="ai-empty-row">No records found for this month.</td></tr>
                            ) : (
                                stock.items.map((item, idx) => (
                                    <tr key={item._id}>
                                        <td className="ai-td center">{idx + 1}</td>
                                        <td className="ai-td font-bold">{item.itemName}</td>
                                        <td className="ai-td">
                                            <div className="ai-seller-info">
                                                <User size={14} className="ai-seller-icon" />
                                                <span>{item.seller}</span>
                                            </div>
                                        </td>
                                        <td className="ai-td center">{item.quantityBought} {item.unit}</td>
                                        <td className="ai-td center">
                                            {item.photo ? (
                                                <img src={item.photo} alt={item.itemName} className="ai-item-thumb" />
                                            ) : (
                                                <div className="ai-no-photo">No Photo</div>
                                            )}
                                        </td>
                                        <td className="ai-td center">₹{item.pricePerKg}</td>
                                        <td className="ai-td center font-bold">₹{item.totalPrice}</td>
                                        <td className="ai-td center">{item.quantityRemaining ?? '---'}</td>
                                        <td className="ai-td italic text-slate-500">{item.comments || '---'}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan={6} className="ai-td text-right font-black uppercase text-slate-500 text-xs">Grand Total:</td>
                                <td className="ai-td center font-black text-lg text-emerald-600">₹{grandTotal.toLocaleString()}</td>
                                <td colSpan={2}></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
};


export default AdminInventory;
