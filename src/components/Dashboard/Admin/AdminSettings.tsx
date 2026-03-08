import React, { useState } from 'react';
import { Lock, ShieldAlert, KeyRound, Monitor, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';
import apiClient from '../../../api/apiClient';
import './AdminSettings.css';

const AdminSettings: React.FC = () => {
    const [passwordData, setPasswordData] = useState({
        current: '',
        new: '',
        confirm: ''
    });
    const [loading, setLoading] = useState(false);

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.new !== passwordData.confirm) {
            toast.error("Passwords mismatch");
            return;
        }
        setLoading(true);
        const settingsToast = toast.loading('Updating password...');
        try {
            await apiClient.put('/auth/update-password', {
                currentPassword: passwordData.current,
                newPassword: passwordData.new
            });
            toast.success("Password updated successfully", { id: settingsToast });
            setPasswordData({ current: '', new: '', confirm: '' });
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update password", { id: settingsToast });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="as-container">
            {/* <div className="as-header">
                <h1 className="as-title">System Settings</h1>
                <p className="as-subtitle">Manage your administrative account and system-wide configurations</p>
            </div> */}

            <div className="as-layout-grid">
                {/* Navigation / Sections */}
                <div className="as-sidebar">
                    <SettingsTab active icon={KeyRound} label="Security" description="Password & Auth" />
                    <SettingsTab icon={Monitor} label="Display" description="Interface prefs" />
                    <SettingsTab icon={ShieldAlert} label="Permissions" description="User roles" />
                </div>

                {/* Active Section Panes */}
                <div className="as-content">
                    {/* Password Section */}
                    <div className="as-card">
                        <div className="as-card-header">
                            <div className="as-card-icon">
                                <Lock size={20} />
                            </div>
                            <h2 className="as-card-title">Change Admin Password</h2>
                        </div>

                        <form onSubmit={handlePasswordUpdate} className="as-form">
                            <SettingsInput
                                label="Current Password"
                                type="password"
                                value={passwordData.current}
                                onChange={(v) => setPasswordData({ ...passwordData, current: v })}
                            />
                            <div className="as-input-grid">
                                <SettingsInput
                                    label="New Password"
                                    type="password"
                                    value={passwordData.new}
                                    onChange={(v) => setPasswordData({ ...passwordData, new: v })}
                                />
                                <SettingsInput
                                    label="Confirm New"
                                    type="password"
                                    value={passwordData.confirm}
                                    onChange={(v) => setPasswordData({ ...passwordData, confirm: v })}
                                />
                            </div>

                            <div className="as-submit-actions">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="as-submit-btn"
                                >
                                    <Save size={16} />
                                    <span>{loading ? 'Updating...' : 'Save Password Policies'}</span>
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Notification Config */}
                    <div className="as-notice-card">
                        <h3 className="as-notice-title">Security Notice</h3>
                        <p className="as-notice-text">
                            Administrative password updates trigger a security alert to all other system admins. Session will be invalidated on all other devices.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SettingsTab: React.FC<{ icon: any; label: string; description: string; active?: boolean }> = ({ icon: Icon, label, description, active }) => (
    <button className={`as-tab-btn ${active ? 'active' : ''}`}>
        <div className="as-tab-icon">
            <Icon size={20} />
        </div>
        <div>
            <p className="as-tab-label">{label}</p>
            <p className="as-tab-desc">{description}</p>
        </div>
    </button>
);

const SettingsInput: React.FC<{ label: string; type: string; value: string; onChange: (v: string) => void }> = ({ label, type, value, onChange }) => (
    <div className="as-input-group">
        <label className="as-label">{label}</label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="as-input"
            placeholder="••••••••"
            required
        />
    </div>
);

export default AdminSettings;
