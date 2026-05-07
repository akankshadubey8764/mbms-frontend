import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import apiClient from '../../../api/apiClient';
import './MessManagerSettings.css';

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
        <div className="mms-wrapper">
            {success && (
                <div className="mms-success-alert">
                    <div className="mms-success-icon-box">
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <p className="mms-success-text-bold">Update Successful!</p>
                        <p className="mms-success-text-sm">Your password has been securely modified.</p>
                    </div>
                </div>
            )}

            <div className="mms-card">
                <div className="mms-card-body">
                    <form onSubmit={handleSubmit} className="mms-form">
                        <PasswordField
                            label="Current Password"
                            value={formData.currentPassword}
                            onChange={(val) => setFormData({ ...formData, currentPassword: val })}
                            show={showPasswords.current}
                            onToggle={() => toggleShow('current')}
                        />

                        <div className="mms-divider"></div>

                        <div className="mms-password-grid">
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

                        <div className="mms-guidance">
                            <AlertCircle size={20} className="mms-guidance-icon" />
                            <div>
                                <p className="mms-guidance-title">Security Guidance</p>
                                <p className="mms-guidance-text">
                                    Use a strong password with at least 8 characters, including numbers and symbols.
                                </p>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mms-submit-btn"
                        >
                            {loading ? 'Processing...' : 'Apply Security Changes'}
                        </button>
                    </form>
                </div>
            </div>

            {/* <div className="mms-footer">
                <h3 className="mms-footer-title">Session Information</h3>
                <div className="mms-info-row">
                    <span className="mms-info-label">Account Role</span>
                    <span className="mms-info-value uppercase">{localStorage.getItem('userRole')?.replace('_', ' ')}</span>
                </div>
                <div className="mms-info-row">
                    <span className="mms-info-label">Last Login</span>
                    <span className="mms-info-value">Just now</span>
                </div>
            </div> */}
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
    <div className="mms-field-group">
        <label className="mms-field-label">{label}</label>
        <div className="mms-input-container">
            <div className="mms-input-icon">
                <Lock size={18} />
            </div>
            <input
                type={show ? 'text' : 'password'}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="mms-input"
                placeholder="••••••••••••"
                required
            />
            <button
                type="button"
                onClick={onToggle}
                className="mms-toggle-btn"
                title={show ? "Hide password" : "Show password"}
            >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
        </div>
    </div>
);

export default MessManagerSettings;
