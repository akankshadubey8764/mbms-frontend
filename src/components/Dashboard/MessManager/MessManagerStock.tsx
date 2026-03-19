import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import apiClient from '../../../api/apiClient';
import './MessManagerStock.css';

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

const MessManagerStock: React.FC = () => {
    const [stock, setStock] = useState<MonthlyStock | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    // For Adding Item
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newItem, setNewItem] = useState({
        itemName: '',
        seller: '',
        quantityBought: 0,
        unit: 'kg',
        pricePerKg: 0,
        photo: ''
    });

    // Check if it's the last day of the month
    const isLastDay = () => {
        const today = new Date();
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        return today.getDate() === lastDay;
    };

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
            const response = await apiClient.get('/monthly-stock', {
                params: { month: selectedMonth, year: selectedYear }
            });
            setStock(response.data);
        } catch (error) {
            console.error('Error fetching monthly stock:', error);
            toast.error('Failed to load inventory');
        } finally {
            setLoading(false);
        }
    };

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        const loadingToast = toast.loading('Adding item...');
        try {
            await apiClient.post('/monthly-stock/item', {
                month: selectedMonth,
                year: selectedYear,
                item: {
                    ...newItem,
                    totalPrice: newItem.quantityBought * newItem.pricePerKg
                }
            });
            toast.success('Item added successfully', { id: loadingToast });
            setIsAddModalOpen(false);
            setNewItem({ itemName: '', seller: '', quantityBought: 0, unit: 'kg', pricePerKg: 0, photo: '' });
            fetchMonthlyStock();
        } catch (error) {
            toast.error('Failed to add item', { id: loadingToast });
        }
    };

    const handleUpdateEndMonth = async (itemId: string, qtyRem: number, comms: string) => {
        const loadingToast = toast.loading('Updating record...');
        try {
            await apiClient.patch('/monthly-stock/item', {
                month: selectedMonth,
                year: selectedYear,
                itemId,
                quantityRemaining: qtyRem,
                comments: comms
            });
            toast.success('Record updated', { id: loadingToast });
            fetchMonthlyStock();
        } catch (error) {
            toast.error('Update failed', { id: loadingToast });
        }
    };

    const grandTotal = stock?.items?.reduce((sum, item) => sum + item.totalPrice, 0) || 0;

    return (
        <div className="mms-container">
            <div className="mms-card">
                <div className="mms-card-header">
                    <div>
                        <h2 className="mms-card-title">Inventory Management</h2>
                        <p className="mms-card-subtitle">Manage monthly grocery stock and expenses</p>
                    </div>

                    <div className="mms-header-actions">
                        <div className="mms-filters">
                            <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))}>
                                {months.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                            </select>
                            <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
                                {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                        <button onClick={() => setIsAddModalOpen(true)} className="mms-add-btn">
                            + Add Item
                        </button>
                    </div>
                </div>

                <div className="mms-table-wrapper">
                    <table className="mms-table">
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Item Name</th>
                                <th>Seller Place</th>
                                <th>Qty Bought</th>
                                <th>Photo</th>
                                <th>Price/Kg</th>
                                <th>Total Price</th>
                                <th>Qty Remaining</th>
                                <th>Comments</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={10} className="mms-loader-row">Loading...</td></tr>
                            ) : !stock?.items || stock.items.length === 0 ? (
                                <tr><td colSpan={10} className="mms-empty-row">No records for this month.</td></tr>
                            ) : (
                                stock.items.map((item, idx) => (
                                    <StockRow
                                        key={item._id}
                                        item={item}
                                        idx={idx}
                                        isLastDay={isLastDay()}
                                        onUpdate={handleUpdateEndMonth}
                                    />
                                ))
                            )}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan={6} className="text-right font-black">Grand Total:</td>
                                <td className="font-black text-emerald-600 text-lg">₹{grandTotal.toLocaleString()}</td>
                                <td colSpan={3}></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            {isAddModalOpen && (
                <div className="mms-modal-overlay">
                    <div className="mms-modal">
                        <h3>Add Stock Item (1st Day)</h3>
                        <form onSubmit={handleAddItem}>
                            <div className="mms-form-grid">
                                <div className="mms-form-group">
                                    <label>Item Name</label>
                                    <input required value={newItem.itemName} onChange={e => setNewItem({ ...newItem, itemName: e.target.value })} />
                                </div>
                                <div className="mms-form-group">
                                    <label>Seller Place</label>
                                    <input required value={newItem.seller} onChange={e => setNewItem({ ...newItem, seller: e.target.value })} />
                                </div>
                                <div className="mms-form-group">
                                    <label>Quantity Bought</label>
                                    <input type="number" required value={newItem.quantityBought} onChange={e => setNewItem({ ...newItem, quantityBought: Number(e.target.value) })} />
                                </div>
                                <div className="mms-form-group">
                                    <label>Unit</label>
                                    <select value={newItem.unit} onChange={e => setNewItem({ ...newItem, unit: e.target.value })}>
                                        <option value="kg">kg</option>
                                        <option value="liter">liter</option>
                                        <option value="packet">packet</option>
                                    </select>
                                </div>
                                <div className="mms-form-group">
                                    <label>Price per Unit</label>
                                    <input type="number" required value={newItem.pricePerKg} onChange={e => setNewItem({ ...newItem, pricePerKg: Number(e.target.value) })} />
                                </div>
                                <div className="mms-form-group">
                                    <label>Photo URL</label>
                                    <input value={newItem.photo} onChange={e => setNewItem({ ...newItem, photo: e.target.value })} />
                                </div>
                            </div>
                            <div className="mms-modal-actions">
                                <button type="button" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                                <button type="submit" className="mms-btn-submit">Add Item</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const StockRow: React.FC<{ item: MonthlyStockItem; idx: number; isLastDay: boolean; onUpdate: any }> = ({ item, idx, isLastDay, onUpdate }) => {
    const [qRem, setQRem] = useState(item.quantityRemaining || 0);
    const [comms, setComms] = useState(item.comments || '');

    return (
        <tr>
            <td className="text-center">{idx + 1}</td>
            <td className="font-bold">{item.itemName}</td>
            <td>{item.seller}</td>
            <td className="text-center">{item.quantityBought} {item.unit}</td>
            <td className="text-center">
                {item.photo ? <img src={item.photo} alt="item" className="mms-thumb" /> : '--'}
            </td>
            <td className="text-center">₹{item.pricePerKg}</td>
            <td className="text-center font-bold">₹{item.totalPrice}</td>
            <td className="text-center">
                <input
                    type="number"
                    value={qRem}
                    onChange={e => setQRem(Number(e.target.value))}
                    disabled={!isLastDay}
                    className="mms-inline-input"
                />
            </td>
            <td>
                <input
                    type="text"
                    value={comms}
                    onChange={e => setComms(e.target.value)}
                    disabled={!isLastDay}
                    className="mms-inline-input"
                    placeholder="Comments..."
                />
            </td>
            <td className="text-center">
                {isLastDay && (
                    <button onClick={() => onUpdate(item._id, qRem, comms)} className="mms-save-row-btn">Save</button>
                )}
            </td>
        </tr>
    );
};

export default MessManagerStock;
