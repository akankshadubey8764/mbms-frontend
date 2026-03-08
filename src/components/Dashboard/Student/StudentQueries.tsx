import React, { useState } from 'react';
import { MessageSquare, Send, History, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import apiClient from '../../../api/apiClient';

const StudentQueries: React.FC = () => {
    const [queryText, setQueryText] = useState('');
    const [queryArea, setQueryArea] = useState('Hostel Facilities');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        const queryToast = toast.loading('Submitting your query...');
        try {
            await apiClient.post('/queries/raise_queries', {
                queryArea,
                queryText
            });
            toast.success('Your query has been submitted successfully to the administration.', { id: queryToast });
            setQueryText('');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to submit query', { id: queryToast });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto animate-fade-in">
            <div className="mb-8">
                <h1 className="text-3xl font-display font-bold text-gray-900">Support & Queries</h1>
                <p className="text-gray-600">Raise issues or ask questions regarding hostel facilities or the mess</p>
            </div>

            <div className="grid lg:grid-cols-5 gap-10">
                {/* New Query Form */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <MessageSquare size={20} />
                            </div>
                            <h2 className="text-xl font-display font-bold text-gray-900">Ask a Question</h2>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Category</label>
                                <select
                                    className="w-full rounded-2xl border-gray-100 bg-gray-50 focus:bg-white focus:ring-primary focus:border-primary transition-all duration-300 p-4 font-semibold text-gray-700"
                                    value={queryArea}
                                    onChange={(e) => setQueryArea(e.target.value)}
                                >
                                    <option value="Hostel Facilities">Hostel Facilities</option>
                                    <option value="Mess Quality">Mess Quality</option>
                                    <option value="Maintenance">Maintenance</option>
                                    <option value="Billing Issue">Billing Issue</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Your Message</label>
                                <textarea
                                    value={queryText}
                                    onChange={(e) => setQueryText(e.target.value)}
                                    placeholder="Type your query in detail here..."
                                    rows={8}
                                    className="w-full rounded-2xl border-gray-100 bg-gray-50 focus:bg-white focus:ring-primary focus:border-primary transition-all duration-300 p-5 placeholder:text-gray-300 font-medium"
                                    required
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-primary-600 transition-all duration-300 shadow-xl shadow-gray-900/10 disabled:opacity-50"
                            >
                                <Send size={18} />
                                <span>{submitting ? 'Sending...' : 'Submit Query'}</span>
                            </button>
                        </form>
                    </div>
                </div>

                {/* Info / Notice */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center space-x-3 mb-6">
                                <History size={24} className="text-primary" />
                                <h3 className="text-xl font-display font-bold">Query Guidelines</h3>
                            </div>
                            <ul className="space-y-4 text-gray-400 text-sm font-medium">
                                <li className="flex items-start space-x-3">
                                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0"></div>
                                    <span>Provide specific details (Block, Room No, exact issue) for faster resolution.</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0"></div>
                                    <span>Regular queries are answered within 24-48 working hours.</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0"></div>
                                    <span>Emergency maintenance issues should be reported to the resident warden directly.</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 flex items-start space-x-4">
                        <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={20} />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-1">Notice</p>
                            <p className="text-xs text-amber-800 leading-relaxed font-semibold">
                                Viewable query history is currently under maintenance. You will be notified via email for all resolutions.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentQueries;
