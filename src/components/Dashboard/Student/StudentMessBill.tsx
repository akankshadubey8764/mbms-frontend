import React, { useEffect, useState, useRef } from 'react';
import { CheckCircle2, FileText, UploadCloud, AlertCircle, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
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
    receiptUrl?: string;
}

const StudentMessBill: React.FC = () => {
    const [bills, setBills] = useState<MessBill[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploadingFor, setUploadingFor] = useState<{month: number, year: number} | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    useEffect(() => {
        fetchBills();
    }, []);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !uploadingFor) return;

        const reader = new FileReader();
        reader.onload = async () => {
            const base64 = (reader.result as string).split(',')[1];
            const mimeType = file.type;

            const verificationToast = toast.loading('AI is verifying your receipt...');
            try {
                // Submit base64 directly to our backend for Verification + Upload
                await apiClient.post('/students/bills/upload-proof', {
                    month: uploadingFor.month,
                    year: uploadingFor.year,
                    base64Data: base64,
                    mimeType: mimeType
                });

                toast.success('Payment verified and uploaded successfully!', { id: verificationToast });
                fetchBills();
            } catch (error: any) {
                const errorMsg = error.response?.data?.message || 'Verification failed. Please ensure the receipt is clear and the amount matches.';
                toast.error(errorMsg, { id: verificationToast, duration: 5000 });
            } finally {
                setUploadingFor(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
        };
        reader.readAsDataURL(file);
    };

    if (loading) return null;

    return (
        <div className="smb-container">
            <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                accept="image/*,.pdf"
                onChange={handleFileChange}
            />

            <div className="smb-card">
                <div className="smb-card-header">
                    <div>
                        <h1 className="smb-header-title">Billing History</h1>
                        <p className="smb-header-subtitle">Detailed records of your monthly mess statements</p>
                    </div>
                    <div className="smb-header-badge">
                        <FileText size={16} />
                        <span>{bills.length} Records</span>
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
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bills.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="text-center py-4">No billing records found.</td>
                                    </tr>
                                ) : (
                                    bills.map((bill) => (
                                        <tr key={bill.id || `${bill.month}-${bill.year}`}>
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
                                                <div className="flex justify-center items-center">
                                                    {bill.isVerified ? (
                                                        <span className="text-emerald-600 font-bold flex items-center gap-1">
                                                            <CheckCircle2 size={12} /> Yes
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-400">No</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="text-xs text-slate-500">
                                                {new Date(bill.calculatedAt).toLocaleDateString()}
                                            </td>
                                            <td>
                                                <div className="flex justify-center items-center">
                                                    {bill.paymentStatus === 'PAID' ? (
                                                        <span className="text-emerald-600 text-xs font-bold flex items-center gap-1">
                                                            <CheckCircle2 size={14} /> Completed
                                                        </span>
                                                    ) : bill.receiptUrl ? (
                                                        <div className="smb-receipt-preview">
                                                            <img 
                                                                src={bill.receiptUrl} 
                                                                alt="Receipt" 
                                                                className="smb-thumb"
                                                                onClick={() => setPreviewImage(bill.receiptUrl || null)}
                                                            />
                                                            <span className="smb-pending-tag">Verifying...</span>
                                                        </div>
                                                    ) : (
                                                        <button 
                                                            className="smb-upload-btn"
                                                            onClick={() => {
                                                                setUploadingFor({ month: bill.month, year: bill.year });
                                                                fileInputRef.current?.click();
                                                            }}
                                                        >
                                                            <UploadCloud size={14} />
                                                            <span>Upload</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Reference Sample Link */}
                <div className="p-4 border-t border-slate-100 flex justify-center">
                    <button 
                        onClick={() => setPreviewImage('/src/assets/images/hostels/gpay_reference.png')}
                        className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-primary transition-colors flex items-center gap-2"
                    >
                        <FileText size={12} />
                        <span>View Sample Receipt Reference</span>
                    </button>
                </div>
            </div>

            {/* Image Preview Modal */}
            {previewImage && (
                <div className="smb-modal-overlay" onClick={() => setPreviewImage(null)}>
                    <div className="smb-modal-content" onClick={e => e.stopPropagation()}>
                        <button className="smb-modal-close" onClick={() => setPreviewImage(null)}>
                            <X size={24} />
                        </button>
                        <img src={previewImage} alt="Receipt Full" className="smb-full-img" />
                    </div>
                </div>
            )}
            
            <div className="smb-footer-note">
                <AlertCircle size={14} />
                <p>Note: Once you upload a receipt, our AI system will automatically verify the payment details. Status will be updated to "PAID" after successful verification.</p>
            </div>
        </div>
    );
};

export default StudentMessBill;
