import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, History, AlertCircle, Clock, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'react-hot-toast';
import apiClient from '../../../api/apiClient';

interface Query {
    _id: string;
    queryArea: string;
    queryText: string;
    status: string;
    createdAt: string;
    response?: string;
}

const StudentQueries: React.FC = () => {
    const [queryText, setQueryText] = useState('');
    const [queryArea, setQueryArea] = useState('Food');
    const [submitting, setSubmitting] = useState(false);
    const [queries, setQueries] = useState<Query[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        fetchMyQueries();
    }, []);

    const fetchMyQueries = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/queries/my_queries');
            setQueries(response.data || []);
        } catch (error) {
            console.error('Error fetching queries:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        const queryToast = toast.loading('Submitting your query...');
        try {
            await apiClient.post('/queries/raise_queries', {
                queryArea,
                queryText
            });
            toast.success('Your query has been submitted successfully.', { id: queryToast });
            setQueryText('');
            fetchMyQueries();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to submit query', { id: queryToast });
        } finally {
            setSubmitting(false);
        }
    };

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const reopenQuery = async (id: string) => {
        const reopenToast = toast.loading('Reopening your query...');
        try {
            await apiClient.put(`/queries/${id}/reopen`);
            toast.success('Query reopened. We will look into it again.', { id: reopenToast });
            fetchMyQueries();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to reopen query', { id: reopenToast });
        }
    };

    return (
        <div className="max-w-6xl mx-auto animate-fade-in p-4 lg:p-0">
            <div className="mb-10">
                <div className="flex items-center gap-4 mb-2">
                    <img src="/images/logos/tpgit_logo.png" alt="TPGIT" className="w-12 h-12" />
                    <h1 className="text-3xl font-display font-black text-gray-900 tracking-tight">Support Center</h1>
                </div>
                <p className="text-gray-500 font-medium">TPGIT Hostel Mess - Inquiry and Feedback Portal</p>
            </div>

            <div className="grid lg:grid-cols-12 gap-10">
                {/* New Query Form */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 p-8 sticky top-8">
                        <div className="flex items-center space-x-3 mb-8">
                            <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                                <MessageSquare size={24} />
                            </div>
                            <h2 className="text-xl font-display font-black text-gray-900">New Inquiry</h2>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Area of Concern</label>
                                <select
                                    className="w-full rounded-2xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-300 p-4 font-bold text-gray-700 appearance-none"
                                    value={queryArea}
                                    onChange={(e) => setQueryArea(e.target.value)}
                                >
                                    <option value="Food">Food Quality & Mess</option>
                                    <option value="Cleanliness">Cleanliness & Hygiene</option>
                                    <option value="Security">Safety & Security</option>
                                    <option value="Others">Others</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Detailed Message</label>
                                <textarea
                                    value={queryText}
                                    onChange={(e) => setQueryText(e.target.value)}
                                    placeholder="Describe your issue or suggestion..."
                                    rows={6}
                                    className="w-full rounded-2xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-300 p-5 placeholder:text-gray-300 font-bold"
                                    required
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black flex items-center justify-center space-x-3 hover:bg-indigo-600 transition-all duration-500 shadow-xl shadow-indigo-200 group disabled:opacity-50"
                            >
                                <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                <span>{submitting ? 'SENDING...' : 'SEND MESSAGE'}</span>
                            </button>
                        </form>
                    </div>
                </div>

                {/* Query History */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                                <History size={20} />
                            </div>
                            <h3 className="text-xl font-display font-black text-gray-900">Recent Applications</h3>
                        </div>
                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{queries.length} Queries</span>
                    </div>

                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-3xl animate-pulse"></div>)}
                        </div>
                    ) : queries.length === 0 ? (
                        <div className="bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200 p-20 text-center">
                            <AlertCircle size={48} className="text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 font-bold">No inquiry history found.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {queries.map((q) => (
                                <div
                                    key={q._id}
                                    className={`bg-white rounded-[2rem] border transition-all duration-300 overflow-hidden ${expandedId === q._id ? 'border-indigo-500 shadow-xl shadow-indigo-100' : 'border-gray-100 hover:border-gray-200'}`}
                                >
                                    <div
                                        className="p-6 cursor-pointer flex items-center justify-between"
                                        onClick={() => toggleExpand(q._id)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-2xl ${q.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                                {q.status === 'RESOLVED' ? <CheckCircle size={20} /> : <Clock size={20} />}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-black text-gray-900">{q.queryArea}</h4>
                                                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${['RESOLVED', 'Resolved'].includes(q.status) ? 'bg-emerald-100 text-emerald-700' : q.status === 'Reopened' ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'}`}>
                                                        {q.status}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-400 font-bold mt-1">
                                                    Submitted on {new Date(q.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                                </p>
                                            </div>
                                        </div>
                                        {expandedId === q._id ? <ChevronUp size={20} className="text-gray-300" /> : <ChevronDown size={20} className="text-gray-300" />}
                                    </div>

                                    {expandedId === q._id && (
                                        <div className="px-6 pb-6 pt-2 border-t border-gray-50 animate-fade-in">
                                            <div className="bg-gray-50 rounded-2xl p-4 mb-4">
                                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Message</p>
                                                <p className="text-gray-700 font-medium whitespace-pre-wrap">{q.queryText}</p>
                                            </div>

                                            {['RESOLVED', 'Resolved'].includes(q.status) && (
                                                <div className="flex flex-col gap-3">
                                                    <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                                                        <p className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-2">Resolution Status</p>
                                                        <p className="text-emerald-900 font-bold">This inquiry has been addressed by the administration.</p>
                                                    </div>
                                                    <button
                                                        onClick={() => reopenQuery(q._id)}
                                                        className="w-full py-3 bg-indigo-50 text-indigo-700 rounded-xl font-bold hover:bg-indigo-100 transition-colors"
                                                    >
                                                        Need more help? Reopen this ticket
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentQueries;
