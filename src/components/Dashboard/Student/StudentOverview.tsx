import React, { useState, useEffect } from 'react';
import { Wallet, Calendar } from 'lucide-react';
import { toast } from 'react-hot-toast';
import apiClient from '../../../api/apiClient';

interface MessBill {
    month: number;
    year: number;
    daysPresent: number;
    daysAbsent: number;
    amountIssued: number;
    amountPaid: number;
    paymentStatus: string;
}

interface StudentData {
    firstName: string;
    lastName: string;
    regNumber: string;
    department: string;
    year: string;
    roomNo: number;
    block: string;
    messBills: MessBill[];
}

const StudentOverview: React.FC = () => {
    const [studentData, setStudentData] = useState<StudentData | null>(null);
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState('');
    const [submittingFeedback, setSubmittingFeedback] = useState(false);

    useEffect(() => {
        fetchStudentData();
    }, []);

    const fetchStudentData = async () => {
        try {
            const response = await apiClient.get('/students/profile');
            setStudentData(response.data);
        } catch (error) {
            console.error('Error fetching student data:', error);
            toast.error('Failed to load profile data');
        } finally {
            setLoading(false);
        }
    };

    const handleFeedbackSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmittingFeedback(true);
        const feedbackToast = toast.loading('Submitting feedback...');
        try {
            await apiClient.post('/queries/raise_queries', {
                queryArea: 'Feedback',
                queryText: feedback
            });
            toast.success('Feedback submitted successfully!', { id: feedbackToast });
            setFeedback('');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to submit feedback', { id: feedbackToast });
        } finally {
            setSubmittingFeedback(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-600"></div>
            </div>
        );
    }

    const latestBill = studentData?.messBills?.[studentData.messBills.length - 1];

    return (
        <div className="animate-fade-in">
            {/* Welcome Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-display font-bold text-gray-900">
                    Welcome, {studentData?.firstName || 'Student'}!
                </h1>
                <p className="text-gray-600">Here's your hostel dashboard overview</p>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-6 text-white shadow-xl transform hover:scale-[1.02] transition-transform duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-white/20 rounded-xl">
                            <Wallet size={24} />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
                            {latestBill ? `Month ${latestBill.month}` : 'No Data'}
                        </span>
                    </div>
                    <h3 className="text-sm font-medium text-blue-100 mb-1 uppercase tracking-wider">Mess Bill</h3>
                    <p className="text-3xl font-bold">₹{latestBill?.amountIssued || 0}</p>
                    <p className="text-xs mt-2 opacity-80">{latestBill?.paymentStatus || 'N/A'}</p>
                </div>

                <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl p-6 text-white shadow-xl transform hover:scale-[1.02] transition-transform duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-white/20 rounded-xl">
                            <Calendar size={24} />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">Attendance</span>
                    </div>
                    <h3 className="text-sm font-medium text-emerald-100 mb-1 uppercase tracking-wider">Days Present</h3>
                    <p className="text-3xl font-bold">{latestBill?.daysPresent || 0} Days</p>
                </div>

                <div className="bg-gradient-to-br from-rose-500 to-rose-700 rounded-2xl p-6 text-white shadow-xl transform hover:scale-[1.02] transition-transform duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-white/20 rounded-xl">
                            <Calendar size={24} />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">Leave</span>
                    </div>
                    <h3 className="text-sm font-medium text-rose-100 mb-1 uppercase tracking-wider">Days Absent</h3>
                    <p className="text-3xl font-bold">{latestBill?.daysAbsent || 0} Days</p>
                </div>
            </div>

            {/* Quick Info Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Student Details Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
                            <h2 className="text-lg font-display font-bold text-gray-900">Student Information</h2>
                        </div>
                        <div className="p-6">
                            <div className="grid sm:grid-cols-2 gap-6">
                                <InfoItem label="Registration Number" value={studentData?.regNumber} />
                                <InfoItem label="Department" value={studentData?.department} />
                                <InfoItem label="Year of Study" value={studentData?.year} />
                                <InfoItem label="Room & Block" value={studentData ? `${studentData.roomNo}, ${studentData.block}` : undefined} />
                            </div>
                        </div>
                    </div>

                    {/* Feedback Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
                            <h2 className="text-lg font-display font-bold text-gray-900">Quick Feedback</h2>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleFeedbackSubmit}>
                                <textarea
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    placeholder="Any issues or suggestions? Let us know..."
                                    rows={4}
                                    className="w-full rounded-xl border-gray-200 focus:ring-primary focus:border-primary resize-none p-4 text-sm transition-all duration-300"
                                    required
                                ></textarea>
                                <button
                                    type="submit"
                                    disabled={submittingFeedback}
                                    className="mt-4 px-6 py-2 bg-primary text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-primary/30 disabled:opacity-50 transition-all duration-300"
                                >
                                    {submittingFeedback ? 'Sending...' : 'Submit Feedback'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar - Announcements or Quick Actions */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-display font-bold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="grid gap-3">
                            <ActionButton label="View Mess Menu" />
                            <ActionButton label="Pay Mess Bill" />
                            <ActionButton label="Raise Query" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const InfoItem: React.FC<{ label: string; value: string | undefined }> = ({ label, value }) => (
    <div className="space-y-1">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</p>
        <p className="text-sm font-semibold text-gray-900">{value || 'N/A'}</p>
    </div>
);

const ActionButton: React.FC<{ label: string }> = ({ label }) => (
    <button className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 text-gray-700 hover:bg-primary-600 hover:text-white transition-all duration-300 group">
        <span className="text-sm font-bold">{label}</span>
        <div className="w-8 h-8 rounded-lg bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
            →
        </div>
    </button>
);

export default StudentOverview;
