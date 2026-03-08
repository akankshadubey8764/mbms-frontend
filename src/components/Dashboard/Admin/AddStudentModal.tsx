import React, { useState } from 'react';
import { X, Hash, Building, Mail, Phone } from 'lucide-react';
import { toast } from 'react-hot-toast';
import apiClient from '../../../../src/api/apiClient';

interface AddStudentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const AddStudentModal: React.FC<AddStudentModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        regnumber: '',
        department: '',
        year: '',
        roomno: '',
        block: '',
        email: '',
        phnnum: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);

    const departments = [
        'Mechanical Engineering',
        'Electronics and Communication Engineering',
        'Electrical and Electronics Engineering',
        'Computer Science Engineering',
        'Civil Engineering',
    ];
    const blocks = ['A Block', 'B Block', 'C Block'];
    const years = ['I year', 'II year', 'III year', 'IV year'];

    if (!isOpen) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);
        const addToast = toast.loading('Adding student...');
        try {
            const body = {
                firstname: formData.firstname,
                lastname: formData.lastname,
                regnumber: formData.regnumber,
                department: formData.department,
                year: formData.year,
                roomno: Number(formData.roomno),
                block: formData.block,
                email: formData.email,
                phnnum: formData.phnnum,
                password: formData.password
            };

            await apiClient.post('/admin/add-students', body);
            toast.success('Student added successfully and is Approved!', { id: addToast });
            onSuccess();
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to add student', { id: addToast });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl p-8 animate-fade-in">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X size={24} />
                </button>

                <h2 className="text-3xl font-display font-black text-gray-900 mb-2">Add New Student</h2>
                <p className="text-gray-500 font-medium mb-8">Directly register a student into the hostel as Approved.</p>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Personal Information */}
                        <div className="space-y-5">
                            <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Personal Information</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">First Name</label>
                                    <input required type="text" name="firstname" value={formData.firstname} onChange={handleInputChange} className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm font-medium" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Last Name</label>
                                    <input required type="text" name="lastname" value={formData.lastname} onChange={handleInputChange} className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm font-medium" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Registration Number</label>
                                <div className="relative">
                                    <Hash className="absolute left-4 top-3.5 text-gray-400" size={18} />
                                    <input required type="text" name="regnumber" value={formData.regnumber} onChange={handleInputChange} className="w-full h-12 pl-11 pr-4 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm font-medium" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Department</label>
                                    <select required name="department" value={formData.department} onChange={handleInputChange} className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm font-medium">
                                        <option value="">Select Dept</option>
                                        {departments.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Year</label>
                                    <select required name="year" value={formData.year} onChange={handleInputChange} className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm font-medium">
                                        <option value="">Select Year</option>
                                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Accommodation & Contact */}
                        <div className="space-y-5">
                            <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Accommodation & Contact</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Room No.</label>
                                    <div className="relative">
                                        <Building className="absolute left-4 top-3.5 text-gray-400" size={18} />
                                        <input required type="number" name="roomno" value={formData.roomno} onChange={handleInputChange} className="w-full h-12 pl-11 pr-4 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm font-medium" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Block</label>
                                    <select required name="block" value={formData.block} onChange={handleInputChange} className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm font-medium">
                                        <option value="">Select Block</option>
                                        {blocks.map(b => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-3.5 text-gray-400" size={18} />
                                    <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full h-12 pl-11 pr-4 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm font-medium" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Contact Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-3.5 text-gray-400" size={18} />
                                    <input required type="text" name="phnnum" value={formData.phnnum} onChange={handleInputChange} className="w-full h-12 pl-11 pr-4 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm font-medium" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Account Setup</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
                                <input required type="password" name="password" value={formData.password} onChange={handleInputChange} className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm font-medium" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Confirm Password</label>
                                <input required type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm font-medium" />
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="px-8 py-3 rounded-xl font-bold text-white bg-gray-900 hover:bg-black disabled:opacity-50 transition-colors">
                            {loading ? 'Adding...' : 'Add Student'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddStudentModal;
