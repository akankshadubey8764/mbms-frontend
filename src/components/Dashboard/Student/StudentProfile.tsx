import React, { useState, useEffect } from 'react';
import { User, Mail, GraduationCap, Building2, Hash, DoorOpen, Phone } from 'lucide-react';
import apiClient from '../../../api/apiClient';

interface ProfileData {
    firstName: string;
    lastName: string;
    regNumber: string;
    email: string;
    department: string;
    year: string;
    roomNo: number;
    block: string;
    phone: string;
    photo?: string;
    status: string;
}

const StudentProfile: React.FC = () => {
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await apiClient.get('/students/profile');
            setProfile(response.data);
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-600"></div>
            </div>
        );
    }

    const fullName = profile ? `${profile.firstName} ${profile.lastName}` : 'Student Name';

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="mb-8">
                <h1 className="text-3xl font-display font-bold text-gray-900">My Profile</h1>
                <p className="text-gray-600">View and manage your personal identity within the hostel</p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                {/* Profile Banner */}
                <div className="h-32 bg-gradient-to-r from-primary-600 to-primary-900 relative">
                    <div className="absolute top-4 right-6">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/20 text-white backdrop-blur-md`}>
                            Account {profile?.status || 'PENDING'}
                        </span>
                    </div>
                </div>

                <div className="px-8 pb-10">
                    <div className="relative -mt-16 mb-8 flex items-end space-x-6">
                        <div className="w-32 h-32 bg-white rounded-3xl shadow-xl p-2">
                            <div className="w-full h-full bg-gray-100 rounded-2xl flex items-center justify-center border-4 border-white overflow-hidden">
                                {profile?.photo ? (
                                    <img src={profile.photo} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={64} className="text-gray-300" />
                                )}
                            </div>
                        </div>
                        <div className="pb-2">
                            <h2 className="text-2xl font-display font-bold text-gray-900">{fullName}</h2>
                            <p className="text-primary-600 font-bold tracking-wider">{profile?.regNumber}</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <ProfileItem icon={Mail} label="Email Address" value={profile?.email} />
                        <ProfileItem icon={Phone} label="Phone Number" value={profile?.phone} />
                        <ProfileItem icon={GraduationCap} label="Department" value={profile?.department} />
                        <ProfileItem icon={Hash} label="Year of Study" value={profile?.year} />
                        <div className="grid grid-cols-2 gap-4">
                            <ProfileItem icon={DoorOpen} label="Room No" value={profile?.roomNo?.toString()} />
                            <ProfileItem icon={Building2} label="Block" value={profile?.block} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProfileItem: React.FC<{ icon: any; label: string; value: string | undefined }> = ({ icon: Icon, label, value }) => (
    <div className="flex items-start space-x-4 p-5 rounded-2xl bg-gray-50 border border-transparent hover:border-primary/20 hover:bg-white hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300 group">
        <div className="p-3 bg-white rounded-xl shadow-sm text-gray-400 group-hover:text-primary transition-colors">
            <Icon size={20} />
        </div>
        <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[2px] mb-1">{label}</p>
            <p className="text-base font-display font-bold text-gray-900">{value || 'Not provided'}</p>
        </div>
    </div>
);

export default StudentProfile;
