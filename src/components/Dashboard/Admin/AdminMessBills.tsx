import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    AlertCircle,
    Calendar,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Download,
    Search,
    Upload,
    XCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import apiClient from '../../../api/apiClient';
import './AdminMessBills.css';

interface MonthStatus {
    status: 'PAID' | 'PARTIAL' | 'UNPAID';
    isVerified: boolean;
    amountIssued: number;
    amountPaid: number;
    daysPresent: number;
    daysAbsent: number;
}

interface StudentMessStatus {
    _id: string;
    name: string;
    regNumber: string;
    dept: string;
    year: string;
    phone: string;
    billStatus: { [key: number]: MonthStatus[] };
}

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const AdminMessBills: React.FC = () => {
    const [statusList, setStatusList] = useState<StudentMessStatus[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [uploadAllowed, setUploadAllowed] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(25);
    const [total, setTotal] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
    const isFetching = useRef(false);

    const checkUploadWindow = useCallback(async () => {
        try {
            const response = await apiClient.get('/admin/mess-bills/upload-window');
            setUploadAllowed(response.data.allowed);
        } catch (error) {
            console.error('Error checking upload window:', error);
        }
    }, []);

    const fetchStatusList = useCallback(async () => {
        if (isFetching.current) return;
        isFetching.current = true;
        setLoading(true);
        try {
            const skip = (currentPage - 1) * limit;
            const response = await apiClient.get('/admin/mess-bills/status-list', {
                params: { year: selectedYear, skip, limit }
            });
            if (response.data && response.data.data) {
                setStatusList(response.data.data);
                setTotal(response.data.total);
            } else {
                setStatusList(response.data || []);
                setTotal((response.data || []).length);
            }
        } catch (error) {
            console.error('Error fetching mess status:', error);
            toast.error('Failed to fetch mess status list');
            setStatusList([]);
            setTotal(0);
        } finally {
            setLoading(false);
            isFetching.current = false;
        }
    }, [selectedYear, currentPage, limit]);

    useEffect(() => {
        fetchStatusList();
        checkUploadWindow();
    }, [fetchStatusList, checkUploadWindow]);

    const handleBulkUploadClick = () => {
        if (!uploadAllowed) {
            toast.error('Bulk upload is only open on the last day of the month and first day of the next month.');
            return;
        }
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            const text = event.target?.result as string;
            const rows = text.split('\n').filter(row => row.trim() !== '');
            const headers = rows[0].split(',').map(h => h.trim());

            const data = rows.slice(1).map(row => {
                const values = row.split(',').map(v => v.trim());
                const obj: any = {};
                headers.forEach((header, i) => {
                    obj[header] = values[i];
                });
                return obj;
            });

            const uploadToast = toast.loading('Processing bulk upload...');
            try {
                await apiClient.post('/admin/mess-bills/bulk-upload', {
                    year: selectedYear,
                    data
                });
                toast.success('Bulk upload processed successfully!', { id: uploadToast });
                fetchStatusList();
            } catch (error: any) {
                toast.error(error.response?.data?.message || 'Bulk upload failed', { id: uploadToast });
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    const filteredList = statusList.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.regNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const isCurrentOrFutureMonth = (monthIndex: number) => {
        const now = new Date();
        if (selectedYear > now.getFullYear()) return true;
        if (selectedYear === now.getFullYear() && monthIndex >= now.getMonth()) return true;
        return false;
    };

    const renderMonthCell = (student: StudentMessStatus, monthIndex: number) => {
        const monthNum = monthIndex + 1;
        const bills = student.billStatus[monthNum] || [];
        const bill = bills[0];

        if (bill) {
            return (
                <div className="amb-cell-vertical">
                    <span className="amb-cell-amount">
                        {bill.amountIssued > 0 ? `₹${bill.amountIssued}` : ''}
                    </span>
                    {bill.status === 'PAID' ? (
                        <CheckCircle size={16} className="text-emerald-500" />
                    ) : (
                        <XCircle size={16} className="text-rose-500" />
                    )}
                </div>
            );
        }

        if (isCurrentOrFutureMonth(monthIndex)) {
            return <div className="text-gray-300 mx-auto text-xs">-</div>;
        }

        return (
            <div className="amb-cell-vertical op-30">
                <span className="amb-cell-amount">N/A</span>
                <XCircle size={16} className="text-gray-300" />
            </div>
        );
    };

    const downloadTemplate = () => {
        const headers = ["S.No", "Reg Number"];
        MONTHS_SHORT.forEach(m => {
            headers.push(`${m} Present`, `${m} Absent`);
        });

        const content = [
            headers.join(','),
            `1,REG001,${MONTHS_SHORT.map(() => '0,0').join(',')}`
        ].join('\n');

        const blob = new Blob([content], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Mess_Bill_Template_${selectedYear}.csv`;
        a.click();
    };

    return (
        <div className="amb-container">
            <div className="amb-header">
                <div className="amb-header-actions">
                    <div className="amb-year-select-wrapper">
                        <Calendar size={16} className="amb-calendar-icon" />
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                            className="amb-year-select"
                        >
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                    <button
                        onClick={downloadTemplate}
                        className="amb-btn-secondary"
                        title="Download CSV Template"
                    >
                        <Download size={16} />
                        <span>Template</span>
                    </button>
                    <button
                        onClick={handleBulkUploadClick}
                        className={`amb-generate-btn ${!uploadAllowed ? 'disabled' : ''}`}
                    >
                        <Upload size={16} />
                        <span>Bulk Upload</span>
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        accept=".csv"
                    />
                </div>
            </div>

            <div className="amb-content-wrapper">
                <div className="amb-filters-container">
                    <div className="amb-search-wrapper">
                        <Search className="amb-search-icon" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or reg number..."
                            className="amb-search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {!uploadAllowed && (
                        <div className="amb-info-alert">
                            <AlertCircle size={14} />
                            <span>Bulk upload opens on monthly billing windows (Last/First day).</span>
                        </div>
                    )}
                </div>

                <div className="amb-table-wrapper">
                    <table className="amb-status-table">
                        <thead>
                            <tr>
                                <th className="amb-th-sticky">S.No</th>
                                <th className="amb-th-sticky text-left">Name</th>
                                <th>Dept</th>
                                <th>Year</th>
                                <th>Phone</th>
                                {MONTHS_SHORT.map(m => <th key={m}>{m}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={17} className="amb-loader-row">Loading records...</td></tr>
                            ) : filteredList.length === 0 ? (
                                <tr><td colSpan={17} className="amb-empty-row">No students found.</td></tr>
                            ) : (
                                filteredList.map((student, idx) => (
                                    <tr key={student._id}>
                                        <td className="amb-td-sticky text-center font-bold">{(currentPage - 1) * limit + idx + 1}</td>
                                        <td className="amb-td-sticky text-left">
                                            <div className="amb-student-info">
                                                <p className="amb-name">{student.name}</p>
                                                <p className="amb-reg">{student.regNumber}</p>
                                            </div>
                                        </td>
                                        <td>{student.dept}</td>
                                        <td>{student.year}</td>
                                        <td className="text-xs font-mono">{student.phone}</td>
                                        {MONTHS_SHORT.map((_, mIdx) => (
                                            <td key={mIdx}>
                                                {renderMonthCell(student, mIdx)}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="amb-pagination">
                    <div className="amb-pagination-left">
                        <span className="amb-pagination-info">Showing {filteredList.length} of {total} records</span>
                        <div className="amb-limit-select">
                            <span>Rows per page:</span>
                            <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setCurrentPage(1); }}>
                                {[25, 50, 100, 200].map(val => (
                                    <option key={val} value={val}>{val}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="amb-pagination-right">
                        <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="amb-page-btn">
                            <ChevronLeft size={18} />
                        </button>
                        <span className="amb-page-indicator">Page {currentPage}</span>
                        <button disabled={currentPage * limit >= total} onClick={() => setCurrentPage(p => p + 1)} className="amb-page-btn">
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminMessBills;
