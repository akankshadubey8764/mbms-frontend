import React, { useState, useEffect } from 'react';
import {
    Package,
    TrendingUp,
    ShoppingCart,
    BarChart3,
    LogOut,
    LayoutDashboard,
    Plus,
    Edit,
    Trash2,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../../api/apiClient';

interface GroceryItem {
    id: string;
    name: string;
    quantity: number;
    unit: string;
    lastUpdated: string;
}

interface StockItem {
    id: string;
    itemName: string;
    currentStock: number;
    minimumStock: number;
    status: 'Good' | 'Low' | 'Critical';
}

const MessUsersDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [groceries, setGroceries] = useState<GroceryItem[]>([]);
    const [stocks, setStocks] = useState<StockItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [groceriesRes, stocksRes] = await Promise.all([
                apiClient.get('/mess/groceries'),
                apiClient.get('/mess/stocks'),
            ]);
            setGroceries(groceriesRes.data);
            setStocks(stocksRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        navigate('/login');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Good':
                return 'bg-green-100 text-green-800';
            case 'Low':
                return 'bg-yellow-100 text-yellow-800';
            case 'Critical':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-gray-900 text-white fixed h-full shadow-2xl">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-center mb-8">Mess Portal</h2>
                    <nav className="space-y-2">
                        <Link
                            to="/mess-dashboard"
                            className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-primary-600 text-white transition-colors"
                        >
                            <LayoutDashboard size={20} />
                            <span>Dashboard</span>
                        </Link>
                        <Link
                            to="/mess-dashboard/groceries"
                            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            <ShoppingCart size={20} />
                            <span>Groceries</span>
                        </Link>
                        <Link
                            to="/mess-dashboard/stocks"
                            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            <Package size={20} />
                            <span>Stock Management</span>
                        </Link>
                        <Link
                            to="/mess-dashboard/analytics"
                            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            <BarChart3 size={20} />
                            <span>Analytics</span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-600 transition-colors"
                        >
                            <LogOut size={20} />
                            <span>Logout</span>
                        </button>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="ml-64 flex-1 p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Mess Management Dashboard</h1>
                        <p className="text-gray-600">Manage groceries, stocks, and inventory</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid md:grid-cols-4 gap-6 mb-8">
                        <div className="dashboard-card bg-gradient-to-br from-blue-500 to-blue-700 text-white">
                            <ShoppingCart size={32} className="mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Total Items</h3>
                            <p className="text-4xl font-bold">{groceries.length}</p>
                        </div>
                        <div className="dashboard-card bg-gradient-to-br from-green-500 to-green-700 text-white">
                            <Package size={32} className="mb-4" />
                            <h3 className="text-lg font-semibold mb-2">In Stock</h3>
                            <p className="text-4xl font-bold">
                                {stocks.filter((s) => s.status === 'Good').length}
                            </p>
                        </div>
                        <div className="dashboard-card bg-gradient-to-br from-yellow-500 to-yellow-700 text-white">
                            <TrendingUp size={32} className="mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Low Stock</h3>
                            <p className="text-4xl font-bold">
                                {stocks.filter((s) => s.status === 'Low').length}
                            </p>
                        </div>
                        <div className="dashboard-card bg-gradient-to-br from-red-500 to-red-700 text-white">
                            <Package size={32} className="mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Critical</h3>
                            <p className="text-4xl font-bold">
                                {stocks.filter((s) => s.status === 'Critical').length}
                            </p>
                        </div>
                    </div>

                    {/* Groceries Section */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900">Groceries Inventory</h2>
                            <button className="btn-primary flex items-center space-x-2">
                                <Plus size={20} />
                                <span>Add Item</span>
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="table-header">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Item Name</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold">Quantity</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold">Unit</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold">Last Updated</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {groceries.map((item) => (
                                        <tr key={item.id} className="table-row">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.name}</td>
                                            <td className="px-6 py-4 text-sm text-center text-gray-700">
                                                {item.quantity}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-center text-gray-700">{item.unit}</td>
                                            <td className="px-6 py-4 text-sm text-center text-gray-700">
                                                {item.lastUpdated}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-center">
                                                <div className="flex items-center justify-center space-x-2">
                                                    <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                                                        <Edit size={16} />
                                                    </button>
                                                    <button className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Stock Status Section */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900">Stock Status Overview</h2>
                        </div>
                        <div className="p-6">
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {stocks.map((stock) => (
                                    <div
                                        key={stock.id}
                                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="font-semibold text-gray-900">{stock.itemName}</h3>
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                                    stock.status
                                                )}`}
                                            >
                                                {stock.status}
                                            </span>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Current Stock:</span>
                                                <span className="font-semibold text-gray-900">{stock.currentStock}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Minimum Stock:</span>
                                                <span className="font-semibold text-gray-900">{stock.minimumStock}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                                <div
                                                    className={`h-2 rounded-full ${stock.status === 'Good'
                                                            ? 'bg-green-500'
                                                            : stock.status === 'Low'
                                                                ? 'bg-yellow-500'
                                                                : 'bg-red-500'
                                                        }`}
                                                    style={{
                                                        width: `${Math.min(
                                                            (stock.currentStock / stock.minimumStock) * 100,
                                                            100
                                                        )}%`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Charts Placeholder */}
                    <div className="mt-8 bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Analytics & Trends</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="h-64 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                                <div className="text-center">
                                    <BarChart3 size={48} className="mx-auto text-blue-600 mb-2" />
                                    <p className="text-gray-700 font-semibold">Monthly Consumption Chart</p>
                                    <p className="text-sm text-gray-500">Chart visualization placeholder</p>
                                </div>
                            </div>
                            <div className="h-64 bg-gradient-to-br from-green-50 to-green-100 rounded-lg flex items-center justify-center">
                                <div className="text-center">
                                    <TrendingUp size={48} className="mx-auto text-green-600 mb-2" />
                                    <p className="text-gray-700 font-semibold">Stock Trends</p>
                                    <p className="text-sm text-gray-500">Chart visualization placeholder</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessUsersDashboard;
