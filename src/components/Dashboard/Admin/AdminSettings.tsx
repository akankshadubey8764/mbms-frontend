import React, { useState } from 'react';
import { Lock, ShieldAlert, KeyRound, Monitor, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';
import apiClient from '../../../api/apiClient';
import './AdminSettings.css';

const AdminSettings: React.FC = () => {
    const [activeTab, setActiveTab] = useState('Security');
    const [passwordData, setPasswordData] = useState({
        current: '',
        new: '',
        confirm: ''
    });
    const [newAdmin, setNewAdmin] = useState({
        username: '',
        email: '',
        password: '',
        role: 'admin'
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

    const handleAddAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const adminToast = toast.loading('Creating administrative user...');
        try {
            await apiClient.post('/admin/add-user', newAdmin);
            toast.success("New administrative user created!", { id: adminToast });
            setNewAdmin({ username: '', email: '', password: '', role: 'admin' });
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to create user", { id: adminToast });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="as-container">
            <div className="as-layout-grid">
                {/* Navigation / Sections */}
                <div className="as-sidebar">
                    <SettingsTab
                        active={activeTab === 'Security'}
                        icon={KeyRound}
                        label="Security"
                        description="Password & Auth"
                        onClick={() => setActiveTab('Security')}
                    />
                    <SettingsTab
                        active={activeTab === 'Admins'}
                        icon={ShieldAlert}
                        label="Add Admin"
                        description="User permissions"
                        onClick={() => setActiveTab('Admins')}
                    />
                    <SettingsTab
                        active={activeTab === 'Display'}
                        icon={Monitor}
                        label="Display"
                        description="Interface prefs"
                        onClick={() => setActiveTab('Display')}
                    />
                </div>

                {/* Active Section Panes */}
                <div className="as-content">
                    {activeTab === 'Security' && (
                        <>
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
                                            <span>{loading ? 'Updating...' : 'Save Password Changes'}</span>
                                        </button>
                                    </div>
                                </form>
                            </div>

                            <div className="as-notice-card">
                                <h3 className="as-notice-title">Security Notice</h3>
                                <p className="as-notice-text">
                                    Administrative password updates trigger security alerts. Ensure you verify your new credentials.
                                </p>
                            </div>
                        </>
                    )}

                    {activeTab === 'Admins' && (
                        <div className="as-card animate-fade-in">
                            <div className="as-card-header">
                                <div className="as-card-icon">
                                    <ShieldAlert size={20} />
                                </div>
                                <h2 className="as-card-title">Add New Administrator</h2>
                            </div>

                            <form onSubmit={handleAddAdmin} className="as-form">
                                <div className="as-input-grid">
                                    <SettingsInput
                                        label="Username"
                                        type="text"
                                        value={newAdmin.username}
                                        onChange={(v) => setNewAdmin({ ...newAdmin, username: v })}
                                    />
                                    <SettingsInput
                                        label="Email Address"
                                        type="email"
                                        value={newAdmin.email}
                                        onChange={(v) => setNewAdmin({ ...newAdmin, email: v })}
                                    />
                                </div>
                                <div className="as-input-grid">
                                    <SettingsInput
                                        label="Initial Password"
                                        type="password"
                                        value={newAdmin.password}
                                        onChange={(v) => setNewAdmin({ ...newAdmin, password: v })}
                                    />
                                    <div className="as-input-group">
                                        <label className="as-label">Role</label>
                                        <select
                                            value={newAdmin.role}
                                            onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                                            className="as-input"
                                        >
                                            <option value="admin">System Admin</option>
                                            <option value="mess_admin">Mess Admin</option>
                                            <option value="mess_manager">Mess Manager</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="as-submit-actions">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="as-submit-btn"
                                    >
                                        <Save size={16} />
                                        <span>{loading ? 'Creating...' : 'Create Administrative User'}</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeTab === 'Display' && (
                        <div className="as-card animate-fade-in">
                            <div className="as-card-header">
                                <div className="as-card-icon">
                                    <Monitor size={20} />
                                </div>
                                <h2 className="as-card-title">Interface Preferences</h2>
                            </div>
                            <p className="as-notice-text" style={{ padding: '20px' }}>
                                Interface customization and Theme settings will be available in the next update.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const SettingsTab: React.FC<{ icon: any; label: string; description: string; active?: boolean; onClick: () => void }> = ({ icon: Icon, label, description, active, onClick }) => (
    <button className={`as-tab-btn ${active ? 'active' : ''}`} onClick={onClick}>
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
