import React, { useState, useEffect } from 'react';
import { X, Mail, Hash, Phone, Building } from 'lucide-react';
import { toast } from 'react-hot-toast';
import apiClient from '../../../api/apiClient';

interface EditStudentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    student: any;
}

const EditStudentModal: React.FC<EditStudentModalProps> = ({ isOpen, onClose, onSuccess, student }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        regnumber: '',
        department: '',
        year: '',
        roomno: '',
        block: '',
        phnnum: '',
        email: ''
    });

    useEffect(() => {
        if (student) {
            setFormData({
                firstname: student.firstName || '',
                lastname: student.lastName || '',
                regnumber: student.regNumber || '',
                department: student.department || '',
                year: student.year || '',
                roomno: student.roomNo || '',
                block: student.block || '',
                phnnum: student.phnnum || student.phone || '',
                email: student.email || ''
            });
        }
    }, [student]);

    const departments = [
        "Mechanical Engineering",
        "Computer Science Engineering",
        "Electrical and Electronics Engineering",
        "Electronics and Communication Engineering",
        "Civil Engineering"
    ];

    const years = ["I year", "II year", "III year", "IV year"];
    const blocks = ["A", "B", "C", "D"];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const editToast = toast.loading('Saving changes...');

        try {
            await apiClient.put(`/students/${student._id}`, formData);
            toast.success('Student updated successfully!', { id: editToast });
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Error updating student:', error);
            toast.error(error.response?.data?.message || 'Failed to update student', { id: editToast });
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !student) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white w-full max-w-3xl rounded-[2rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-fade-in-up">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
                    <div>
                        <h2 className="text-2xl font-display font-black text-gray-900 tracking-tight">Edit Student</h2>
                        <p className="text-sm font-medium text-gray-500 mt-1">Update hostel resident details</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all">
                        <X size={24} />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-6 md:p-8 overflow-y-auto space-y-8 flex-1 custom-scrollbar">

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Personal Details */}
                        <div className="space-y-5">
                            <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Personal Details</h3>

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
                                        {/* <option value="">Select Dept</option> */}
                                        {departments.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Year</label>
                                    <select required name="year" value={formData.year} onChange={handleInputChange} className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm font-medium">
                                        {/* <option value="">Select Year</option> */}
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
                                        {/* <option value="">Select Block</option> */}
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

                    <div className="pt-6 border-t flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="px-8 py-3 rounded-xl font-bold text-white bg-gray-900 hover:bg-black disabled:opacity-50 transition-colors">
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditStudentModal;
