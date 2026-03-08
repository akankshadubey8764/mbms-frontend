import React, { useState, useEffect } from 'react';
import { Utensils, Coffee, Sun, Soup, Star, AlertCircle } from 'lucide-react';
import apiClient from '../../../api/apiClient';

interface MenuItem {
    day: string;
    mealTime: 'Breakfast' | 'Lunch' | 'Dinner';
    items: string[];
}

interface MenuData {
    week: string;
    menuItems: MenuItem[];
}

const StudentMessMenu: React.FC = () => {
    const [menu, setMenu] = useState<MenuData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMenu();
    }, []);

    const fetchMenu = async () => {
        try {
            const response = await apiClient.get('/mess/get_mess_menu');
            setMenu(response.data);
        } catch (error) {
            console.error('Error fetching menu:', error);
        } finally {
            setLoading(false);
        }
    };

    const getCurrentDay = () => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[new Date().getDay()];
    };

    const currentDay = getCurrentDay();

    const getDayMenu = (day: string) => {
        const dayItems = menu?.menuItems.filter(m => m.day === day) || [];
        return {
            breakfast: dayItems.find(m => m.mealTime === 'Breakfast')?.items.join(', ') || 'N/A',
            lunch: dayItems.find(m => m.mealTime === 'Lunch')?.items.join(', ') || 'N/A',
            dinner: dayItems.find(m => m.mealTime === 'Dinner')?.items.join(', ') || 'N/A',
        };
    };

    const todayMenu = getDayMenu(currentDay);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in max-w-7xl mx-auto">
            {/* <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-display font-bold text-gray-900">Weekly Mess Menu</h1>
                    <p className="text-gray-600">Plan your meals with our nutritious weekly schedule</p>
                </div>
                {menu?.week && (
                    <p className="px-4 py-2 bg-primary/10 text-primary-700 rounded-xl text-xs font-black uppercase tracking-widest">
                        {menu.week}
                    </p>
                )}
            </div> */}

            {/* Today's Special Card */}
            <div className="mb-12 bg-gradient-to-r from-gray-900 to-gray-800 rounded-[2rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -mr-32 -mt-32 rounded-full group-hover:bg-primary/30 transition-all duration-700"></div>
                <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="flex items-center space-x-2 mb-6">
                            <Utensils className="text-primary" size={24} />
                            <span className="text-xs font-black uppercase tracking-[0.3em] text-primary">Daily Featured Menu</span>
                        </div>
                        <h2 className="text-4xl font-sans font-black mb-4 uppercase tracking-tighter">{currentDay} Specials</h2>
                        <p className="text-gray-400 font-medium text-lg leading-relaxed">
                            {menu ? (
                                `Today's menu features ${todayMenu.lunch} for lunch and ${todayMenu.dinner} for dinner.`
                            ) : (
                                "The weekly mess menu is being updated by the management."
                            )}
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <TodayMeal icon={Coffee} label="Breakfast" value={todayMenu.breakfast} />
                        <TodayMeal icon={Sun} label="Lunch" value={todayMenu.lunch} />
                        <TodayMeal icon={Soup} label="Dinner" value={todayMenu.dinner} />
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 flex flex-col justify-center items-center text-center">
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Feedback</p>
                            <p className="text-xs font-bold text-white/60">Rate Today's Meal</p>
                            <div className="flex space-x-1 mt-2">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} className="text-primary" />)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Full Weekly Grid */}
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-white rounded-2xl shadow-sm">
                            <Utensils size={24} className="text-primary" />
                        </div>
                        <h2 className="text-2xl font-display font-bold text-gray-900">Weekly Schedule</h2>
                    </div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                        {menu ? 'Active Menu' : 'Update Pending'}
                    </p>
                </div>

                <div className="overflow-x-auto">
                    {menu ? (
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th className="px-10 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Day</th>
                                    <th className="px-10 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Breakfast</th>
                                    <th className="px-10 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Lunch</th>
                                    <th className="px-10 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Dinner</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {days.map((day) => {
                                    const dayMenu = getDayMenu(day);
                                    return (
                                        <tr
                                            key={day}
                                            className={`transition-all duration-300 ${day === currentDay ? 'bg-primary/5' : 'hover:bg-gray-50/30'}`}
                                        >
                                            <td className="px-10 py-7 font-display font-black text-gray-900 text-lg">
                                                {day}
                                                {day === currentDay && <span className="ml-2 inline-block w-2 h-2 rounded-full bg-primary animate-pulse"></span>}
                                            </td>
                                            <td className="px-10 py-7 text-sm font-bold text-gray-600 tracking-tight">{dayMenu.breakfast}</td>
                                            <td className="px-10 py-7 text-sm font-black text-gray-900 tracking-tight">{dayMenu.lunch}</td>
                                            <td className="px-10 py-7 text-sm font-black text-gray-900 tracking-tight">{dayMenu.dinner}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-center py-20 text-gray-400">
                            <AlertCircle size={48} className="mx-auto mb-4 opacity-20" />
                            <p className="text-sm font-bold uppercase tracking-widest">No menu data available currently.</p>
                            <p className="text-xs mt-2 uppercase">Please contact the mess manager.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const TodayMeal: React.FC<{ icon: any; label: string; value: string }> = ({ icon: Icon, label, value }) => (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-colors duration-300">
        <div className="flex items-center space-x-3 mb-2">
            <Icon size={18} className="text-primary" />
            <p className="text-[10px] font-black uppercase tracking-widest text-white/50">{label}</p>
        </div>
        <p className="text-base font-bold text-white tracking-tight">{value}</p>
    </div>
);

export default StudentMessMenu;
