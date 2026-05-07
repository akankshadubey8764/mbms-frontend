import React, { useEffect, useState } from 'react';
import { Download, Wallet, Clock, CheckCircle2, ChevronRight, FileText, Calendar } from 'lucide-react';
import apiClient from '../../../api/apiClient';
import './StudentMessBill.css';

interface MessBill {
    id: string;
    month: number;
    year: number;
    daysPresent: number;
    daysAbsent: number;
    amountIssued: number;
    amountPaid: number;
    paymentStatus: string;
    isVerified: boolean;
    calculatedAt: string;
}

const StudentMessBill: React.FC = () => {
    const [bills, setBills] = useState<MessBill[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBills = async () => {
            try {
                const response = await apiClient.get('/students/mess-bills/history');
                if (response.data) {
                    setBills(response.data.reverse()); // Show latest first
                }
            } catch (error) {
                console.error('Failed to fetch mess bills', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBills();
    }, []);

    if (loading) return null;

    return (
        <div className="smb-container">
            <div className="smb-card">
                <div className="smb-card-header">
                    <div>
                        <h1 className="smb-header-title">Billing History</h1>
                        <p className="smb-header-subtitle">Detailed records of your monthly mess statements</p>
                    </div>
                </div>

                <div className="smb-card-body">
                    <div className="smb-table-wrapper">
                        <table className="smb-table">
                            <thead>
                                <tr>
                                    <th>Month/Year</th>
                                    <th>Days (P/A)</th>
                                    <th>Amount Issued</th>
                                    <th>Amount Paid</th>
                                    <th>Status</th>
                                    <th>Verified</th>
                                    <th>Calculated At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bills.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-4">No billing records found.</td>
                                    </tr>
                                ) : (
                                    bills.map((bill) => (
                                        <tr key={bill.id || bill.calculatedAt}>
                                            <td className="font-bold">
                                                {new Date(0, bill.month - 1).toLocaleString('en', { month: 'long' })} {bill.year}
                                            </td>
                                            <td>
                                                <span className="text-emerald-600">{bill.daysPresent}P</span> / <span className="text-red-600">{bill.daysAbsent}A</span>
                                            </td>
                                            <td className="font-bold">₹{bill.amountIssued}</td>
                                            <td className="text-emerald-700">₹{bill.amountPaid}</td>
                                            <td>
                                                <span className={`smb-status ${bill.paymentStatus === 'PAID' ? 'smb-status-paid' : 'smb-status-pending'}`}>
                                                    {bill.paymentStatus}
                                                </span>
                                            </td>
                                            <td>
                                                {bill.isVerified ? (
                                                    <span className="text-emerald-600 font-bold">Yes</span>
                                                ) : (
                                                    <span className="text-slate-400">No</span>
                                                )}
                                            </td>
                                            <td className="text-xs text-slate-500">
                                                {new Date(bill.calculatedAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentMessBill;
