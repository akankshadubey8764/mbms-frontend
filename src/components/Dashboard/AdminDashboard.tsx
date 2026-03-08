import React, { useState, useEffect } from 'react';
import {
    Users,
    Wallet,
    FileText,
    Settings,
    LogOut,
    LayoutDashboard,
    Search,
    Edit,
    Trash2,
    CheckCircle,

} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import apiClient from '../../api/apiClient';

interface Student {
    id: string;
    name: string;
    regNumber: string;
    department: string;
    year: string;
    daysPresent: number;
    daysAbsent: number;
    messBill: number;
}

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState<Student[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [departmentFilter, setDepartmentFilter] = useState('');
    const [yearFilter, setYearFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const departments = [
        'All',
        'Mechanical Engineering',
        'Electronics and Communication Engineering',
        'Electrical and Electronics Engineering',
        'Computer Science Engineering',
        'Civil Engineering',
    ];

    const years = ['All', 'I year', 'II year', 'III year', 'IV year'];

    useEffect(() => {
        fetchStudents();
    }, []);

    useEffect(() => {
        filterStudents();
    }, [students, departmentFilter, yearFilter, searchTerm]);

    const fetchStudents = async () => {
        try {
            const response = await apiClient.get('/admin/students');
            setStudents(response.data);
        } catch (error) {
            console.error('Error fetching students:', error);
            toast.error('Failed to load students data');
        } finally {
            setLoading(false);
        }
    };

    const filterStudents = () => {
        let filtered = students;

        if (departmentFilter && departmentFilter !== 'All') {
            filtered = filtered.filter((s) => s.department === departmentFilter);
        }

        if (yearFilter && yearFilter !== 'All') {
            filtered = filtered.filter((s) => s.year === yearFilter);
        }

        if (searchTerm) {
            filtered = filtered.filter(
                (s) =>
                    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    s.regNumber.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredStudents(filtered);
    };

    const calculateMessBill = (daysPresent: number, daysAbsent: number) => {
        const baseBill = 2000;
        const totalDays = daysPresent + daysAbsent;
        if (totalDays === 0) return baseBill;
        return Math.round((baseBill * daysPresent) / totalDays);
    };

    const handleUpdateBill = async (studentId: string) => {
        const billToast = toast.loading('Updating bill...');
        try {
            await apiClient.put(`/admin/students/${studentId}/update-bill`);
            toast.success('Bill updated successfully!', { id: billToast });
            fetchStudents();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update bill', { id: billToast });
        }
    };

    const handleRemoveStudent = async (studentId: string) => {
        if (window.confirm('Are you sure you want to remove this student?')) {
            const removeToast = toast.loading('Removing student...');
            try {
                await apiClient.delete(`/admin/students/${studentId}`);
                toast.success('Student removed successfully!', { id: removeToast });
                fetchStudents();
            } catch (error: any) {
                toast.error(error.response?.data?.message || 'Failed to remove student', { id: removeToast });
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        navigate('/login');
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
                    <h2 className="text-2xl font-bold text-center mb-8">Admin Portal</h2>
                    <nav className="space-y-2">
                        <Link
                            to="/admin-dashboard"
                            className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-primary-600 text-white transition-colors"
                        >
                            <LayoutDashboard size={20} />
                            <span>Dashboard</span>
                        </Link>
                        <Link
                            to="/admin-dashboard/students"
                            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            <Users size={20} />
                            <span>Students List</span>
                        </Link>
                        <Link
                            to="/admin-dashboard/mess-bills"
                            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            <Wallet size={20} />
                            <span>Mess Bills</span>
                        </Link>
                        <Link
                            to="/admin-dashboard/approvals"
                            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            <CheckCircle size={20} />
                            <span>Approvals</span>
                        </Link>
                        <Link
                            to="/admin-dashboard/queries"
                            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            <FileText size={20} />
                            <span>View Queries</span>
                        </Link>
                        <Link
                            to="/admin-dashboard/settings"
                            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            <Settings size={20} />
                            <span>Settings</span>
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
                        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                        <p className="text-gray-600">Manage hostel students and mess bills</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid md:grid-cols-4 gap-6 mb-8">
                        <div className="dashboard-card bg-gradient-to-br from-blue-500 to-blue-700 text-white">
                            <Users size={32} className="mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Total Students</h3>
                            <p className="text-4xl font-bold">{students.length}</p>
                        </div>
                        <div className="dashboard-card bg-gradient-to-br from-green-500 to-green-700 text-white">
                            <Wallet size={32} className="mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
                            <p className="text-4xl font-bold">
                                ₹{students.reduce((sum, s) => sum + s.messBill, 0)}
                            </p>
                        </div>
                        <div className="dashboard-card bg-gradient-to-br from-purple-500 to-purple-700 text-white">
                            <CheckCircle size={32} className="mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Active Students</h3>
                            <p className="text-4xl font-bold">{students.filter((s) => s.daysPresent > 0).length}</p>
                        </div>
                        <div className="dashboard-card bg-gradient-to-br from-orange-500 to-orange-700 text-white">
                            <FileText size={32} className="mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Pending Bills</h3>
                            <p className="text-4xl font-bold">0</p>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Filter Students</h2>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div>
                                <label className="form-label">Search</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Search by name or reg number..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="form-input pl-10"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="form-label">Department</label>
                                <select
                                    value={departmentFilter}
                                    onChange={(e) => setDepartmentFilter(e.target.value)}
                                    className="form-input"
                                >
                                    {departments.map((dept) => (
                                        <option key={dept} value={dept === 'All' ? '' : dept}>
                                            {dept}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="form-label">Year</label>
                                <select
                                    value={yearFilter}
                                    onChange={(e) => setYearFilter(e.target.value)}
                                    className="form-input"
                                >
                                    {years.map((year) => (
                                        <option key={year} value={year === 'All' ? '' : year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Students Table */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900">
                                Hostel Students List ({filteredStudents.length})
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="table-header">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Reg Number</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Department</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Year</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold">Days Present</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold">Days Absent</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold">Mess Bill</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStudents.map((student) => (
                                        <tr key={student.id} className="table-row">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                {student.name}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">{student.regNumber}</td>
                                            <td className="px-6 py-4 text-sm text-gray-700">{student.department}</td>
                                            <td className="px-6 py-4 text-sm text-gray-700">{student.year}</td>
                                            <td className="px-6 py-4 text-sm text-center">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                                    {student.daysPresent}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-center">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                                                    {student.daysAbsent}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-center font-semibold text-gray-900">
                                                ₹{calculateMessBill(student.daysPresent, student.daysAbsent)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-center">
                                                <div className="flex items-center justify-center space-x-2">
                                                    <button
                                                        onClick={() => handleUpdateBill(student.id)}
                                                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                                                        title="Update Bill"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleRemoveStudent(student.id)}
                                                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                                        title="Remove Student"
                                                    >
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
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
