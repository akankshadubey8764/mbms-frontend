import React, { useState, useEffect } from 'react';
import { Send, CheckCircle, Clock, Search, Filter, Mail, Bell, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import apiClient from '../../../api/apiClient';
import './AdminMessBills.css';

interface StudentBill {
    _id: string;
    studentName: string;
    regNumber: string;
    amount: number;
    status: 'PAID' | 'PENDING' | 'UNPAID' | 'PARTIAL';
    email: string;
    month?: number;
    year?: number;
}

const MONTHS = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const AdminMessBills: React.FC = () => {
    const [bills, setBills] = useState<StudentBill[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);

    useEffect(() => {
        fetchBills();
    }, [currentPage]);

    const fetchBills = async () => {
        setLoading(true);
        try {
            const skip = (currentPage - 1) * limit;
            const response = await apiClient.get('/admin/mess-bills', { params: { skip, limit } });
            if (response.data && response.data.data) {
                setBills(response.data.data);
                setTotal(response.data.total);
            } else {
                setBills([]);
                setTotal(0);
            }
        } catch (error) {
            console.error('Error fetching bills:', error);
            toast.error('Failed to fetch mess bills');
            setBills([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    };

    const toggleSelect = (id: string) => {
        setSelectedStudents(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const handleMarkPaid = async (bill: StudentBill) => {
        const statusToast = toast.loading('Updating bill status...');
        try {
            await apiClient.patch('/admin/mess-bills/status', {
                studentId: bill._id,
                month: bill.month,
                year: bill.year,
                status: 'PAID'
            });
            toast.success('Bill marked as PAID', { id: statusToast });
            fetchBills();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update bill status', { id: statusToast });
        }
    };

    const handleSendReminder = (name: string) => {
        toast.success(`Payment reminder sent to ${name}`);
    };

    const filteredBills = bills.filter(b =>
        (b.studentName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (b.regNumber || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const isPaid = (s: string) => s === 'PAID';

    return (
        <div className="amb-container">
            {/* <div className="amb-header">
                <div>
                    <h1 className="amb-title">Mess Billing</h1>
                    <p className="amb-subtitle">Manage student mess payments and issue reminders</p>
                </div>
                <div className="amb-header-actions">
                    <button className="amb-generate-btn">
                        <Wallet size={16} />
                        <span>Generate Monthly Bills</span>
                    </button>
                </div>
            </div> */}

            {/* Summary Cards */}
            <div className="amb-summary-grid">
                <div className="amb-summary-card">
                    <p className="amb-summary-label">Total Records</p>
                    <p className="amb-summary-value">{total}</p>
                </div>
                <div className="amb-summary-card emerald">
                    <p className="amb-summary-label">Paid</p>
                    <p className="amb-summary-value">{bills.filter(b => isPaid(b.status)).length}</p>
                </div>
                <div className="amb-summary-card rose">
                    <p className="amb-summary-label">Pending</p>
                    <p className="amb-summary-value">{bills.filter(b => !isPaid(b.status)).length}</p>
                </div>
                <div className="amb-summary-card blue">
                    <p className="amb-summary-label">Total Amount</p>
                    <p className="amb-summary-value">₹{bills.reduce((s, b) => s + (b.amount || 0), 0).toLocaleString()}</p>
                </div>
            </div>

            <div className="amb-content-wrapper">
                {/* Search & Filters */}
                <div className="amb-filters-container">
                    <div className="amb-search-wrapper">
                        <Search className="amb-search-icon" size={18} />
                        <input
                            type="text"
                            placeholder="Find student by name or ID..."
                            className="amb-search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="amb-filter-actions">
                        <button className="amb-filter-btn">
                            <Filter size={20} />
                        </button>
                        <button
                            disabled={selectedStudents.length === 0}
                            onClick={() => selectedStudents.forEach(id => {
                                const b = bills.find(x => x._id === id);
                                if (b) handleSendReminder(b.studentName);
                            })}
                            className="amb-remind-btn"
                        >
                            <Bell size={14} />
                            <span>Remind Selected ({selectedStudents.length})</span>
                        </button>
                    </div>
                </div>

                <div className="amb-table-wrapper">
                    <table className="amb-table">
                        <thead>
                            <tr>
                                <th className="amb-th left w-16">
                                    <input
                                        type="checkbox"
                                        className="amb-checkbox"
                                        checked={selectedStudents.length === filteredBills.length && filteredBills.length > 0}
                                        onChange={(e) => setSelectedStudents(e.target.checked ? filteredBills.map(b => b._id) : [])}
                                    />
                                </th>
                                <th className="amb-th left">Resident</th>
                                <th className="amb-th">Period</th>
                                <th className="amb-th">Amount Due</th>
                                <th className="amb-th">Status</th>
                                <th className="amb-th right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={6} className="amb-loader-row">Loading Records...</td></tr>
                            ) : filteredBills.length === 0 ? (
                                <tr><td colSpan={6} className="amb-empty-row">No billing records found.</td></tr>
                            ) : (
                                filteredBills.map((bill) => (
                                    <tr key={bill._id}>
                                        <td className="amb-td left w-16">
                                            <input
                                                type="checkbox"
                                                className="amb-checkbox"
                                                checked={selectedStudents.includes(bill._id)}
                                                onChange={() => toggleSelect(bill._id)}
                                            />
                                        </td>
                                        <td className="amb-td left">
                                            <div className="amb-student-cell">
                                                <div className="amb-student-avatar">
                                                    {(bill.studentName || 'ST').substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="amb-student-name">{bill.studentName || 'Unknown'}</p>
                                                    <p className="amb-student-reg">{bill.regNumber || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="amb-td">
                                            <span className="amb-period-text">
                                                {bill.month ? `${MONTHS[bill.month]} ${bill.year}` : 'N/A'}
                                            </span>
                                        </td>
                                        <td className="amb-td">
                                            <p className="amb-amount-text">₹{bill.amount?.toLocaleString() || '0'}</p>
                                        </td>
                                        <td className="amb-td">
                                            {isPaid(bill.status) ? (
                                                <span className="amb-status-badge paid">
                                                    <CheckCircle size={10} />
                                                    <span>Paid</span>
                                                </span>
                                            ) : (
                                                <span className="amb-status-badge pending">
                                                    <Clock size={10} />
                                                    <span>{bill.status || 'Pending'}</span>
                                                </span>
                                            )}
                                        </td>
                                        <td className="amb-td right">
                                            <div className="amb-actions-container">
                                                {!isPaid(bill.status) && (
                                                    <button
                                                        onClick={() => handleMarkPaid(bill)}
                                                        className="amb-btn-mark-paid"
                                                        title="Mark as Paid"
                                                    >
                                                        Mark Paid
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleSendReminder(bill.studentName)}
                                                    className="amb-btn-icon"
                                                    title="Send Reminder"
                                                >
                                                    <Send size={16} />
                                                </button>
                                                <button className="amb-btn-icon blue">
                                                    <Mail size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="amb-pagination-container">
                    <p className="amb-pagination-info">
                        Showing {filteredBills.length} of {total} records
                    </p>
                    <div className="amb-pagination-controls">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => p - 1)}
                            className="amb-page-btn"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <span className="amb-page-current">
                            {currentPage}
                        </span>
                        <button
                            disabled={currentPage * limit >= total}
                            onClick={() => setCurrentPage(p => p + 1)}
                            className="amb-page-btn"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminMessBills;
