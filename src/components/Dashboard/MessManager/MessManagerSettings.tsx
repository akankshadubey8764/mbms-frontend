import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import apiClient from '../../../api/apiClient';

const MessManagerSettings: React.FC = () => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        setLoading(true);
        const changeToast = toast.loading('Updating password...');
        try {
            // Using the same password update endpoint as students but for mess manager
            await apiClient.post('/auth/password', {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
            });
            setSuccess(true);
            toast.success('Password updated successfully', { id: changeToast });
            setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setTimeout(() => setSuccess(false), 5000);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update password', { id: changeToast });
        } finally {
            setLoading(false);
        }
    };

    const toggleShow = (field: keyof typeof showPasswords) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    return (
        <div className="max-w-2xl mx-auto animate-fade-in py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-[#0f172a] tracking-tight">Account Security</h1>
                <p className="text-[#64748b] mt-2">Manage your password and security settings</p>
            </div>

            {success && (
                <div className="mb-8 bg-emerald-50 border border-emerald-100 rounded-2xl p-6 flex items-center space-x-4 animate-bounce-in shadow-sm">
                    <div className="p-2 bg-emerald-500 rounded-lg text-white">
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <p className="text-emerald-900 font-bold">Update Successful!</p>
                        <p className="text-emerald-700 text-sm">Your password has been securely modified.</p>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <div className="p-8 md:p-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <PasswordField
                            label="Current Password"
                            value={formData.currentPassword}
                            onChange={(val) => setFormData({ ...formData, currentPassword: val })}
                            show={showPasswords.current}
                            onToggle={() => toggleShow('current')}
                        />

                        <div className="h-px bg-slate-100"></div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <PasswordField
                                label="New Password"
                                value={formData.newPassword}
                                onChange={(val) => setFormData({ ...formData, newPassword: val })}
                                show={showPasswords.new}
                                onToggle={() => toggleShow('new')}
                            />

                            <PasswordField
                                label="Confirm New Password"
                                value={formData.confirmPassword}
                                onChange={(val) => setFormData({ ...formData, confirmPassword: val })}
                                show={showPasswords.confirm}
                                onToggle={() => toggleShow('confirm')}
                            />
                        </div>

                        <div className="bg-blue-50/50 rounded-2xl p-5 flex items-start space-x-4 border border-blue-100/50">
                            <AlertCircle size={20} className="text-blue-500 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <p className="text-xs font-bold uppercase tracking-wider text-blue-700">Security Guidance</p>
                                <p className="text-[13px] text-blue-600/80 leading-relaxed font-medium">
                                    Use a strong password with at least 8 characters, including numbers and symbols.
                                </p>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-[#0f172a] text-white rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-blue-600 transition-all duration-300 shadow-xl shadow-slate-900/10 disabled:opacity-50 mt-4 active:scale-95"
                        >
                            {loading ? 'Processing...' : 'Apply Security Changes'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Additional Info */}
            <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-200">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">Session Information</h3>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500 font-medium">Account Role</span>
                        <span className="text-slate-900 font-bold uppercase">{localStorage.getItem('userRole')?.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500 font-medium">Last Login</span>
                        <span className="text-slate-900 font-bold">Just now</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface PasswordFieldProps {
    label: string;
    value: string;
    onChange: (val: string) => void;
    show: boolean;
    onToggle: () => void;
}

const PasswordField: React.FC<PasswordFieldProps> = ({ label, value, onChange, show, onToggle }) => (
    <div className="space-y-2">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>
        <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                <Lock size={18} />
            </div>
            <input
                type={show ? 'text' : 'password'}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full h-14 pl-12 pr-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300 font-medium text-slate-900 placeholder-slate-300 outline-none"
                placeholder="••••••••••••"
                required
            />
            <button
                type="button"
                onClick={onToggle}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-900 transition-colors"
                title={show ? "Hide password" : "Show password"}
            >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
        </div>
    </div>
);

export default MessManagerSettings;
