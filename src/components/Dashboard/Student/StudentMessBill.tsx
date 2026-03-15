import React, { useState, useEffect } from 'react';
import { Wallet, Clock, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';
import { toast } from 'react-hot-toast';
import apiClient from '../../../api/apiClient';

interface Bill {
    month: number;
    year: number;
    amountIssued: number;
    paymentStatus: 'PAID' | 'PARTIAL' | 'UNPAID';
    daysPresent: number;
    calculatedAt: string;
}

const StudentMessBill: React.FC = () => {
    const [bills, setBills] = useState<Bill[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBills();
    }, []);

    const fetchBills = async () => {
        try {
            const response = await apiClient.get('/students/mess-bills/history');
            setBills(response.data);
        } catch (error) {
            console.error('Error fetching bills:', error);
            setBills([]);
        } finally {
            setLoading(false);
        }
    };

    const handleUploadProof = async () => {
        const bill = bills[bills.length - 1];
        if (!bill) return;

        const receiptUrl = window.prompt('Please enter the receipt URL (Google Drive, Image, etc.):');
        if (!receiptUrl) return;

        const uploadToast = toast.loading('Submitting payment proof...');
        try {
            await apiClient.post('/students/bills/upload-proof', {
                month: bill.month,
                year: bill.year,
                receiptUrl
            });
            toast.success('Payment submitted successfully!', { id: uploadToast });
            fetchBills();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to submit proof', { id: uploadToast });
        }
    };

    const getMonthName = (monthNum: number) => {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return months[monthNum - 1] || "Month";
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-600"></div>
            </div>
        );
    }

    const currentBill = bills[bills.length - 1];

    return (
        <div className="animate-fade-in max-w-6xl mx-auto">
            <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-gray-900">Mess Billing</h1>
                    <p className="text-gray-600">Manage your mess expenses and payment history</p>
                </div>
                <button
                    onClick={handleUploadProof}
                    disabled={!currentBill || currentBill.paymentStatus === 'PAID'}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-2xl font-bold hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 disabled:opacity-50"
                >
                    <Wallet size={18} />
                    <span>{currentBill?.paymentStatus === 'PAID' ? 'Paid' : 'Upload Payment Proof'}</span>
                </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Outstanding Payment Card */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden sticky top-8">
                        <div className="p-8">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Active Statement</h3>
                            {currentBill ? (
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Latest Bill Amount</p>
                                        <p className="text-4xl font-display font-black text-gray-900">₹{currentBill.amountIssued}</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Clock size={16} className={currentBill.paymentStatus === 'PAID' ? 'text-emerald-500' : 'text-amber-500'} />
                                        <p className={`text-sm font-bold ${currentBill.paymentStatus === 'PAID' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                            Status: {currentBill.paymentStatus}
                                        </p>
                                    </div>
                                    <div className="pt-6 border-t border-gray-50 flex items-center justify-between text-sm">
                                        <span className="text-gray-500 font-medium">Billing Period</span>
                                        <span className="text-gray-900 font-bold">{getMonthName(currentBill.month)} {currentBill.year}</span>
                                    </div>
                                    <div className="p-4 bg-blue-50 rounded-2xl flex items-start space-x-3">
                                        <AlertCircle size={20} className="text-blue-500 shrink-0 mt-0.5" />
                                        <p className="text-xs text-blue-700 leading-relaxed font-medium">
                                            Please upload the payment receipt after completing the transaction for verification.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-10 text-gray-400">
                                    <Wallet size={48} className="mx-auto mb-4 opacity-20" />
                                    <p className="text-sm font-bold uppercase tracking-widest">No Active Bill</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Billing History Table */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                        <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
                            <h2 className="text-xl font-display font-bold text-gray-900">Transaction History</h2>
                            <div className="flex items-center space-x-2 text-primary">
                                <TrendingUp size={18} />
                                <span className="text-sm font-bold tracking-tight">Records Found: {bills.length}</span>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            {bills.length > 0 ? (
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50/50">
                                            <th className="px-8 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Period</th>
                                            <th className="px-8 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                                            <th className="px-8 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                            <th className="px-8 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Days</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {bills.map((bill, index) => (
                                            <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-8 py-5">
                                                    <p className="text-sm font-bold text-gray-900">{getMonthName(bill.month)} {bill.year}</p>
                                                    <p className="text-[10px] text-gray-400 font-medium">Calculated on {new Date(bill.calculatedAt).toLocaleDateString()}</p>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <p className="text-sm font-black text-gray-900">₹{bill.amountIssued}</p>
                                                </td>
                                                <td className="px-8 py-5">
                                                    {bill.paymentStatus === 'PAID' ? (
                                                        <span className="flex items-center w-fit space-x-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-extrabold uppercase tracking-tighter">
                                                            <CheckCircle2 size={12} />
                                                            <span>Paid</span>
                                                        </span>
                                                    ) : (
                                                        <span className={`flex items-center w-fit space-x-1 px-3 py-1 rounded-full ${bill.paymentStatus === 'PARTIAL' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'} text-[10px] font-extrabold uppercase tracking-tighter`}>
                                                            <Clock size={12} />
                                                            <span>{bill.paymentStatus}</span>
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <p className="text-xs font-bold text-gray-600">{bill.daysPresent}D Present</p>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="text-center py-20 text-gray-400">
                                    <AlertCircle size={48} className="mx-auto mb-4 opacity-20" />
                                    <p className="text-sm font-bold uppercase tracking-widest">No bill history available yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentMessBill;
