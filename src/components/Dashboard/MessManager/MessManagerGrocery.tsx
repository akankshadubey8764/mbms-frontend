import React, { useState } from 'react';
import { Plus, Trash2, Calendar, ShoppingCart, User, DollarSign, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '../../../api/apiClient';
import './MessManagerGrocery.css';

interface GroceryRow {
    id: string;
    seller: string;
    itemName: string;
    quantity: number;
    unit: string;
    rate: number;
    totalPrice: number;
    purchasedDate: string;
}

const MessManagerGrocery: React.FC = () => {
    const [rows, setRows] = useState<GroceryRow[]>([
        { id: Math.random().toString(36).substr(2, 9), seller: '', itemName: '', quantity: 0, unit: 'kg', rate: 0, totalPrice: 0, purchasedDate: new Date().toISOString().split('T')[0] }
    ]);
    const [isSaving, setIsSaving] = useState(false);

    const addRow = () => {
        setRows([...rows, { id: Math.random().toString(36).substr(2, 9), seller: '', itemName: '', quantity: 0, unit: 'kg', rate: 0, totalPrice: 0, purchasedDate: new Date().toISOString().split('T')[0] }]);
    };

    const removeRow = (id: string) => {
        if (rows.length > 1) {
            setRows(rows.filter(r => r.id !== id));
        } else {
            toast.error('At least one item is required');
        }
    };

    const updateRow = (id: string, field: keyof GroceryRow, value: any) => {
        setRows(rows.map(r => {
            if (r.id === id) {
                const updatedRow = { ...r, [field]: value };
                if (field === 'quantity' || field === 'rate') {
                    updatedRow.totalPrice = Number((updatedRow.quantity * updatedRow.rate).toFixed(2));
                }
                return updatedRow;
            }
            return r;
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        const invalidRow = rows.find(r => !r.itemName || !r.seller || r.quantity <= 0 || r.rate <= 0);
        if (invalidRow) {
            toast.error('Please fill all required fields correctly');
            return;
        }

        setIsSaving(true);
        const loadingToast = toast.loading('Saving grocery bills...');

        try {
            // We'll send items one by one or create a bulk endpoint if available.
            // For now, let's use the individual add_grocery_purchase
            await Promise.all(rows.map(row =>
                apiClient.post('/mess/add_grocery_purchase', {
                    itemName: row.itemName,
                    quantity: row.quantity,
                    rate: row.rate,
                    seller: row.seller,
                    unit: row.unit,
                    date: row.purchasedDate
                })
            ));

            toast.success('All grocery bills updated successfully', { id: loadingToast });
            // Reset to one empty row
            setRows([{ id: Math.random().toString(36).substr(2, 9), seller: '', itemName: '', quantity: 0, unit: 'kg', rate: 0, totalPrice: 0, purchasedDate: new Date().toISOString().split('T')[0] }]);
        } catch (error) {
            console.error('Error saving groceries:', error);
            toast.error('Failed to save some items', { id: loadingToast });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="mmg-container">
            <div className="mmg-card">
                <div className="mmg-card-header">
                    <div className="mmg-header-text">
                        <h2 className="mmg-card-title">Update Grocery Bills</h2>
                        <p className="mmg-card-subtitle">Add new inventory items and their purchase details</p>
                    </div>
                    <button type="button" onClick={addRow} className="mmg-btn-secondary">
                        <Plus size={18} />
                        <span>Add New Item Row</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mmg-form">
                    <div className="mmg-table-container">
                        <table className="mmg-table">
                            <thead>
                                <tr>
                                    <th>Seller Details</th>
                                    <th>Item Details</th>
                                    <th>Qty & Unit</th>
                                    <th>Rate (₹)</th>
                                    <th>Total (₹)</th>
                                    <th>Date</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row) => (
                                    <tr key={row.id} className="mmg-row">
                                        <td>
                                            <div className="mmg-input-wrapper">
                                                <User size={14} className="mmg-input-icon" />
                                                <input
                                                    type="text"
                                                    placeholder="Seller Name"
                                                    value={row.seller}
                                                    onChange={(e) => updateRow(row.id, 'seller', e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="mmg-input-wrapper">
                                                <ShoppingCart size={14} className="mmg-input-icon" />
                                                <input
                                                    type="text"
                                                    placeholder="Item Name"
                                                    value={row.itemName}
                                                    onChange={(e) => updateRow(row.id, 'itemName', e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="mmg-qty-group">
                                                <input
                                                    type="number"
                                                    className="mmg-qty-input"
                                                    placeholder="Qty"
                                                    value={row.quantity || ''}
                                                    onChange={(e) => updateRow(row.id, 'quantity', Number(e.target.value))}
                                                    required
                                                />
                                                <select
                                                    value={row.unit}
                                                    onChange={(e) => updateRow(row.id, 'unit', e.target.value)}
                                                >
                                                    <option value="kg">kg</option>
                                                    <option value="liter">liter</option>
                                                    <option value="packet">packet</option>
                                                    <option value="unit">unit</option>
                                                </select>
                                            </div>
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                className="mmg-narrow-input"
                                                placeholder="Rate"
                                                value={row.rate || ''}
                                                onChange={(e) => updateRow(row.id, 'rate', Number(e.target.value))}
                                                required
                                            />
                                        </td>
                                        <td>
                                            <div className="mmg-total-cell">
                                                <DollarSign size={14} />
                                                <span className="mmg-total-val">{row.totalPrice}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="mmg-date-wrapper">
                                                <Calendar size={14} className="mmg-input-icon" />
                                                <input
                                                    type="date"
                                                    value={row.purchasedDate}
                                                    onChange={(e) => updateRow(row.id, 'purchasedDate', e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </td>
                                        <td>
                                            <button
                                                type="button"
                                                onClick={() => removeRow(row.id)}
                                                className="mmg-remove-btn"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mmg-form-footer">
                        <div className="mmg-summary-total">
                            <span className="mmg-sum-label">Grand Total:</span>
                            <span className="mmg-sum-value">₹ {rows.reduce((sum, r) => sum + r.totalPrice, 0).toFixed(2)}</span>
                        </div>
                        <button type="submit" disabled={isSaving} className="mmg-btn-primary">
                            <Save size={18} />
                            <span>{isSaving ? 'Updating...' : 'Update Grocery Bill'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MessManagerGrocery;
