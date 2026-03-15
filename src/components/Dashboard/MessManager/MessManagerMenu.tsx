import React, { useState, useEffect } from 'react';
import { Calendar, Edit2, Save, X, Utensils } from 'lucide-react';
import apiClient from '../../../api/apiClient';
import toast from 'react-hot-toast';
import '../Admin/AdminMessMenu.css'; // Reusing admin styles

interface MenuItem {
    breakfast: string;
    lunch: string;
    dinner: string;
}

interface WeeklyMenu {
    [key: string]: MenuItem;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const MessManagerMenu: React.FC = () => {
    const [menu, setMenu] = useState<WeeklyMenu>({});
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [editMenu, setEditMenu] = useState<WeeklyMenu>({});

    useEffect(() => {
        fetchMenu();
    }, []);

    const fetchMenu = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/mess/get_mess_menu');
            if (response.data && response.data.menuItems) {
                setMenu(response.data.menuItems);
            } else {
                // Initialize empty menu if none exists
                const initialMenu: WeeklyMenu = {};
                DAYS.forEach(day => {
                    initialMenu[day] = { breakfast: '', lunch: '', dinner: '' };
                });
                setMenu(initialMenu);
            }
        } catch (error) {
            console.error('Error fetching menu:', error);
            toast.error('Failed to load mess menu');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        setEditMenu(JSON.parse(JSON.stringify(menu)));
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleSave = async () => {
        const loadingToast = toast.loading('Updating mess menu...');
        try {
            await apiClient.put('/mess/update_mess_menu', {
                week: 'current',
                menuItems: editMenu
            });
            setMenu(editMenu);
            setIsEditing(false);
            toast.success('Mess menu updated successfully', { id: loadingToast });
        } catch (error) {
            console.error('Error updating menu:', error);
            toast.error('Failed to update menu', { id: loadingToast });
        }
    };

    const handleInputChange = (day: string, meal: keyof MenuItem, value: string) => {
        setEditMenu(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                [meal]: value
            }
        }));
    };

    if (loading) {
        return (
            <div className="amm-container">
                <div className="amm-loader">Loading menu...</div>
            </div>
        );
    }

    return (
        <div className="amm-container">
            <div className="amm-header">
                <div>
                </div>
                {!isEditing ? (
                    <button onClick={handleEdit} className="amm-btn amm-btn-primary">
                        <Edit2 size={18} />
                        <span>Edit Menu Schedule</span>
                    </button>
                ) : (
                    <div className="amm-header-actions">
                        <button onClick={handleCancel} className="amm-btn amm-btn-secondary">
                            <X size={18} />
                            <span>Cancel</span>
                        </button>
                        <button onClick={handleSave} className="amm-btn amm-btn-success">
                            <Save size={18} />
                            <span>Save Changes</span>
                        </button>
                    </div>
                )}
            </div>

            <div className="amm-grid">
                {DAYS.map((day) => (
                    <div key={day} className="amm-day-card">
                        <div className="amm-day-header">
                            <Calendar size={18} />
                            <h3>{day}</h3>
                        </div>
                        <div className="amm-meals">
                            <MealSection
                                day={day}
                                meal="breakfast"
                                label="Breakfast"
                                value={isEditing ? editMenu[day]?.breakfast : menu[day]?.breakfast}
                                isEditing={isEditing}
                                onChange={handleInputChange}
                            />
                            <MealSection
                                day={day}
                                meal="lunch"
                                label="Lunch"
                                value={isEditing ? editMenu[day]?.lunch : menu[day]?.lunch}
                                isEditing={isEditing}
                                onChange={handleInputChange}
                            />
                            <MealSection
                                day={day}
                                meal="dinner"
                                label="Dinner"
                                value={isEditing ? editMenu[day]?.dinner : menu[day]?.dinner}
                                isEditing={isEditing}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

interface MealSectionProps {
    day: string;
    meal: keyof MenuItem;
    label: string;
    value: string;
    isEditing: boolean;
    onChange: (day: string, meal: keyof MenuItem, value: string) => void;
}

const MealSection: React.FC<MealSectionProps> = ({ day, meal, label, value, isEditing, onChange }) => {
    return (
        <div className="amm-meal-section">
            <div className="amm-meal-label">
                <Utensils size={14} />
                <span>{label}</span>
            </div>
            {isEditing ? (
                <textarea
                    className="amm-meal-input"
                    value={value || ''}
                    onChange={(e) => onChange(day, meal, e.target.value)}
                    placeholder={`Enter ${label.toLowerCase()} items...`}
                />
            ) : (
                <div className="amm-meal-content">
                    {value ? (
                        <div className="amm-tags">
                            {value.split(',').map((item, idx) => (
                                <span key={idx} className="amm-tag">{item.trim()}</span>
                            ))}
                        </div>
                    ) : (
                        <span className="amm-empty">No menu set</span>
                    )}
                </div>
            )}
        </div>
    );
};

export default MessManagerMenu;
