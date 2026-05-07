import React, { useState } from 'react';
import { Lock, ShieldCheck, Eye, EyeOff, Save, KeyRound, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import apiClient from '../../../api/apiClient';
import './StudentChangePassword.css';

const StudentChangePassword: React.FC = () => {
    const [passwords, setPasswords] = useState({
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswords((prev) => ({ ...prev, [name]: value }));
    };

    const toggleVisibility = (field: keyof typeof showPasswords) => {
        setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await apiClient.put('/auth/change-password', {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword,
            });
            toast.success('Password changed successfully');
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="scp-container">
            <div className="scp-card">
                <div className="scp-card-header">
                    <div className="scp-icon-box">
                        <KeyRound size={32} />
                    </div>
                    <div>
                        <h1 className="scp-title">Security Settings</h1>
                        <p className="scp-subtitle">Update your account password regularly to stay secure</p>
                    </div>
                </div>

                <div className="scp-card-body">
                    <form onSubmit={handleSubmit} className="scp-form">
                        
                        <div className="scp-field">
                            <label className="scp-label">Current Password</label>
                            <div className="scp-input-wrapper">
                                <Lock className="scp-input-icon" size={20} />
                                <input
                                    type={showPasswords.current ? 'text' : 'password'}
                                    name="currentPassword"
                                    value={passwords.currentPassword}
                                    onChange={handleInputChange}
                                    placeholder="Enter your current password"
                                    className="scp-input"
                                    required
                                />
                                <button type="button" onClick={() => toggleVisibility('current')} className="scp-toggle-btn">
                                    {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="scp-field">
                            <label className="scp-label">New Password</label>
                            <div className="scp-input-wrapper">
                                <ShieldCheck className="scp-input-icon" size={20} />
                                <input
                                    type={showPasswords.new ? 'text' : 'password'}
                                    name="newPassword"
                                    value={passwords.newPassword}
                                    onChange={handleInputChange}
                                    placeholder="Create a strong new password"
                                    className="scp-input"
                                    required
                                />
                                <button type="button" onClick={() => toggleVisibility('new')} className="scp-toggle-btn">
                                    {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="scp-field">
                            <label className="scp-label">Confirm New Password</label>
                            <div className="scp-input-wrapper">
                                <ShieldCheck className="scp-input-icon" size={20} />
                                <input
                                    type={showPasswords.confirm ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={passwords.confirmPassword}
                                    onChange={handleInputChange}
                                    placeholder="Repeat your new password"
                                    className="scp-input"
                                    required
                                />
                                <button type="button" onClick={() => toggleVisibility('confirm')} className="scp-toggle-btn">
                                    {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="scp-submit-btn">
                            <Save size={20} />
                            <span>{loading ? 'Securing Account...' : 'Update Password'}</span>
                        </button>
                    </form>

                    <div className="scp-security-tip">
                        <AlertCircle className="scp-tip-icon" size={24} />
                        <div>
                            <h4 className="scp-tip-title">Strong Password Tip</h4>
                            <p className="scp-tip-text">Make sure your new password is at least 8 characters long and includes a mix of uppercase letters, numbers, and symbols for maximum security.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentChangePassword;
