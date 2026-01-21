import React, { useState } from 'react';
import { Upload, User, Mail, Phone, Building, Hash } from 'lucide-react';
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
                alert('File size exceeds 5MB');
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

        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        setLoading(true);

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

            alert('Registration successful! Your account will be activated once approved by the admin.');
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
            alert(error.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 animate-fade-in">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center items-center space-x-4 mb-4">
                            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-2xl">T</span>
                            </div>
                            <div className="w-12 h-12 bg-primary-700 rounded-full flex items-center justify-center">
                                <User className="text-white" size={24} />
                            </div>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                            Student Hostel Registration Form
                        </h1>
                        <p className="text-gray-600 mt-2">Fill in your details to register for hostel accommodation</p>
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
