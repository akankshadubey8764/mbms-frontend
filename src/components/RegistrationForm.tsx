import React, { useState } from 'react';
import { Upload, Mail, Phone, Building, Hash } from 'lucide-react';
import Logo from '../assets/images/logos/tpgit_logo.png';
import { toast } from 'react-hot-toast';
import apiClient from '../api/apiClient';

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

        // Email domain validation
        if (!formData.email.toLowerCase().endsWith('@tpgit.com')) {
            toast.error('Hostel registration is restricted to @tpgit.com email addresses.');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match!');
            return;
        }

        setLoading(true);
        const regToast = toast.loading('Registering your account...');

        try {
            const formDataToSend = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== null && key !== 'confirmPassword') {
                    formDataToSend.append(key, value);
                }
            });

            await apiClient.post('/auth/register', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success('Registration successful! Your account will be activated once approved by the admin.', { id: regToast, duration: 6000 });
            // Reset form
            setFormData({
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
            setPhotoPreview('');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Registration failed. Please try again.', { id: regToast });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 animate-fade-in">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="flex justify-center items-center mb-6">
                            <div className="w-24 h-24 p-2 bg-white rounded-full shadow-lg border border-gray-100 transform hover:rotate-6 transition-transform duration-500">
                                <img src={Logo} alt="TPGIT Logo" className="w-full h-full object-contain" />
                            </div>
                        </div>
                        <h2 className="text-xl font-display font-semibold text-primary-600 uppercase tracking-widest mb-2">Thanthai Periyar Government Institute of Technology</h2>
                        <h1 className="text-3xl md:text-5xl font-display font-bold text-gray-900 mb-4">
                            Hostel Registration
                        </h1>
                        <div className="h-1 w-24 bg-primary mx-auto rounded-full mb-6"></div>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">Please provide your academic and personal details to request a room in the college hostel.</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Personal Information */}
                            <div className="bg-gray-50 rounded-xl p-6">
                                <h2 className="text-2xl font-bold text-primary-600 mb-6">Personal Information</h2>

                                <div className="mb-4">
                                    <label className="form-label">First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="form-label">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="form-label">Registration Number</label>
                                    <div className="relative">
                                        <Hash className="absolute left-3 top-3.5 text-gray-400" size={20} />
                                        <input
                                            type="text"
                                            name="regNumber"
                                            value={formData.regNumber}
                                            onChange={handleInputChange}
                                            className="form-input pl-10"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label">Department</label>
                                    <select
                                        name="department"
                                        value={formData.department}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        required
                                    >
                                        <option value="">Select Department</option>
                                        {departments.map((dept) => (
                                            <option key={dept} value={dept}>
                                                {dept}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label">Year of Study</label>
                                    <select
                                        name="year"
                                        value={formData.year}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        required
                                    >
                                        <option value="">Select Year</option>
                                        {years.map((year) => (
                                            <option key={year} value={year}>
                                                {year}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Accommodation Details */}
                            <div className="bg-gray-50 rounded-xl p-6">
                                <h2 className="text-2xl font-bold text-primary-600 mb-6">Accommodation Details</h2>

                                <div className="mb-4">
                                    <label className="form-label">Room Number</label>
                                    <div className="relative">
                                        <Building className="absolute left-3 top-3.5 text-gray-400" size={20} />
                                        <input
                                            type="text"
                                            name="roomNo"
                                            value={formData.roomNo}
                                            onChange={handleInputChange}
                                            className="form-input pl-10"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label">Block</label>
                                    <select
                                        name="block"
                                        value={formData.block}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        required
                                    >
                                        <option value="">Select Block</option>
                                        {blocks.map((block) => (
                                            <option key={block} value={block}>
                                                {block}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label">Upload Profile Image</label>
                                    <div className="flex items-center space-x-4">
                                        <label className="flex-1 cursor-pointer">
                                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary-500 transition-colors">
                                                <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                                                <span className="text-sm text-gray-600">
                                                    {formData.photo ? formData.photo.name : 'Choose file'}
                                                </span>
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                        </label>
                                        {photoPreview && (
                                            <img
                                                src={photoPreview}
                                                alt="Preview"
                                                className="w-20 h-20 rounded-lg object-cover"
                                            />
                                        )}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="form-input pl-10"
                                            placeholder="example@tpgit.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label">Contact Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3.5 text-gray-400" size={20} />
                                        <input
                                            type="tel"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleInputChange}
                                            className="form-input pl-10"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Account Information */}
                        <div className="bg-gray-50 rounded-xl p-6 mt-8">
                            <h2 className="text-2xl font-bold text-primary-600 mb-6">Account Information</h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div>
                                    <label className="form-label">User ID</label>
                                    <input
                                        type="text"
                                        name="userId"
                                        value={formData.userId}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Confirm Password</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="mt-8 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-secondary text-lg px-12 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Registering...' : 'Register'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegistrationForm;
