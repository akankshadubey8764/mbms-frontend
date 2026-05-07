import React, { useState } from 'react';
import { Upload, Mail, Phone, Building, Hash, User, GraduationCap, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';
import Logo from '../assets/images/logos/tpgit_logo.png';
import { toast } from 'react-hot-toast';
import apiClient from '../api/apiClient';
import { useNavigate } from 'react-router-dom';
import './RegistrationForm.css';

interface FormData {
    firstName: string;
    lastName: string;
    regNumber: string;
    department: string;
    year: string;
    roomNo: string;
    block: string;
    email: string;
    phoneNumber: string;
    userId: string;
    password: string;
    confirmPassword: string;
    photo: File | null;
}

const RegistrationForm: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        regNumber: '',
        department: '',
        year: '',
        roomNo: '',
        block: '',
        email: '',
        phoneNumber: '',
        userId: '',
        password: '',
        confirmPassword: '',
        photo: null,
    });

    const [loading, setLoading] = useState(false);
    const [photoPreview, setPhotoPreview] = useState<string>('');

    const departments = [
        'Mechanical Engineering',
        'Electronics and Communication Engineering',
        'Electrical and Electronics Engineering',
        'Computer Science Engineering',
        'Civil Engineering',
    ];

    const blocks = ['A Block', 'B Block', 'C Block'];
    const years = ['I year', 'II year', 'III year', 'IV year'];

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('File size exceeds 5MB');
                return;
            }
            setFormData((prev) => ({ ...prev, photo: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.email.toLowerCase().endsWith('@tpgit.com')) {
            toast.error('Hostel registration is restricted to @tpgit.com email addresses.');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match!');
            return;
        }

        setLoading(true);
        const regToast = toast.loading('Registering...');

        try {
            const payload = {
                firstname: formData.firstName,
                lastname: formData.lastName,
                regnumber: formData.regNumber,
                department: formData.department,
                year: formData.year,
                roomno: Number(formData.roomNo),
                block: formData.block,
                email: formData.email,
                phnnum: formData.phoneNumber,
                username: formData.userId,
                password: formData.password,
                role: 'student',
                ...(photoPreview && { photo: photoPreview })
            };

            await apiClient.post('/auth/register', payload);

            toast.success('Registration successful! Awaiting admin approval.', { id: regToast, duration: 10000 });

            setFormData({
                firstName: '', lastName: '', regNumber: '', department: '', year: '', roomNo: '', block: '', email: '', phoneNumber: '', userId: '', password: '', confirmPassword: '', photo: null,
            });
            setPhotoPreview('');

            setTimeout(() => navigate('/login'), 2000);

        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Registration failed.', { id: regToast });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="rf-container">
            {/* Minimal Header */}
            <div className="rf-header">
                <div className="rf-header-left">
                    <img src={Logo} alt="Logo" className="rf-logo-img" />
                    <h1 className="rf-title">Hostel Registration</h1>
                </div>
                {/* <button 
                    onClick={() => navigate('/login')}
                    className="rf-back-btn"
                >
                    <ArrowLeft size={16} /> Back to Login
                </button> */}
            </div>

            <div className="rf-main-wrapper">
                <form onSubmit={handleSubmit} className="rf-form">

                    <div className="rf-grid">

                        {/* Column 1: Personal Profile */}
                        <div className="rf-section">
                            <div className="rf-section-header">
                                <User size={20} />
                                <h2 className="rf-section-title">Personal Profile</h2>
                            </div>

                            <div className="rf-field-group rf-field-group-2col">
                                <FormGroup label="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
                                <FormGroup label="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
                            </div>

                            <FormGroup label="Registration Number" name="regNumber" value={formData.regNumber} onChange={handleInputChange} placeholder="e.g. 513121106005" icon={<Hash size={16} />} required />

                            <div className="rf-field-group rf-field-group-2col">
                                <div className="rf-field-wrapper">
                                    <label className="rf-label">Department</label>
                                    <select
                                        name="department"
                                        value={formData.department}
                                        onChange={handleInputChange}
                                        className="rf-select"
                                        required
                                    >
                                        <option value="">Select Department</option>
                                        {departments.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div className="rf-field-wrapper">
                                    <label className="rf-label">Year of Study</label>
                                    <select
                                        name="year"
                                        value={formData.year}
                                        onChange={handleInputChange}
                                        className="rf-select"
                                        required
                                    >
                                        <option value="">Select Year</option>
                                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="rf-section" style={{ paddingTop: '0.5rem' }}>
                                <div className="rf-section-header">
                                    <KeyRound size={20} />
                                    <h2 className="rf-section-title">Account Credentials</h2>
                                </div>
                                <FormGroup label="User ID" name="userId" value={formData.userId} onChange={handleInputChange} placeholder="Unique User ID" required />
                                <div className="rf-field-group rf-field-group-2col">
                                    <FormGroup label="Password" name="password" value={formData.password} onChange={handleInputChange} type="password" placeholder="••••••••" required />
                                    <FormGroup label="Confirm Password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} type="password" placeholder="••••••••" required />
                                </div>
                            </div>
                        </div>

                        {/* Column 2: Accommodation & Contact */}
                        <div className="rf-section">
                            <div className="rf-section-header">
                                <Building size={20} />
                                <h2 className="rf-section-title">Hostel Details</h2>
                            </div>

                            <div className="rf-field-group rf-field-group-2col">
                                <FormGroup label="Room No" name="roomNo" value={formData.roomNo} onChange={handleInputChange} required />
                                <div className="rf-field-wrapper">
                                    <label className="rf-label">Block</label>
                                    <select
                                        name="block"
                                        value={formData.block}
                                        onChange={handleInputChange}
                                        className="rf-select"
                                        required
                                    >
                                        <option value="">Select Block</option>
                                        {blocks.map(b => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="rf-field-wrapper">
                                <label className="rf-label">Profile Photo</label>
                                <div className="rf-photo-upload-container">
                                    <label className="rf-photo-dropzone">
                                        <div className="rf-upload-icon-wrapper">
                                            <Upload className="rf-upload-icon" size={24} />
                                            <span className="rf-photo-label-text">
                                                {formData.photo ? formData.photo.name : 'Upload Profile Image'}
                                            </span>
                                        </div>
                                        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" style={{ display: 'none' }} />
                                    </label>
                                    {photoPreview && (
                                        <div className="rf-photo-preview">
                                            <img src={photoPreview} alt="Preview" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="rf-section" style={{ paddingTop: '0.5rem' }}>
                                <div className="rf-section-header">
                                    <Mail size={20} />
                                    <h2 className="rf-section-title">Contact Information</h2>
                                </div>
                                <FormGroup label="Email (@tpgit.com)" name="email" value={formData.email} onChange={handleInputChange} type="email" placeholder="example@tpgit.com" icon={<Mail size={16} />} required />
                                <FormGroup label="Contact Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} type="tel" placeholder="+91 9876543210" icon={<Phone size={16} />} required />
                            </div>
                        </div>
                    </div>

                    {/* Submit Bar */}
                    <div className="rf-submit-bar">
                        <div className="rf-disclaimer">
                            <CheckCircle2 size={14} className="rf-check-icon" />
                            <span>Please verify all details before submitting. Verification can take up to 24 hours.</span>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="rf-submit-btn"
                        >
                            {loading ? 'Processing...' : 'Submit'}
                        </button>
                    </div>
                </form>

                <footer className="rf-footer">
                    &copy; {new Date().getFullYear()} TPGIT Hostels - Mess Management System
                </footer>
            </div>
        </div>
    );
};

interface FormGroupProps {
    label: string;
    name: string;
    value: string;
    onChange: any;
    placeholder?: string;
    type?: string;
    icon?: React.ReactNode;
    required?: boolean;
}

const FormGroup: React.FC<FormGroupProps> = ({ label, name, value, onChange, placeholder, type = 'text', icon, required }) => (
    <div className="rf-field-wrapper">
        <label className="rf-label">{label}</label>
        <div className="rf-input-container">
            {icon && (
                <div className="rf-icon-wrapper">
                    {icon}
                </div>
            )}
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`rf-input ${icon ? 'rf-input-with-icon' : ''}`}
                required={required}
            />
        </div>
    </div>
);

export default RegistrationForm;
