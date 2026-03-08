import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import apiClient from '../../../api/apiClient';

const StudentChangePassword: React.FC = () => {
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
        <div className="max-w-2xl mx-auto animate-fade-in">
            <div className="mb-8">
                <h1 className="text-3xl font-display font-bold text-gray-900">Security Settings</h1>
                <p className="text-gray-600">Ensure your account remains secure by updating your password regularly</p>
            </div>

            {success && (
                <div className="mb-8 bg-emerald-50 border border-emerald-100 rounded-2xl p-6 flex items-center space-x-4 animate-bounce-in">
                    <div className="p-2 bg-emerald-500 rounded-lg text-white">
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <p className="text-emerald-900 font-bold">Password Updated Successfully!</p>
                        <p className="text-emerald-700 text-sm">Your security details have been securely modified.</p>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <div className="p-10">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <PasswordField
                            label="Current Password"
                            value={formData.currentPassword}
                            onChange={(val) => setFormData({ ...formData, currentPassword: val })}
                            show={showPasswords.current}
                            onToggle={() => toggleShow('current')}
                        />

                        <div className="h-px bg-gray-50"></div>

                        <div className="space-y-6">
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

                        <div className="bg-blue-50/50 rounded-2xl p-6 flex items-start space-x-4">
                            <AlertCircle size={20} className="text-blue-500 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <p className="text-xs font-black uppercase tracking-widest text-blue-600">Password Requirements</p>
                                <p className="text-xs text-blue-700 leading-relaxed font-medium italic">
                                    Must be at least 6 characters long as per system policy.
                                </p>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:bg-primary-600 transition-all duration-300 shadow-xl shadow-gray-900/10 disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : 'Secure & Update Password'}
                        </button>
                    </form>
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
        <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">{label}</label>
        <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors">
                <Lock size={18} />
            </div>
            <input
                type={show ? 'text' : 'password'}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full h-14 pl-12 pr-12 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white focus:ring-primary focus:border-primary transition-all duration-300 font-medium"
                placeholder="••••••••••••"
                required
            />
            <button
                type="button"
                onClick={onToggle}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-900 transition-colors"
            >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
        </div>
    </div>
);

export default StudentChangePassword;
