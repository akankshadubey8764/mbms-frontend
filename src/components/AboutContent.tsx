import { Link } from 'react-router-dom';
import { Building2, Users2 } from 'lucide-react';

const AboutContent: React.FC = () => {
    return (
        <div className="min-h-screen py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Page Title */}
                <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-gray-900">
                    About Our College Hostels
                </h1>

                {/* Introduction */}
                <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl p-8 md:p-12 mb-12 shadow-lg text-center animate-fade-in">
                    <p className="text-lg text-gray-800 leading-relaxed">
                        Welcome to our college hostels! We provide a safe, comfortable, and supportive living environment for our students. Our hostels are designed to foster a sense of community while offering all the necessary facilities to ensure a pleasant stay.
                    </p>
                </div>

                {/* Boys' Hostels */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">Boys' Hostels</h2>
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden card-hover">
                        <div className="relative h-80 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
                                <Building2 className="w-32 h-32 text-white opacity-50" />
                            </div>
                            <div className="absolute inset-0 bg-black/30"></div>
                        </div>
                        <div className="p-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Boys' Hostels</h3>
                            <p className="text-gray-700 mb-6 leading-relaxed">
                                Explore comfortable and well-facilitated boys' hostels available on campus. Our boys' hostels include GHT (Gents Hostel TPGIT) and Boys Hall 2, equipped with modern amenities, spacious rooms, and recreational facilities. Each hostel is designed to provide a conducive environment for academic excellence and personal development.
                            </p>
                            <div className="grid md:grid-cols-2 gap-4 mb-6">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-900 mb-2">Facilities</h4>
                                    <ul className="text-gray-700 space-y-1 text-sm">
                                        <li>• Spacious rooms with modern furnishings</li>
                                        <li>• High-speed internet connectivity</li>
                                        <li>• 24/7 security and CCTV surveillance</li>
                                        <li>• Common areas and study rooms</li>
                                    </ul>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-900 mb-2">Amenities</h4>
                                    <ul className="text-gray-700 space-y-1 text-sm">
                                        <li>• Mess with nutritious meals</li>
                                        <li>• Recreational facilities</li>
                                        <li>• Laundry services</li>
                                        <li>• Medical facilities on campus</li>
                                    </ul>
                                </div>
                            </div>
                            <Link to="/registration" className="btn-secondary inline-block text-center w-full md:w-auto">
                                Explore More
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Girls' Hostels */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">Girls' Hostels</h2>
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden card-hover">
                        <div className="relative h-80 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                                <Users2 className="w-32 h-32 text-white opacity-50" />
                            </div>
                            <div className="absolute inset-0 bg-black/30"></div>
                        </div>
                        <div className="p-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Girls' Hostels</h3>
                            <p className="text-gray-700 mb-6 leading-relaxed">
                                Safe and secure accommodation for female students, ensuring comfort and convenience. Our girls' hostels are designed with enhanced security measures, comfortable living spaces, and a supportive environment that promotes academic success and personal growth. The hostels feature modern amenities and are managed by dedicated staff to ensure the well-being of all residents.
                            </p>
                            <div className="grid md:grid-cols-2 gap-4 mb-6">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-900 mb-2">Security Features</h4>
                                    <ul className="text-gray-700 space-y-1 text-sm">
                                        <li>• 24/7 security personnel</li>
                                        <li>• Biometric access control</li>
                                        <li>• CCTV monitoring</li>
                                        <li>• Female wardens on duty</li>
                                    </ul>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-900 mb-2">Comfort & Care</h4>
                                    <ul className="text-gray-700 space-y-1 text-sm">
                                        <li>• Well-furnished rooms</li>
                                        <li>• Hygienic mess facilities</li>
                                        <li>• Common recreation areas</li>
                                        <li>• Counseling services available</li>
                                    </ul>
                                </div>
                            </div>
                            <Link to="/registration" className="btn-secondary inline-block text-center w-full md:w-auto">
                                Explore More
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Additional Information */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl p-8 md:p-12 shadow-xl">
                    <h2 className="text-3xl font-bold mb-6 text-center">Why Choose Our Hostels?</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">🏠</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Home Away From Home</h3>
                            <p className="text-gray-300">
                                Experience a warm, welcoming environment that makes you feel at home.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">🤝</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Community Living</h3>
                            <p className="text-gray-300">
                                Build lasting friendships and develop essential life skills through community living.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">📚</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Academic Support</h3>
                            <p className="text-gray-300">
                                Access study rooms, libraries, and a conducive environment for academic excellence.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutContent;
