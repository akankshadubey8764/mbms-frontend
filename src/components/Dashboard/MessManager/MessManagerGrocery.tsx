import React, { useState, useEffect } from 'react';
import { Calendar, Plus, ShoppingCart, Info, Save, X, Edit2, Upload, FileImage } from 'lucide-react';
import apiClient from '../../../api/apiClient';
import toast from 'react-hot-toast';
import '../Admin/AdminInventory.css';

interface MonthlyStockItem {
    _id?: string;
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

const MessManagerGrocery: React.FC = () => {
    const [stock, setStock] = useState<MonthlyStock | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    // Add Item Modal/Form State
    const [isAddingItem, setIsAddingItem] = useState(false);
    const [newItem, setNewItem] = useState<Partial<MonthlyStockItem>>({
        itemName: '', seller: '', quantityBought: 0, unit: 'kg', pricePerKg: 0, photo: ''
    });
    const [isSaving, setIsSaving] = useState(false);

    // Edit Rows State
    const [editRows, setEditRows] = useState<{ [key: string]: { quantityRemaining: number, comments: string } }>({});

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Date Logic
    const today = new Date();
    const currentDayOfMonth = today.getDate();
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const canAddGrocery = currentDayOfMonth === 1 || currentDayOfMonth === 2;
    const canUpdateRemaining = currentDayOfMonth === lastDayOfMonth;

    useEffect(() => {
        fetchMonthlyStock();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedMonth, selectedYear]);

    const fetchMonthlyStock = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/mess/monthly-stock', {
                params: { month: selectedMonth, year: selectedYear }
            });
            setStock(response.data);
            setEditRows({});
        } catch (error) {
            console.error('Error fetching monthly stock:', error);
            toast.error('Failed to load inventory data');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
                toast.error('Only JPG and PNG images are allowed');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewItem({ ...newItem, photo: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!canAddGrocery) {
            toast.error('Grocery invoices can only be added on the 1st or 2nd day of the month.');
            return;
        }

        const missing = [];
        if (!newItem.itemName) missing.push('Item Name');
        if (!newItem.seller) missing.push('Vendor');
        if (!newItem.quantityBought) missing.push('Quantity');
        if (!newItem.pricePerKg) missing.push('Price');
        if (!newItem.photo) missing.push('Photo');

        if (missing.length > 0) {
            toast.error(`Please fill: ${missing.join(', ')}`);
            return;
        }

        const qBought = newItem.quantityBought as number;
        const pPerKg = newItem.pricePerKg as number;
        const totalPrice = Number((qBought * pPerKg).toFixed(2));
        const itemToSubmit = { ...newItem, totalPrice } as MonthlyStockItem;

        setIsSaving(true);
        const loadingToast = toast.loading('Adding grocery item...');

        try {
            const payload = {
                month: selectedMonth,
                year: selectedYear,
                item: itemToSubmit
            };
            console.log('Sending POST to /monthly-stock/item:', payload);
            await apiClient.post('/mess/monthly-stock/item', payload);
            toast.success('Grocery item added successfully', { id: loadingToast });
            setIsAddingItem(false);
            setNewItem({ itemName: '', seller: '', quantityBought: 0, unit: 'kg', pricePerKg: 0, photo: '' });
            fetchMonthlyStock();
        } catch (error: any) {
            console.error('Error saving grocery:', error);
            toast.error(error.response?.data?.message || 'Failed to add item', { id: loadingToast });
        } finally {
            setIsSaving(false);
        }
    };

    const handleRowEditChange = (id: string, field: 'quantityRemaining' | 'comments', value: any) => {
        setEditRows(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value,
                // Ensure defaults if first edit
                quantityRemaining: field === 'quantityRemaining' ? value : (prev[id]?.quantityRemaining ?? stock?.items.find(i => i._id === id)?.quantityRemaining ?? 0),
                comments: field === 'comments' ? value : (prev[id]?.comments ?? stock?.items.find(i => i._id === id)?.comments ?? '')
            }
        }));
    };

    const cancelRowEdit = (id: string) => {
        const updatedRows = { ...editRows };
        delete updatedRows[id];
        setEditRows(updatedRows);
    };

    const saveEndOfMonthClosing = async (itemId: string) => {
        if (!canUpdateRemaining) {
            toast.error('Remaining quantity can only be updated on the last day of the month.');
            return;
        }

        const rowData = editRows[itemId];
        if (!rowData || rowData.quantityRemaining === undefined) {
            toast.error('No changes to save for this row');
            return;
        }

        const loadingToast = toast.loading('Updating end of month stock...');
        try {
            const payload = {
                month: selectedMonth,
                year: selectedYear,
                itemId,
                quantityRemaining: rowData.quantityRemaining,
                comments: rowData.comments
            };
            console.log('Sending PATCH to /monthly-stock/item:', payload);
            await apiClient.patch('/mess/monthly-stock/item', payload);
            toast.success('Stock updated!', { id: loadingToast });
            // Remove from edit mode
            cancelRowEdit(itemId);
            fetchMonthlyStock();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update stock', { id: loadingToast });
        }
    };

    const grandTotal = stock?.items?.reduce((sum, item) => sum + item.totalPrice, 0) || 0;

    return (
        <div className="ai-container animate-fade-in">
            {/* View Header with Filters */}
            <div className="ai-view-header">
                <div className="ai-filters">
                    <div className="ai-select-group">
                        <Calendar size={18} />
                        <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))}>
                            {months.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                        </select>
                    </div>
                    <div className="ai-select-group">
                        <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
                            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {!isAddingItem ? (
                    <button
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs capitalize tracking-wider transition-colors ${canAddGrocery ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md' : 'bg-slate-200 text-slate-500 cursor-not-allowed'}`}
                        onClick={() => canAddGrocery ? setIsAddingItem(true) : toast.error('Check again on the 1st/2nd of the month')}
                        disabled={!canAddGrocery}
                        data-tooltip-bottom={canAddGrocery ? "Click to add a new grocery bill" : "Grocery bills can only be added on 1st & 2nd of the month"}
                    >
                        <Plus size={16} /> Add Grocery Bill
                    </button>
                ) : (
                    <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors"
                        onClick={() => setIsAddingItem(false)}>
                        <X size={16} /> Cancel Add
                    </button>
                )}
            </div>

            {/* Add Item Form */}
            {isAddingItem && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex-shrink-0 animate-slide-down">
                    <div className="flex items-center gap-2 mb-4">
                        <ShoppingCart size={20} className="text-blue-600" />
                        <h3 className="font-black text-slate-800 tracking-tight">Add New Grocery Invoice (Available on 1st & 2nd)</h3>
                    </div>
                    <form onSubmit={handleAddItem} className="grid grid-cols-1 md:grid-cols-10 gap-4 items-end">
                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-bold text-slate-500 capitalize tracking-wider mb-1">Item Name</label>
                            <input type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" placeholder="e.g. Rice, Dal"
                                value={newItem.itemName} onChange={e => setNewItem({ ...newItem, itemName: e.target.value })} required />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-bold text-slate-500 capitalize tracking-wider mb-1">Vendor/Seller</label>
                            <input type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" placeholder="e.g. ABC Wholesalers"
                                value={newItem.seller} onChange={e => setNewItem({ ...newItem, seller: e.target.value })} required />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-bold text-slate-500 capitalize tracking-wider mb-1">Qty Bought</label>
                            <div className="flex">
                                <input type="number" className="w-2/3 px-3 py-2 border border-slate-200 rounded-l-lg text-sm" placeholder="0"
                                    value={newItem.quantityBought || ''} onChange={e => setNewItem({ ...newItem, quantityBought: Number(e.target.value) })} required />
                                <select className="w-1/3 px-2 py-2 border border-l-0 border-slate-200 rounded-r-lg text-sm bg-slate-50"
                                    value={newItem.unit} onChange={e => setNewItem({ ...newItem, unit: e.target.value })}>
                                    <option value="kg">kg</option>
                                    <option value="l">l</option>
                                    <option value="pkt">pkt</option>
                                    <option value="unit">unit</option>
                                </select>
                            </div>
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-[10px] font-bold text-slate-500 capitalize tracking-wider mb-1">Price/Unit</label>
                            <input type="number" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" placeholder="0"
                                value={newItem.pricePerKg || ''} onChange={e => setNewItem({ ...newItem, pricePerKg: Number(e.target.value) })} required />
                        </div>

                        <div className="md:col-span-2 relative">
                            <label className="block text-[10px] font-bold text-slate-500 capitalize tracking-wider mb-1">Upload Photo (PNG/JPG)</label>
                            <div className="relative cursor-pointer">
                                <input
                                    type="file"
                                    accept=".jpg,.jpeg,.png"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    onChange={handleFileChange}
                                    required
                                />
                                <div className="flex items-center gap-2 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-600">
                                    <Upload size={16} />
                                    <span className="truncate">{newItem.photo ? 'Image Selected' : 'Choose File'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-1 flex justify-center pb-1">
                            {newItem.photo ? (
                                <img src={newItem.photo} className="h-8 w-12 object-cover rounded border border-slate-200 shadow-sm" alt="Preview" />
                            ) : (
                                <div className="h-8 w-12 bg-slate-100 rounded border border-dashed border-slate-300 flex items-center justify-center text-[10px] text-slate-400">
                                    <FileImage size={14} />
                                </div>
                            )}
                        </div>

                        <div className="md:col-span-10 flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100 mt-2">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-slate-400 capitalize tracking-wider">Total Calculated Price</span>
                                <span className="font-black text-blue-600 text-lg">₹ {((newItem.quantityBought || 0) * (newItem.pricePerKg || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                            <button type="submit" disabled={isSaving || !canAddGrocery} className={`px-6 py-2 rounded-lg font-bold text-sm tracking-wide transition-colors flex items-center gap-2 ${canAddGrocery ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md' : 'bg-slate-300 text-slate-500 cursor-not-allowed'}`}>
                                {isSaving ? 'Saving...' : <><Save size={16} /> Save Invoice</>}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Inventory Table */}
            <div className="ai-content-card flex-1 min-h-0 flex flex-col pt-0 shadow-lg">
                <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-500 flex items-center gap-2">
                        <Info size={14} className="text-blue-500" />
                        Status: {canUpdateRemaining ? <span className="text-emerald-600">End of Month reached! Updating enabled.</span> : <span className="text-amber-600 italic">Editing enabled on last day of month only.</span>}
                    </p>
                </div>
                <div className="ai-table-wrapper flex-1">
                    <table className="ai-table">
                        <thead>
                            <tr>
                                <th className="ai-th w-10 center">S.No.</th>
                                <th className="ai-th">Item Name</th>
                                <th className="ai-th center">Photo</th>
                                <th className="ai-th">Vendor</th>
                                <th className="ai-th center">Total In</th>
                                <th className="ai-th center">Rate</th>
                                <th className="ai-th center bg-blue-50">Remaining Qty <br /><span className="text-[9px] font-normal text-slate-400 lowercase">(Closing)</span></th>
                                <th className="ai-th w-2/12">Closing Comments</th>
                                <th className="ai-th center">Total Cost</th>
                                <th className="ai-th center w-20">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={10} className="ai-loader-row"><div className="ai-spinner"></div></td></tr>
                            ) : !stock?.items || stock.items.length === 0 ? (
                                <tr><td colSpan={10} className="ai-empty-row">No invoices recorded for {months[selectedMonth - 1]} {selectedYear}.</td></tr>
                            ) : (
                                stock.items.map((item, idx) => {
                                    const isEditingThisRow = editRows[item._id as string] !== undefined;
                                    return (
                                        <tr key={item._id} className={isEditingThisRow ? 'bg-blue-50' : ''}>
                                            <td className="ai-td center">{idx + 1}</td>
                                            <td className="ai-td font-bold">{item.itemName}</td>
                                            <td className="ai-td center">
                                                {item.photo ? (
                                                    <img src={item.photo} alt={item.itemName} className="ai-item-thumb shadow-sm" />
                                                ) : (
                                                    <div className="ai-no-photo">No Photo</div>
                                                )}
                                            </td>
                                            <td className="ai-td">
                                                {item.seller}
                                            </td>
                                            <td className="ai-td center font-bold text-slate-700">{item.quantityBought} <span className="text-[10px] font-medium text-slate-400 lowercase">{item.unit}</span></td>
                                            <td className="ai-td center">₹{item.pricePerKg}</td>

                                            {/* Editable Columns */}
                                            <td className="ai-td center bg-blue-50/20">
                                                {isEditingThisRow ? (
                                                    <input type="number"
                                                        className="w-20 px-2 py-1 border border-blue-400 rounded text-center text-sm font-bold shadow-inner outline-none focus:ring-2 focus:ring-blue-200"
                                                        value={editRows[item._id as string].quantityRemaining}
                                                        onChange={(e) => handleRowEditChange(item._id as string, 'quantityRemaining', Number(e.target.value))}
                                                    />
                                                ) : (
                                                    <span className={`${item.quantityRemaining !== undefined ? 'font-bold text-slate-700' : 'text-slate-400 italic'}`}>
                                                        {item.quantityRemaining !== undefined ? `${item.quantityRemaining} ${item.unit}` : '---'}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="ai-td">
                                                {isEditingThisRow ? (
                                                    <input type="text"
                                                        className="w-full px-2 py-1 border border-blue-400 rounded text-sm italic shadow-inner outline-none focus:ring-2 focus:ring-blue-200"
                                                        placeholder="Remarks..."
                                                        value={editRows[item._id as string].comments}
                                                        onChange={(e) => handleRowEditChange(item._id as string, 'comments', e.target.value)}
                                                    />
                                                ) : (
                                                    <span className={`text-xs ${item.comments ? 'text-slate-600' : 'text-slate-400 italic font-light'}`}>
                                                        {item.comments || 'No remarks'}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="ai-td center font-black text-slate-700 bg-slate-50/50">₹{item.totalPrice.toLocaleString()}</td>
                                            <td className="ai-td center">
                                                {isEditingThisRow ? (
                                                    <div className="flex gap-2 justify-center">
                                                        <button onClick={() => saveEndOfMonthClosing(item._id as string)} className="p-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md shadow-sm transition-colors" title="Save">
                                                            <Save size={14} />
                                                        </button>
                                                        <button onClick={() => cancelRowEdit(item._id as string)} className="p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md shadow-sm transition-colors" title="Cancel">
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => {
                                                            if (canUpdateRemaining) {
                                                                handleRowEditChange(item._id as string, 'quantityRemaining', item.quantityRemaining ?? 0);
                                                            } else {
                                                                toast.error('Available on last day of month only!');
                                                            }
                                                        }}
                                                        className={`p-1.5 rounded-md transition-all ${canUpdateRemaining ? 'bg-blue-100 hover:bg-blue-200 text-blue-700 shadow-sm' : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}
                                                        data-tooltip={canUpdateRemaining ? "Edit End-of-Month closing stock" : `Editing only available on the last day of month (${lastDayOfMonth})`}
                                                        disabled={!canUpdateRemaining}
                                                    >
                                                        <Edit2 size={14} />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan={8} className="text-right font-black capitalize text-slate-400 text-[10px] tracking-wider sticky bottom-0 bg-white border-t border-slate-200 h-12 pr-6">Monthly Expenditure:</td>
                                <td className="center font-black text-lg text-rose-600 sticky bottom-0 bg-white border-t border-slate-200 h-12 whitespace-nowrap">₹ {grandTotal.toLocaleString()}</td>
                                <td className="sticky bottom-0 bg-white border-t border-slate-200 h-12"></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MessManagerGrocery;
