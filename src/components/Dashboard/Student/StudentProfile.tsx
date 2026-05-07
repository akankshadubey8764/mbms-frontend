import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Building, Hash, GraduationCap, Calendar, Save, Upload, AlertCircle, CheckCircle2, BadgeCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import apiClient from '../../../api/apiClient';
import './StudentProfile.css';

interface StudentData {
    _id: string;
    firstName: string;
    lastName: string;
    regNumber: string;
    department: string;
    year: string;
    roomNo: number;
    block: string;
    email: string;
    phone: string;
    photo?: string;
    is_Approved: boolean;
}

const StudentProfile: React.FC = () => {
    const [student, setStudent] = useState<StudentData | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [photoPreview, setPhotoPreview] = useState<string>('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await apiClient.get('/students/profile');
            setStudent(response.data);
            if (response.data.photo) {
                setPhotoPreview(response.data.photo);
            }
        } catch (error) {
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (!student) return;
        const { name, value } = e.target;
        setStudent({ ...student, [name]: value });
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error('Image size should be less than 2MB');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setPhotoPreview(base64String);
                setStudent(prev => prev ? { ...prev, photo: base64String } : null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!student) return;

        setSaving(true);
        try {
            await apiClient.put(`/students/${student._id}`, student);
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="sp-loading">
            <div className="sp-spinner"></div>
        </div>
    );

    if (!student) return <div className="sp-error">No profile data found.</div>;

    return (
        <div className="sp-wrapper">
            {/* <div className="sp-page-header">
                <h1 className="sp-page-title">Personal Profile</h1>
                <p className="sp-page-subtitle">View and update your institutional records</p>
            </div> */}

            <div className="sp-layout">
                {/* Left Side: Summary Card */}
                <div className="sp-side-panel">
                    <div className="sp-profile-card">
                        <div className="sp-photo-container">
                            <img
                                src={photoPreview || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'}
                                alt="Student"
                                className="sp-avatar"
                            />
                            <label className="sp-photo-edit-btn">
                                <Upload size={14} />
                                <input type="file" hidden accept="image/*" onChange={handlePhotoChange} />
                            </label>
                        </div>

                        <div className="sp-identity-info">
                            <h2 className="sp-full-name">{student.firstName} {student.lastName}</h2>
                            <p className="sp-id-tag">{student.regNumber}</p>
                        </div>

                        <div className={`sp-status-chip ${student.is_Approved ? 'approved' : 'pending'}`}>
                            {student.is_Approved ? (
                                <><BadgeCheck size={14} /> <span>Verified</span></>
                            ) : (
                                <><AlertCircle size={14} /> <span>Pending</span></>
                            )}
                        </div>

                        {!student.is_Approved && (
                            <div className="sp-notice-box">
                                <p>Under Review</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Detailed Form in Multi-Column */}
                <div className="sp-main-content">
                    <form onSubmit={handleUpdate} className="sp-edit-form">
                        <div className="sp-form-sections-grid">
                            <section className="sp-form-section">
                                <div className="sp-section-head">
                                    <User size={16} />
                                    <h3>Basic Info</h3>
                                </div>
                                <div className="sp-input-grid">
                                    <FormInput label="First Name" name="firstName" value={student.firstName} onChange={handleInputChange} disabled={!student.is_Approved} />
                                    <FormInput label="Last Name" name="lastName" value={student.lastName} onChange={handleInputChange} disabled={!student.is_Approved} />
                                    <FormInput label="Department" name="department" value={student.department} onChange={handleInputChange} disabled={!student.is_Approved} />
                                    <FormInput label="Year" name="year" value={student.year} onChange={handleInputChange} disabled={!student.is_Approved} />
                                </div>
                            </section>

                            <section className="sp-form-section">
                                <div className="sp-section-head">
                                    <Building size={16} />
                                    <h3>Hostel & Contact</h3>
                                </div>
                                <div className="sp-input-grid">
                                    <FormInput label="Hostel Block" name="block" value={student.block} onChange={handleInputChange} />
                                    <FormInput label="Room No" name="roomNo" value={student.roomNo?.toString()} onChange={handleInputChange} type="number" />
                                    <FormInput label="Email" name="email" value={student.email} onChange={handleInputChange} type="email" />
                                    <FormInput label="Phone" name="phone" value={student.phone} onChange={handleInputChange} type="tel" />
                                </div>
                            </section>
                        </div>

                        <div className="sp-form-actions">
                            <button type="submit" className="sp-submit-button" disabled={saving}>
                                {saving ? 'Saving...' : 'Save Profile'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

interface FormInputProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    disabled?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({ label, name, value, onChange, type = 'text', disabled }) => (
    <div className="sp-input-group">
        <label className="sp-input-label">{label}</label>
        <input
            className="sp-text-input"
            type={type}
            name={name}
            value={value || ''}
            onChange={onChange}
            disabled={disabled}
            placeholder={`Enter ${label.toLowerCase()}`}
        />
    </div>
);

export default StudentProfile;
