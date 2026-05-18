import React, { useState } from 'react';
import { Lock, ShieldAlert, KeyRound, Monitor, Save, Zap, Play, Clock, Trash2 } from 'lucide-react';
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
    const [triggerLoading, setTriggerLoading] = useState<string | null>(null);

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.new !== passwordData.confirm) {
            toast.error("Passwords mismatch");
            return;
        }
        setLoading(true);
        const settingsToast = toast.loading('Updating password...');
        try {
            await apiClient.post('/auth/password', {
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

    const handleTriggerBilling = async () => {
        if (!window.confirm("Are you sure you want to trigger the Monthly Mess Bill Calculation manually? This will generate bills for the previous month for all approved students.")) return;
        
        setTriggerLoading('billing');
        const billingToast = toast.loading('Generating mess bills...');
        try {
            const response = await apiClient.post('/automation/trigger-billing');
            toast.success(response.data.message || "Bills generated successfully", { id: billingToast });
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to trigger billing", { id: billingToast });
        } finally {
            setTriggerLoading(null);
        }
    };

    const handleTriggerOverdue = async () => {
        setTriggerLoading('overdue');
        const overdueToast = toast.loading('Checking for overdue queries...');
        try {
            const response = await apiClient.post('/automation/trigger-overdue');
            toast.success(`Scan complete! ${response.data.updatedCount} queries updated to overdue.`, { id: overdueToast });
        } catch (error: any) {
            toast.error("Failed to check for overdue queries", { id: overdueToast });
        } finally {
            setTriggerLoading(null);
        }
    };

    const handleTriggerStaleCleanup = async () => {
        if (!window.confirm("Are you sure? This will auto-reject all registration requests older than 30 days.")) return;
        
        setTriggerLoading('stale');
        const staleToast = toast.loading('Cleaning up stale registrations...');
        try {
            const response = await apiClient.post('/automation/trigger-stale-cleanup');
            toast.success(`Cleanup complete! ${response.data.updatedCount} stale requests rejected.`, { id: staleToast });
        } catch (error: any) {
            toast.error("Failed to cleanup registrations", { id: staleToast });
        } finally {
            setTriggerLoading(null);
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
                        active={activeTab === 'Automation'}
                        icon={Zap}
                        label="Automation"
                        description="Cron & Tasks"
                        onClick={() => setActiveTab('Automation')}
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

                    {activeTab === 'Automation' && (
                        <div className="as-card animate-fade-in">
                            <div className="as-card-header">
                                <div className="as-card-icon">
                                    <Zap size={20} />
                                </div>
                                <h2 className="as-card-title">Automation & Cron Triggers</h2>
                            </div>
                            
                            <div className="as-automation-grid">
                                <div className="as-auto-card">
                                    <div className="as-auto-info">
                                        <div className="as-auto-icon billing">
                                            <Save size={24} />
                                        </div>
                                        <div>
                                            <h4>Monthly Billing</h4>
                                            <p>Generates mess bills for the previous month for all approved students.</p>
                                        </div>
                                    </div>
                                    <button 
                                        className="as-trigger-btn"
                                        onClick={handleTriggerBilling}
                                        disabled={!!triggerLoading}
                                    >
                                        {triggerLoading === 'billing' ? (
                                            <div className="spinner-small" />
                                        ) : (
                                            <><Play size={16} /> <span>Trigger Now</span></>
                                        )}
                                    </button>
                                </div>

                                <div className="as-auto-card">
                                    <div className="as-auto-info">
                                        <div className="as-auto-icon overdue">
                                            <Clock size={24} />
                                        </div>
                                        <div>
                                            <h4>Overdue Check</h4>
                                            <p>Scans open queries and marks those older than 48 hours as Overdue.</p>
                                        </div>
                                    </div>
                                    <button 
                                        className="as-trigger-btn"
                                        onClick={handleTriggerOverdue}
                                        disabled={!!triggerLoading}
                                    >
                                        {triggerLoading === 'overdue' ? (
                                            <div className="spinner-small" />
                                        ) : (
                                            <><Play size={16} /> <span>Trigger Now</span></>
                                        )}
                                    </button>
                                </div>

                                <div className="as-auto-card">
                                    <div className="as-auto-info">
                                        <div className="as-auto-icon cleanup">
                                            <Trash2 size={24} />
                                        </div>
                                        <div>
                                            <h4>Stale Cleanup</h4>
                                            <p>Auto-rejects registration requests that have been pending for over 30 days.</p>
                                        </div>
                                    </div>
                                    <button 
                                        className="as-trigger-btn"
                                        onClick={handleTriggerStaleCleanup}
                                        disabled={!!triggerLoading}
                                    >
                                        {triggerLoading === 'stale' ? (
                                            <div className="spinner-small" />
                                        ) : (
                                            <><Play size={16} /> <span>Trigger Now</span></>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="as-notice-card warning" style={{ marginTop: '20px' }}>
                                <h3 className="as-notice-title">Developer Note</h3>
                                <p className="as-notice-text">
                                    These actions are irreversible. Billing generation should only be triggered once per month in production.
                                </p>
                            </div>
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
