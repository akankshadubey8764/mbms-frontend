import React, { useState, useEffect } from 'react';
import { Send, MessageCircle, Clock, AlertCircle, History, MessageSquarePlus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import apiClient from '../../../api/apiClient';
import './StudentQueries.css';

interface Query {
    _id: string;
    subject: string;
    message: string;
    status: 'pending' | 'resolved';
    createdAt: string;
    response?: string;
}

const StudentQueries: React.FC = () => {
    const [queries, setQueries] = useState<Query[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({ subject: '', message: '' });

    useEffect(() => {
        fetchQueries();
    }, []);

    const fetchQueries = async () => {
        try {
            const response = await apiClient.get('/queries/my_queries');
            setQueries(response.data);
        } catch (error) {
            // Silently fail if endpoint not ready
        } finally {
            // Loading removed
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.subject || !formData.message) {
            toast.error('Please fill in all fields');
            return;
        }

        setSubmitting(true);
        try {
            await apiClient.post('/queries/raise_queries', formData);
            toast.success('Query submitted successfully');
            setFormData({ subject: '', message: '' });
            fetchQueries();
        } catch (error) {
            toast.error('Failed to submit query');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="sq-container">
            {/* Query History Panel */}
            <div className="sq-card">
                <div className="sq-card-header">
                    <History size={20} />
                    <h2 className="sq-header-title">Query History</h2>
                </div>

                <div className="sq-card-body">
                    {queries.length === 0 ? (
                        <div className="sq-empty-state">
                            <MessageCircle className="sq-empty-icon" size={64} />
                            <p className="sq-empty-text">No queries submitted yet.</p>
                        </div>
                    ) : (
                        <div className="sq-query-list">
                            {queries.map((query) => (
                                <div key={query._id} className="sq-query-item">
                                    <div className="sq-item-header">
                                        <span className="sq-item-id">#QUERY-{query._id.slice(-6)}</span>
                                        <span className={`sq-status ${query.status === 'resolved' ? 'sq-status-resolved' : 'sq-status-pending'}`}>
                                            {query.status}
                                        </span>
                                    </div>
                                    <h3 className="sq-item-subject">{query.subject}</h3>
                                    <p className="sq-item-message">{query.message}</p>
                                    <div className="sq-item-footer">
                                        <Clock size={14} />
                                        <span>{new Date(query.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    {query.response && (
                                        <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.75rem', borderLeft: '4px solid #4f46e5' }}>
                                            <p style={{ fontSize: '0.75rem', fontWeight: '800', color: '#4f46e5', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Admin Response</p>
                                            <p style={{ fontSize: '0.875rem', color: '#1e293b', fontWeight: '500' }}>{query.response}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Submit Query Panel */}
            <div className="sq-card" style={{ height: 'fit-content' }}>
                <div className="sq-card-header">
                    <MessageSquarePlus size={20} />
                    <h2 className="sq-header-title">Help & Support</h2>
                </div>
                
                <div className="sq-card-body">
                    <form onSubmit={handleSubmit} className="sq-form">
                        <div className="sq-field">
                            <label className="sq-label">Subject</label>
                            <input 
                                type="text"
                                value={formData.subject}
                                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                placeholder="What is your issue about?"
                                className="sq-input"
                            />
                        </div>

                        <div className="sq-field">
                            <label className="sq-label">Message Details</label>
                            <textarea 
                                value={formData.message}
                                onChange={(e) => setFormData({...formData, message: e.target.value})}
                                placeholder="Describe your concern in detail..."
                                rows={8}
                                className="sq-textarea"
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={submitting}
                            className="sq-submit-btn"
                        >
                            <Send size={18} />
                            <span>{submitting ? 'Sending Request...' : 'Submit Query'}</span>
                        </button>

                        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem', backgroundColor: '#eff6ff', borderRadius: '1rem' }}>
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <AlertCircle className="text-blue-600" size={20} style={{ flexShrink: 0 }} />
                                <p style={{ fontSize: '0.75rem', color: '#1e40af', fontWeight: '500', lineHeight: '1.4' }}>
                                    Queries are usually addressed by the hostel warden within 24-48 working hours.
                                </p>
                            </div>
                            <div style={{ padding: '0.75rem', backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #dbeafe' }}>
                                <p style={{ fontSize: '0.7rem', color: '#1e40af', fontWeight: '600' }}>
                                    💡 <strong>Pro Tip:</strong> For general questions about mess rates, menu, or hostel rules, please use the <strong>AI Chatbot</strong> (bottom right) for instant answers! Only raise a query for physical issues (maintenance) or specific grievances.
                                </p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default StudentQueries;
