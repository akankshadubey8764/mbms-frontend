import React, { useState, useEffect } from 'react';
import {
    UserCheck, UserX, ShieldCheck, Clock, UserPlus, X,
    ChevronLeft, ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '../../../api/apiClient';
import './AdminApprovals.css';

interface StudentData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    regNumber: string;
    department: string;
    year: string;
    roomNo: number;
    block: string;
    userId: string;
    password?: string;
    confirmPassword?: string;
    photo?: File | null;
}

interface Request {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    regNumber: string;
    department: string;
    year: string;
    roomNo: number;
    block: string;
    phone: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    createdAt: string;
}

const AdminApprovals: React.FC = () => {
    const [requests, setRequests] = useState<Request[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const initialStudentState: StudentData = {
        firstName: '', lastName: '', email: '', phone: '', regNumber: '',
        department: 'Computer Science', year: '1st Year', roomNo: 0, block: 'A-Block',
        userId: '', password: '', confirmPassword: '', photo: null
    };

    const [newStudent, setNewStudent] = useState<StudentData>(initialStudentState);
    const isFetching = React.useRef(false);

    const fetchRequests = React.useCallback(async () => {
        if (isFetching.current) return;
        isFetching.current = true;
        setLoading(true);
        try {
            const skip = (currentPage - 1) * limit;
            const response = await apiClient.get('/admin/pending-approvals', {
                params: { skip, limit }
            });
            if (response.data && response.data.data) {
                setRequests(response.data.data);
                setTotal(response.data.total);
            } else {
                setRequests([]);
                setTotal(0);
            }
        } catch (error) {
            console.error('Error fetching requests:', error);
            toast.error('Failed to fetch requests');
            setRequests([]);
            setTotal(0);
        } finally {
            setLoading(false);
            isFetching.current = false;
        }
    }, [currentPage, limit]);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const handleAction = async (id: string, action: 'approve' | 'reject') => {
        const loadingToast = toast.loading(`${action === 'approve' ? 'Approving' : 'Rejecting'} student...`);
        try {
            if (action === 'approve') {
                await apiClient.post(`/ admin / requests / ${id}/approve`);
            } else {
                // Reject usually needs a reason in some backends, but here we use DELETE or POST
                // Based on adminRoutes.js line 44, it's DELETE /requests/:id/reject with reason in body
                await apiClient.delete(`/admin/requests/${id}/reject`, {
                    data: { reason: 'Admin rejected request' }
                });
            }
            toast.success(`Student ${action === 'approve' ? 'approved' : 'rejected'} successfully!`, { id: loadingToast });
            fetchRequests();
        } catch (error: any) {
            toast.error(error.response?.data?.message || `Failed to ${action} student`, { id: loadingToast });
        }
    };

    const handleManualRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newStudent.password !== newStudent.confirmPassword) {
            toast.error('Passwords do not match!');
            return;
        }

        const toastId = toast.loading('Registering student...');
        try {
            await apiClient.post('/admin/add-students', {
                email: newStudent.email,
                password: newStudent.password || 'Student@123',
                firstname: newStudent.firstName,
                lastname: newStudent.lastName,
                regnumber: newStudent.regNumber,
                department: newStudent.department,
                year: newStudent.year,
                roomno: Number(newStudent.roomNo),
                block: newStudent.block,
                phnnum: newStudent.phone,
                username: newStudent.userId || newStudent.regNumber
            });

            toast.success('Student registered successfully!', { id: toastId });
            setIsAddModalOpen(false);
            setNewStudent(initialStudentState);
            fetchRequests();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to register student', { id: toastId });
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="admin-approvals-container">
            <div className="aa-header-section">
                {/* <div>
                    <h1 className="aa-header-title">Registration Requests</h1>
                    <p className="aa-header-subtitle">Review and manage pending student applications</p>
                </div> */}
                <div className="aa-header-actions">
                    <div className="aa-stat-card">
                        <Clock className="aa-stat-icon" size={20} />
                        <div>
                            <p className="aa-stat-value">{total}</p>
                            <p className="aa-stat-label">Pending</p>
                        </div>
                    </div>
                    <button onClick={() => setIsAddModalOpen(true)} className="aa-add-student-btn">
                        <UserPlus size={18} />
                        <span>Add Student</span>
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="aa-loader-container">
                    <div className="aa-loader-spinner"></div>
                    <p className="aa-loader-text">Fetching applications...</p>
                </div>
            ) : (
                <div className="aa-content-card">
                    <div className="aa-table-wrapper">
                        <table className="aa-table">
                            <thead>
                                <tr>
                                    <th>S.No.</th>
                                    <th>Reg No.</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Dept.</th>
                                    <th>Year</th>
                                    <th>Room</th>
                                    <th>Block</th>
                                    <th>Requested On</th>
                                    <th className="actions">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.length === 0 ? (
                                    <tr>
                                        <td colSpan={11} className="aa-empty-state">
                                            <div className="aa-empty-container">
                                                <ShieldCheck size={64} className="aa-empty-icon" />
                                                <h3 className="aa-empty-title">All Caught Up!</h3>
                                                <p className="aa-empty-text">No pending registration requests at the moment.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    requests.map((request, index) => (
                                        <tr key={request._id}>
                                            <td className="aa-sno">{(currentPage - 1) * limit + index + 1}</td>
                                            <td>
                                                <div className="aa-reg-pill">{request.regNumber}</div>
                                            </td>
                                            <td>
                                                <div className="aa-user-name-cell">
                                                    <span className="aa-name-text">{request.firstName} {request.lastName}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="aa-contact-cell">
                                                    {/* <Mail size={12} className="aa-cell-icon" /> */}
                                                    <span className="aa-email-text">{request.email}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="aa-contact-cell">
                                                    {/* <Phone size={12} className="aa-cell-icon" /> */}
                                                    <span className="aa-phone-text">{request.phone}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="aa-dept-pill">{request.department}</div>
                                            </td>
                                            <td>
                                                <div className="aa-year-badge">{request.year}</div>
                                            </td>
                                            <td>
                                                <div className="aa-room-cell">
                                                    {/* <Hash size={12} className="aa-cell-icon" /> */}
                                                    <span>{request.roomNo}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="aa-block-cell">
                                                    {/* <MapPin size={12} className="aa-cell-icon" /> */}
                                                    <span>{request.block}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="aa-date-cell">
                                                    {/* <Calendar size={12} className="aa-cell-icon" /> */}
                                                    <span>{formatDate(request.createdAt)}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="aa-actions">
                                                    <button
                                                        onClick={() => handleAction(request._id, 'reject')}
                                                        className="aa-btn aa-btn-reject"
                                                        title="Reject Request"
                                                    >
                                                        <UserX size={13} />
                                                        {/* <span className="aa-btn-text">Reject</span> */}
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(request._id, 'approve')}
                                                        className="aa-btn aa-btn-approve"
                                                        title="Approve Request"
                                                    >
                                                        <UserCheck size={13} />
                                                        {/* <span className="aa-btn-text">Approve</span> */}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {total > 0 && (
                        <div className="aa-pagination">
                            <p className="aa-pagination-info">
                                Showing <span>{requests.length}</span> of <span>{total}</span> applications
                            </p>
                            <div className="aa-pagination-controls">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(p => p - 1)}
                                    className="aa-page-btn"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <span className="aa-page-current">
                                    {currentPage}
                                </span>
                                <button
                                    disabled={currentPage * limit >= total}
                                    onClick={() => setCurrentPage(p => p + 1)}
                                    className="aa-page-btn"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
            {isAddModalOpen && (
                <div className="aa-modal-overlay">
                    <div className="aa-modal-card">
                        <div className="aa-modal-header">
                            <h3>Add New Student</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="aa-modal-close">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleManualRegister} className="aa-modal-form">
                            <div className="aa-form-grid">
                                <div className="aa-input-group">
                                    <label>First Name</label>
                                    <input required value={newStudent.firstName} onChange={e => setNewStudent({ ...newStudent, firstName: e.target.value })} placeholder="Enter first name" />
                                </div>
                                <div className="aa-input-group">
                                    <label>Last Name</label>
                                    <input required value={newStudent.lastName} onChange={e => setNewStudent({ ...newStudent, lastName: e.target.value })} placeholder="Enter last name" />
                                </div>
                                <div className="aa-input-group">
                                    <label>Email ID</label>
                                    <input type="email" required value={newStudent.email} onChange={e => setNewStudent({ ...newStudent, email: e.target.value })} placeholder="example@tpgit.com" />
                                </div>
                                <div className="aa-input-group">
                                    <label>Phone Number</label>
                                    <input required value={newStudent.phone} onChange={e => setNewStudent({ ...newStudent, phone: e.target.value })} placeholder="10-digit number" />
                                </div>
                                <div className="aa-input-group">
                                    <label>Reg Number</label>
                                    <input required value={newStudent.regNumber} onChange={e => setNewStudent({ ...newStudent, regNumber: e.target.value })} placeholder="University Reg No" />
                                </div>
                                <div className="aa-input-group">
                                    <label>Username / Student ID</label>
                                    <input required value={newStudent.userId} onChange={e => setNewStudent({ ...newStudent, userId: e.target.value })} placeholder="Used for login" />
                                </div>
                                <div className="aa-input-group">
                                    <label>Department</label>
                                    <select value={newStudent.department} onChange={e => setNewStudent({ ...newStudent, department: e.target.value })}>
                                        <option value="Mechanical Engineering">Mechanical Engineering</option>
                                        <option value="Electronics and Communication Engineering">Electronics and Communication Engineering</option>
                                        <option value="Electrical and Electronics Engineering">Electrical and Electronics Engineering</option>
                                        <option value="Computer Science Engineering">Computer Science Engineering</option>
                                        <option value="Civil Engineering">Civil Engineering</option>
                                    </select>
                                </div>
                                <div className="aa-input-group">
                                    <label>Year</label>
                                    <select value={newStudent.year} onChange={e => setNewStudent({ ...newStudent, year: e.target.value })}>
                                        <option value="I year">I year</option>
                                        <option value="II year">II year</option>
                                        <option value="III year">III year</option>
                                        <option value="IV year">IV year</option>
                                    </select>
                                </div>
                                <div className="aa-input-group">
                                    <label>Room No</label>
                                    <input type="number" required value={newStudent.roomNo} onChange={e => setNewStudent({ ...newStudent, roomNo: Number(e.target.value) })} />
                                </div>
                                <div className="aa-input-group">
                                    <label>Block</label>
                                    <select value={newStudent.block} onChange={e => setNewStudent({ ...newStudent, block: e.target.value })}>
                                        <option value="A Block">A Block</option>
                                        <option value="B Block">B Block</option>
                                        <option value="C Block">C Block</option>
                                    </select>
                                </div>
                                <div className="aa-input-group">
                                    <label>Password</label>
                                    <input type="password" required value={newStudent.password} onChange={e => setNewStudent({ ...newStudent, password: e.target.value })} placeholder="Min 8 characters" />
                                </div>
                                <div className="aa-input-group">
                                    <label>Confirm Password</label>
                                    <input type="password" required value={newStudent.confirmPassword} onChange={e => setNewStudent({ ...newStudent, confirmPassword: e.target.value })} />
                                </div>
                                <div className="aa-input-group col-span-2">
                                    <label>Student Photo</label>
                                    <div className="aa-file-input-wrapper">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={e => setNewStudent({ ...newStudent, photo: e.target.files?.[0] || null })}
                                        />
                                        <p className="aa-file-hint">Optional: Max size 5MB (JPG/PNG)</p>
                                    </div>
                                </div>
                            </div>
                            <div className="aa-modal-footer">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="aa-cancel-btn">Cancel</button>
                                <button type="submit" className="aa-submit-btn">Add Student Securely</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminApprovals;
