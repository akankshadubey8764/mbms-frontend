import React, { useState, useEffect } from 'react';
import { UserCheck, UserX, ShieldCheck, Clock, Calendar, Hash, Mail, Phone, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '../../../api/apiClient';
import './AdminApprovals.css';

interface Request {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    regNumber: string;
    department: string;
    year: string;
    roomNo: number;
    block: string;
    phone: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    createdAt: string;
}

const AdminApprovals: React.FC = () => {
    const [requests, setRequests] = useState<Request[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);

    useEffect(() => {
        fetchRequests();
    }, [currentPage]);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const skip = (currentPage - 1) * limit;
            const response = await apiClient.get('/admin/pending-approvals', {
                params: { skip, limit }
            });
            if (response.data && response.data.data) {
                setRequests(response.data.data);
                setTotal(response.data.total);
            } else {
                setRequests([]);
                setTotal(0);
            }
        } catch (error) {
            console.error('Error fetching requests:', error);
            toast.error('Failed to fetch requests');
            setRequests([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id: string, action: 'approve' | 'reject') => {
        const loadingToast = toast.loading(`${action === 'approve' ? 'Approving' : 'Rejecting'} student...`);
        try {
            await apiClient.post(`/admin/requests/${id}/${action}`);
            toast.success(`Student ${action === 'approve' ? 'approved' : 'rejected'} successfully!`, { id: loadingToast });
            fetchRequests();
        } catch (error: any) {
            toast.error(error.response?.data?.message || `Failed to ${action} student`, { id: loadingToast });
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="admin-approvals-container">
            <div className="aa-header-section">
                <div>
                    <h1 className="aa-header-title">Registration Requests</h1>
                    <p className="aa-header-subtitle">Review and manage pending student applications</p>
                </div>
                <div className="aa-status-stats">
                    <div className="aa-stat-card">
                        <Clock className="aa-stat-icon" size={20} />
                        <div>
                            <p className="aa-stat-value">{total}</p>
                            <p className="aa-stat-label">Pending</p>
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="aa-loader-container">
                    <div className="aa-loader-spinner"></div>
                    <p className="aa-loader-text">Fetching applications...</p>
                </div>
            ) : (
                <div className="aa-content-card">
                    <div className="aa-table-wrapper">
                        <table className="aa-table">
                            <thead>
                                <tr>
                                    <th>S.No.</th>
                                    <th>Reg No.</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Dept.</th>
                                    <th>Year</th>
                                    <th>Room</th>
                                    <th>Block</th>
                                    <th>Requested On</th>
                                    <th className="actions">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.length === 0 ? (
                                    <tr>
                                        <td colSpan={11} className="aa-empty-state">
                                            <div className="aa-empty-container">
                                                <ShieldCheck size={64} className="aa-empty-icon" />
                                                <h3 className="aa-empty-title">All Caught Up!</h3>
                                                <p className="aa-empty-text">No pending registration requests at the moment.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    requests.map((request, index) => (
                                        <tr key={request._id}>
                                            <td className="aa-sno">{(currentPage - 1) * limit + index + 1}</td>
                                            <td>
                                                <div className="aa-reg-pill">{request.regNumber}</div>
                                            </td>
                                            <td>
                                                <div className="aa-user-name-cell">
                                                    <span className="aa-name-text">{request.firstName} {request.lastName}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="aa-contact-cell">
                                                    <Mail size={12} className="aa-cell-icon" />
                                                    <span className="aa-email-text">{request.email}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="aa-contact-cell">
                                                    <Phone size={12} className="aa-cell-icon" />
                                                    <span className="aa-phone-text">{request.phone}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="aa-dept-pill">{request.department}</div>
                                            </td>
                                            <td>
                                                <div className="aa-year-badge">{request.year}</div>
                                            </td>
                                            <td>
                                                <div className="aa-room-cell">
                                                    <Hash size={12} className="aa-cell-icon" />
                                                    <span>{request.roomNo}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="aa-block-cell">
                                                    <MapPin size={12} className="aa-cell-icon" />
                                                    <span>{request.block}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="aa-date-cell">
                                                    <Calendar size={12} className="aa-cell-icon" />
                                                    <span>{formatDate(request.createdAt)}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="aa-actions">
                                                    <button
                                                        onClick={() => handleAction(request._id, 'reject')}
                                                        className="aa-btn aa-btn-reject"
                                                        title="Reject Request"
                                                    >
                                                        <UserX size={16} />
                                                        <span className="aa-btn-text">Reject</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(request._id, 'approve')}
                                                        className="aa-btn aa-btn-approve"
                                                        title="Approve Request"
                                                    >
                                                        <UserCheck size={16} />
                                                        <span className="aa-btn-text">Approve</span>
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
                    {total > 0 && (
                        <div className="aa-pagination">
                            <p className="aa-pagination-info">
                                Showing <span>{requests.length}</span> of <span>{total}</span> applications
                            </p>
                            <div className="aa-pagination-controls">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(p => p - 1)}
                                    className="aa-page-btn"
                                >
                                    Prev
                                </button>
                                <span className="aa-page-current">
                                    {currentPage}
                                </span>
                                <button
                                    disabled={currentPage * limit >= total}
                                    onClick={() => setCurrentPage(p => p + 1)}
                                    className="aa-page-btn"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminApprovals;
