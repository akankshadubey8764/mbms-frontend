import React, { useState, useEffect } from 'react';
import { Utensils, Coffee, Sun, Soup, Edit2, Save, X, CheckCircle2 } from 'lucide-react';
import apiClient from '../../../api/apiClient';
import toast from 'react-hot-toast';
import './AdminMessMenu.css';

interface MenuItem {
    day: string;
    mealTime: 'Breakfast' | 'Lunch' | 'Dinner';
    items: string[];
}

interface MenuData {
    week: string;
    menuItems: MenuItem[];
    updatedAt?: string;
}

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const mealTimes: ('Breakfast' | 'Lunch' | 'Dinner')[] = ['Breakfast', 'Lunch', 'Dinner'];

const AdminMessMenu: React.FC = () => {
    const [menu, setMenu] = useState<MenuData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<MenuData | null>(null);

    useEffect(() => {
        fetchMenu();
    }, []);

    const fetchMenu = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/mess/get_mess_menu');
            if (response.data && response.data.menuItems) {
                setMenu(response.data);
            } else {
                // Initialize default empty menu if none exists
                const defaultMenuItems: MenuItem[] = [];
                days.forEach(day => {
                    mealTimes.forEach(mealTime => {
                        defaultMenuItems.push({ day, mealTime, items: [] });
                    });
                });
                setMenu({ week: 'Current Week', menuItems: defaultMenuItems });
            }
        } catch (error) {
            console.error('Error fetching menu:', error);
            toast.error('Failed to fetch menu');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        setEditData(JSON.parse(JSON.stringify(menu)));
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditData(null);
    };

    const handleSave = async () => {
        if (!editData) return;
        const loadingToast = toast.loading('Saving menu...');
        try {
            await apiClient.put('/mess/update_mess_menu', {
                week: editData.week,
                menuItems: editData.menuItems
            });
            setMenu(editData);
            setIsEditing(false);
            toast.success('Mess menu updated successfully!', { id: loadingToast });
        } catch (error) {
            console.error('Error updating menu:', error);
            toast.error('Failed to update menu', { id: loadingToast });
        }
    };

    const handleItemChange = (day: string, mealTime: string, value: string) => {
        if (!editData) return;
        const newMenuItems = [...editData.menuItems];
        const itemIndex = newMenuItems.findIndex(m => m.day === day && m.mealTime === mealTime);

        if (itemIndex !== -1) {
            // Split by comma and trim
            newMenuItems[itemIndex].items = value.split(',').map(i => i.trim()).filter(i => i !== '');
        } else {
            newMenuItems.push({ day, mealTime: mealTime as any, items: value.split(',').map(i => i.trim()).filter(i => i !== '') });
        }

        setEditData({ ...editData, menuItems: newMenuItems });
    };

    const getDayMenu = (source: MenuData | null, day: string) => {
        const dayItems = source?.menuItems.filter(m => m.day === day) || [];
        return {
            breakfast: dayItems.find(m => m.mealTime === 'Breakfast')?.items.join(', ') || '',
            lunch: dayItems.find(m => m.mealTime === 'Lunch')?.items.join(', ') || '',
            dinner: dayItems.find(m => m.mealTime === 'Dinner')?.items.join(', ') || '',
        };
    };

    if (loading) {
        return (
            <div className="amm-loader-container">
                <div className="amm-loader"></div>
                <p>Loading Mess Menu...</p>
            </div>
        );
    }

    return (
        <div className="amm-container">
            <div className="amm-header">
                {/* <div className="amm-header-info">
                    <h1 className="amm-title">Mess Menu Management</h1>
                    <p className="amm-subtitle">Edit and manage the weekly meal schedule for students</p>
                </div> */}
                {!isEditing ? (
                    <button onClick={handleEdit} className="amm-btn amm-btn-primary">
                        <Edit2 size={18} />
                        <span>Edit Menu</span>
                    </button>
                ) : (
                    <div className="amm-header-actions">
                        <button onClick={handleCancel} className="amm-btn amm-btn-secondary">
                            <X size={18} />
                            <span>Cancel</span>
                        </button>
                        <button onClick={handleSave} className="amm-btn amm-btn-save">
                            <Save size={18} />
                            <span>Save Changes</span>
                        </button>
                    </div>
                )}
            </div>

            <div className="amm-card">
                <div className="amm-card-header">
                    <div className="amm-label-group">
                        <Utensils className="amm-label-icon" />
                        <span className="amm-label-text">Weekly Schedule</span>
                    </div>
                    {isEditing ? (
                        <div className="amm-week-input-wrapper">
                            <label>Week Name:</label>
                            <input
                                type="text"
                                value={editData?.week || ''}
                                onChange={(e) => setEditData(prev => prev ? { ...prev, week: e.target.value } : null)}
                                placeholder="e.g., Week 3, March 2024"
                                className="amm-week-input"
                            />
                        </div>
                    ) : (
                        <span className="amm-status-badge">
                            Last Updated: {menu?.updatedAt ? new Date(menu.updatedAt).toLocaleString('en-IN', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true
                            }).replace(',', '') : 'Never'}
                        </span>
                    )}
                </div>

                <div className="amm-table-wrapper">
                    <table className="amm-table">
                        <thead>
                            <tr>
                                <th className="amm-th">Day</th>
                                <th className="amm-th">
                                    <div className="amm-th-content"><Coffee size={16} /> <span>Breakfast</span></div>
                                </th>
                                <th className="amm-th">
                                    <div className="amm-th-content"><Sun size={16} /> <span>Lunch</span></div>
                                </th>
                                <th className="amm-th">
                                    <div className="amm-th-content"><Soup size={16} /> <span>Dinner</span></div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="amm-tbody">
                            {days.map((day) => {
                                const currentDayMenu = getDayMenu(isEditing ? editData : menu, day);
                                return (
                                    <tr key={day} className="amm-tr">
                                        <td className="amm-td amm-day-cell">
                                            {day}
                                        </td>
                                        <td className="amm-td">
                                            {isEditing ? (
                                                <textarea
                                                    className="amm-textarea"
                                                    value={currentDayMenu.breakfast}
                                                    onChange={(e) => handleItemChange(day, 'Breakfast', e.target.value)}
                                                    placeholder="e.g. Dosa, Tea, Milk"
                                                />
                                            ) : (
                                                <span className="amm-menu-text">{currentDayMenu.breakfast || '---'}</span>
                                            )}
                                        </td>
                                        <td className="amm-td">
                                            {isEditing ? (
                                                <textarea
                                                    className="amm-textarea"
                                                    value={currentDayMenu.lunch}
                                                    onChange={(e) => handleItemChange(day, 'Lunch', e.target.value)}
                                                    placeholder="e.g. Rice, Dal, Veggie Curry"
                                                />
                                            ) : (
                                                <span className="amm-menu-text">{currentDayMenu.lunch || '---'}</span>
                                            )}
                                        </td>
                                        <td className="amm-td">
                                            {isEditing ? (
                                                <textarea
                                                    className="amm-textarea"
                                                    value={currentDayMenu.dinner}
                                                    onChange={(e) => handleItemChange(day, 'Dinner', e.target.value)}
                                                    placeholder="e.g. Chapati, Paneer, Curd"
                                                />
                                            ) : (
                                                <span className="amm-menu-text">{currentDayMenu.dinner || '---'}</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {isEditing && (
                <div className="amm-info-note">
                    <CheckCircle2 size={16} />
                    <span>Tip: Use commas to separate multiple items for each meal.</span>
                </div>
            )}
        </div>
    );
};

export default AdminMessMenu;
