import React, { useState, useEffect } from 'react';
import { CheckCircle, MessageSquare, Clock, User, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import apiClient from '../../../api/apiClient';
import './AdminQueries.css';

interface Query {
    _id: string;
    message?: string;
    queryText?: string;
    queryArea?: string;
    status: 'PENDING' | 'RESOLVED' | 'Open' | 'Resolved';
    createdAt: string;
    student?: {
        firstname?: string;
        lastname?: string;
        name?: string;
        regnumber?: string;
        regNumber?: string;
    };
    response?: string;
}

const AdminQueries: React.FC = () => {
    const [queries, setQueries] = useState<Query[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);

    useEffect(() => {
        fetchQueries();
    }, [currentPage]);

    const fetchQueries = async () => {
        setLoading(true);
        try {
            const skip = (currentPage - 1) * limit;
            const response = await apiClient.get('/admin/queries', { params: { skip, limit } });
            if (response.data && response.data.data) {
                setQueries(response.data.data);
                setTotal(response.data.total);
            } else if (Array.isArray(response.data)) {
                setQueries(response.data);
                setTotal(response.data.length);
            } else {
                setQueries([]);
                setTotal(0);
            }
        } catch (error) {
            console.error('Error fetching queries:', error);
            toast.error('Failed to load queries');
            setQueries([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    };

    const markAsResolved = async (id: string) => {
        const resolveToast = toast.loading('Marking as resolved...');
        try {
            await apiClient.put(`/admin/queries/${id}/resolve`);
            toast.success('Query marked as resolved!', { id: resolveToast });
            fetchQueries();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to resolve query', { id: resolveToast });
        }
    };

    const getStudentName = (q: Query) => {
        if (!q.student) return 'Unknown Student';
        if (q.student.name) return q.student.name;
        return `${q.student.firstname || ''} ${q.student.lastname || ''}`.trim() || 'Unknown';
    };

    const getStudentReg = (q: Query) => {
        if (!q.student) return 'N/A';
        return q.student.regnumber || q.student.regNumber || 'N/A';
    };

    const getQueryText = (q: Query) => q.message || q.queryText || 'No message provided';

    const isResolved = (q: Query) => q.status === 'RESOLVED' || q.status === 'Resolved';

    const pendingCount = queries.filter(q => !isResolved(q)).length;

    return (
        <div className="aq-container">
            <div className="aq-header-container">
                {/* <div>
                    <h1 className="aq-title">Student Queries</h1>
                    <p className="aq-subtitle">Review and address feedback, complaints, and service requests</p>
                </div> */}
                <div className="aq-status-tags">
                    {pendingCount > 0 && (
                        <span className="aq-badge-pending">
                            <Clock size={14} />
                            <span>{pendingCount} Pending</span>
                        </span>
                    )}
                    <span className="aq-badge-resolved">
                        <CheckCircle size={14} />
                        <span>{queries.filter(q => isResolved(q)).length} Resolved</span>
                    </span>
                </div>
            </div>

            {loading ? (
                <div className="aq-loader-container">
                    <div className="aq-loader-spinner"></div>
                </div>
            ) : queries.length === 0 ? (
                <div className="aq-empty-state">
                    <MessageSquare size={48} className="aq-empty-icon" />
                    <p className="aq-empty-text">No queries found.</p>
                </div>
            ) : (
                <div className="aq-grid">
                    {queries.map((query) => (
                        <div key={query._id} className={`aq-card ${isResolved(query) ? 'resolved' : ''}`}>

                            <div className="aq-card-header">
                                <div className="aq-avatar">
                                    <User size={18} />
                                </div>
                                <div className="aq-student-info">
                                    <p className="aq-student-name">{getStudentName(query)}</p>
                                    <p className="aq-student-reg">{getStudentReg(query)}</p>
                                </div>
                                {query.queryArea && (
                                    <span className="aq-area-badge">
                                        {query.queryArea}
                                    </span>
                                )}
                            </div>

                            <div className="aq-message-box">
                                <p className="aq-message-text">
                                    "{getQueryText(query)}"
                                </p>
                            </div>

                            {query.response && (
                                <div className="aq-response-box">
                                    <p className="aq-response-label">Admin Response</p>
                                    <p className="aq-response-text">{query.response}</p>
                                </div>
                            )}

                            <div className="aq-card-footer">
                                <div className="aq-date-info">
                                    {query.createdAt && (
                                        <>
                                            <Clock size={12} />
                                            <span className="aq-date-text">
                                                {new Date(query.createdAt).toLocaleDateString()}
                                            </span>
                                        </>
                                    )}
                                </div>

                                {!isResolved(query) ? (
                                    <button
                                        onClick={() => markAsResolved(query._id)}
                                        className="aq-btn-resolve"
                                    >
                                        <span>Resolve</span>
                                        <ArrowRight size={12} />
                                    </button>
                                ) : (
                                    <div className="aq-badge-resolved-small">
                                        <CheckCircle size={12} />
                                        <span className="aq-badge-resolved-text">Resolved</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {!loading && total > 0 && (
                <div className="aq-pagination-container">
                    <p className="aq-pagination-info">
                        Showing {queries.length} of {total} queries
                    </p>
                    <div className="aq-pagination-controls">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => p - 1)}
                            className="aq-page-btn"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <span className="aq-page-current">Page {currentPage}</span>
                        <button
                            disabled={currentPage * limit >= total}
                            onClick={() => setCurrentPage(p => p + 1)}
                            className="aq-page-btn"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminQueries;
