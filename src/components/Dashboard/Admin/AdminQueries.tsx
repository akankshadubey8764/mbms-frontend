import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    CheckCircle, HelpCircle,
    Utensils, Droplets, Shield
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import apiClient from '../../../api/apiClient';
import './AdminQueries.css';

interface Query {
    _id: string;
    message?: string;
    queryText?: string;
    queryArea?: string;
    status: string;
    createdAt: string;
    student?: {
        firstName?: string;
        lastName?: string;
        department?: string;
        year?: string;
        phone?: string;
        regNumber?: string;
        roomNo?: number;
        block?: string;
    };
}

const CATEGORIES = ['Food', 'Cleanliness', 'Security', 'Others'];

const getTargetCategory = (area?: string) => {
    if (!area) return 'Others';
    const a = area.toLowerCase();
    if (a.includes('food') || a.includes('mess') || a.includes('timing')) return 'Food';
    if (a.includes('clean') || a.includes('washroom') || a.includes('hygiene')) return 'Cleanliness';
    if (a.includes('security') || a.includes('safety') || a.includes('ragging') || a.includes('teasing')) return 'Security';
    return 'Others';
};

const AdminQueries: React.FC = () => {
    const [queries, setQueries] = useState<Query[]>([]);
    const [filters, setFilters] = useState(() => {
        const today = new Date();
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(today.getMonth() - 3);

        return {
            startDate: threeMonthsAgo.toISOString().split('T')[0],
            endDate: today.toISOString().split('T')[0],
            area: 'All',
            status: 'All'
        };
    });

    const [loading, setLoading] = useState(true);
    const isFetching = useRef(false);

    const fetchQueries = useCallback(async () => {
        if (isFetching.current) return;
        isFetching.current = true;
        setLoading(true);
        try {
            const params: any = {};
            if (filters.startDate) params.startDate = filters.startDate;
            if (filters.endDate) params.endDate = filters.endDate;
            if (filters.area !== 'All') params.queryArea = filters.area;
            if (filters.status !== 'All') params.status = filters.status;

            const response = await apiClient.get('/admin/queries', { params });
            const queriesData = Array.isArray(response.data) ? response.data : (response.data?.data || []);
            setQueries(queriesData);
        } catch (error) {
            console.error('Error fetching queries:', error);
            toast.error('Failed to load queries');
            setQueries([]);
        } finally {
            setLoading(false);
            isFetching.current = false;
        }
    }, [filters]);

    useEffect(() => {
        fetchQueries();
    }, [fetchQueries]);

    const markAsResolved = async (id: string) => {
        const resolveToast = toast.loading('Marking as resolved...');
        try {
            await apiClient.put(`/admin/queries/${id}/resolve`);
            toast.success('Query resolved!', { id: resolveToast });
            fetchQueries();
        } catch (error) {
            toast.error('Failed to resolve', { id: resolveToast });
        }
    };

    const getAreaIcon = (area?: string) => {
        switch (area) {
            case 'Food': return <Utensils size={14} />;
            case 'Cleanliness': return <Droplets size={14} />;
            case 'Security': return <Shield size={14} />;
            default: return <HelpCircle size={14} />;
        }
    };

    const getStatusColor = (status: string) => {
        return status === 'RESOLVED' ? 'status-resolved' : 'status-pending';
    };

    return (
        <div className="aq-admin-container animate-fade-in">
            {/* Toolbar / Filters */}
            <div className="aq-toolbar-panel">
                {/* <div className="aq-branding-inline">
                    <img src="/images/logos/tpgit_logo.png" alt="Logo" className="aq-mini-logo" />
                    <h2 className="aq-toolbar-title">Inquiry Management</h2>
                </div> */}

                <div className="aq-filters-row">
                    <div className="aq-filter-group">
                        <label>Range</label>
                        <div className="aq-date-inputs">
                            <input
                                type="date"
                                value={filters.startDate}
                                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                            />
                            <span>to</span>
                            <input
                                type="date"
                                value={filters.endDate}
                                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="aq-filter-group">
                        <label>Category</label>
                        <select
                            value={filters.area}
                            onChange={(e) => setFilters({ ...filters, area: e.target.value })}
                        >
                            <option value="All">All Categories</option>
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <div className="aq-filter-group">
                        <label>Status</label>
                        <div className="aq-status-toggle">
                            <button
                                className={filters.status === 'All' ? 'active' : ''}
                                onClick={() => setFilters({ ...filters, status: 'All' })}
                            >All</button>
                            <button
                                className={filters.status === 'Open' ? 'active' : ''}
                                onClick={() => setFilters({ ...filters, status: 'Open' })}
                            >Pending</button>
                            <button
                                className={filters.status === 'Resolved' ? 'active' : ''}
                                onClick={() => setFilters({ ...filters, status: 'Resolved' })}
                            >Resolved</button>

                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="aq-skeleton-loader">
                    {[1, 2, 3].map(i => <div key={i} className="aq-skeleton-card"></div>)}
                </div>
            ) : (
                <div className="aq-columns-layout no-scroll">
                    {CATEGORIES.filter(cat => filters.area === 'All' || filters.area === cat).map(category => {
                        const filtered = queries.filter((q: Query) => getTargetCategory(q.queryArea) === category);
                        return (
                            <div key={category} className="aq-column">
                                <div className="aq-column-header">
                                    <div className="aq-column-title-group">
                                        <div className="aq-area-icon-box">{getAreaIcon(category)}</div>
                                        <h3 className="aq-column-title">{category}</h3>
                                    </div>
                                    <span className="aq-column-count">{filtered.length}</span>
                                </div>

                                <div className="aq-column-body">
                                    {filtered.length === 0 ? (
                                        <div className="aq-empty-col">No {category.toLowerCase()} queries</div>
                                    ) : (
                                        filtered.map((query: Query) => (
                                            <div key={query._id} className="aq-mini-card animate-card-up">
                                                <div className="aq-card-top">
                                                    <span className={`aq-mini-status ${getStatusColor(query.status)}`}></span>
                                                    <span className="aq-card-date">{new Date(query.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <p className="aq-card-text">{query.queryText || query.message}</p>
                                                <div className="aq-card-bottom">
                                                    <div className="aq-mini-user">
                                                        <div className="aq-tiny-avatar">
                                                            {query.student?.firstName?.[0] || 'U'}
                                                        </div>
                                                        <div className="aq-user-details">
                                                            <p className="aq-user-name">{query.student?.firstName} {query.student?.lastName}</p>
                                                            <div className="aq-user-meta-grid">
                                                                <div className="aq-meta-row">
                                                                    <span>{query.student?.department}</span>
                                                                    <span className="aq-meta-divider">•</span>
                                                                    <span>{query.student?.year}</span>
                                                                </div>
                                                                <div className="aq-meta-row">
                                                                    <span className="aq-user-reg">{query.student?.regNumber}</span>
                                                                    <span className="aq-meta-divider">•</span>
                                                                    <span className="aq-user-contact">{query.student?.phone}</span>
                                                                </div>
                                                                <div className="aq-meta-row">
                                                                    <span>Room: {query.student?.roomNo}</span>
                                                                    <span className="aq-meta-divider">•</span>
                                                                    <span>{query.student?.block}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {(query.status === 'Open' || query.status === 'Reopened') && (
                                                        <button
                                                            className="aq-mini-btn aq-mini-btn-resolve"
                                                            onClick={() => markAsResolved(query._id)}
                                                            title="Mark as Resolved"
                                                        >
                                                            <CheckCircle size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default AdminQueries;
