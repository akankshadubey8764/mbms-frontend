import React, { useState, useEffect } from 'react';
import { Coffee, Sun, Moon, Calendar, Clock } from 'lucide-react';
import apiClient from '../../../api/apiClient';
import './StudentMessMenu.css';

interface MenuItem {
    day: string;
    breakfast: string;
    lunch: string;
    dinner: string;
}

const StudentMessMenu: React.FC = () => {
    const [menu, setMenu] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const response = await apiClient.get('/mess/get_mess_menu');
                // The backend returns an object with days as keys or similar.
                // Looking at messOpsController, it seems to store a weekly menu.
                // If it returns { menuItems: { Monday: {...}, ... } }
                if (response.data && response.data.menuItems) {
                    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                    const menuItems = response.data.menuItems;
                    
                    const formattedMenu = days.map(day => {
                        const dayMeals = menuItems.filter((item: any) => item.day === day);
                        return {
                            day,
                            breakfast: dayMeals.find((m: any) => m.mealTime === 'Breakfast')?.items.join(', ') || 'Not Set',
                            lunch: dayMeals.find((m: any) => m.mealTime === 'Lunch')?.items.join(', ') || 'Not Set',
                            dinner: dayMeals.find((m: any) => m.mealTime === 'Dinner')?.items.join(', ') || 'Not Set'
                        };
                    });
                    setMenu(formattedMenu);
                }
            } catch (error) {
                console.error('Failed to fetch mess menu', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMenu();
    }, []);

    if (loading) return null;

    const today = new Date();
    const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
    const formattedDate = today.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

    const todayMenu = menu.find(m => m.day === dayName) || menu[0];

    const mealCards = [
        { type: 'Breakfast', icon: Coffee, items: todayMenu?.breakfast, time: '7:30 AM - 9:00 AM', colorClass: 'meal-breakfast' },
        { type: 'Lunch', icon: Sun, items: todayMenu?.lunch, time: '12:30 PM - 2:00 PM', colorClass: 'meal-lunch' },
        { type: 'Dinner', icon: Moon, items: todayMenu?.dinner, time: '7:30 PM - 9:00 PM', colorClass: 'meal-dinner' },
    ];

    return (
        <div className="smm-container">
            <header className="smm-today-header">
                <div className="smm-header-content">
                    <h2 className="smm-today-title">Today's Special Menu</h2>
                    <div className="smm-date-badge">
                        <Calendar size={14} />
                        <span>{dayName}, {formattedDate}</span>
                    </div>
                </div>
            </header>

            {/* Today's Special Grid */}
            <div className="smm-grid">
                {mealCards.map((meal, idx) => {
                    const Icon = meal.icon;
                    return (
                        <div key={idx} className="smm-meal-card">
                            <div className="smm-meal-header">
                                <h3 className="smm-meal-title">{meal.type}</h3>
                                <div className={`smm-meal-icon-wrapper ${meal.colorClass}`}>
                                    <Icon size={24} />
                                </div>
                            </div>
                            <p className="smm-meal-items">{meal.items}</p>
                            <div className="smm-meal-time">
                                <Clock size={16} />
                                <span>{meal.time}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Full Schedule Table */}
            <div className="smm-table-card">
                <div className="smm-table-header">
                    <Calendar size={20} />
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Full Weekly Schedule</h2>
                </div>

                <div className="smm-table-wrapper">
                    <table className="smm-table">
                        <thead>
                            <tr>
                                <th className="smm-th">Day</th>
                                <th className="smm-th">Breakfast</th>
                                <th className="smm-th">Lunch</th>
                                <th className="smm-th">Dinner</th>
                            </tr>
                        </thead>
                        <tbody>
                            {menu.map((item, idx) => (
                                <tr key={idx} className="smm-tr">
                                    <td className="smm-td smm-day-cell">{item.day}</td>
                                    <td className="smm-td">{item.breakfast}</td>
                                    <td className="smm-td">{item.lunch}</td>
                                    <td className="smm-td">{item.dinner}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StudentMessMenu;
