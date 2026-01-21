import React from 'react';
import { Link } from 'react-router-dom';
import {
    ChartLine,
    CreditCard,
    FileText,
    Fingerprint,
    History,
    Gauge,
    Bell,
    Shield,
    Users
} from 'lucide-react';

const HomeContent: React.FC = () => {
    const features = [
        {
            icon: ChartLine,
            title: 'Real-Time Billing',
            description: 'Real-Time Billing allows you to keep track of your expenses as they occur, ensuring you\'re always aware of your financial standing.',
        },
        {
            icon: CreditCard,
            title: 'Easy Payments',
            description: 'Easy Payments can be made directly through the platform, eliminating the need for manual transactions and reducing the risk of missed payments.',
        },
        {
            icon: FileText,
            title: 'Detailed Reports',
            description: 'Detailed Reports provide a comprehensive overview of your billing history, helping you manage your budget more effectively.',
        },
        {
            icon: Fingerprint,
            title: 'Biometric Fingerprint Attendance',
            description: 'Effortlessly track student attendance with our biometric fingerprint device. It updates student presence and absence in real-time, ensuring accurate and secure attendance records.',
        },
        {
            icon: History,
            title: 'Historical Data Access',
            description: 'Retrieve and review historical billing data and consumption trends for better decision-making and financial planning.',
        },
        {
            icon: Gauge,
            title: 'User-Friendly Interface',
            description: 'Enjoy an intuitive dashboard that simplifies bill management, tracking, and reporting for both administrators and residents.',
        },
        {
            icon: Bell,
            title: 'Handling Notifications',
            description: 'Additionally, our system offers timely Notifications about bill updates and due dates, keeping you informed and on track.',
        },
        {
            icon: Shield,
            title: 'Secure and Reliable',
            description: 'Fingerprint technology ensures that attendance data is secure and tamper-proof, preventing fraudulent activities and ensuring integrity.',
        },
        {
            icon: Users,
            title: 'Multi-User Access',
            description: 'Allow different levels of access for administrators, staff, and residents to manage and view relevant information securely.',
        },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="relative h-[600px] bg-gradient-to-br from-primary-900 via-primary-700 to-primary-600 overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-30"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white px-4 animate-fade-in">
                        <h1 className="text-5xl md:text-6xl font-bold font-condensed mb-6">
                            Welcome To TPGIT Hostel
                        </h1>
                        <div className="max-w-3xl mx-auto">
                            <p className="text-xl md:text-2xl italic font-light">
                                "Hostel life: Where every corner sparks new friendships, and every day ignites your journey of growth."
                            </p>
                        </div>
                        <div className="mt-8 flex flex-wrap justify-center gap-4">
                            <Link to="/registration" className="btn-primary text-lg">
                                Get Started
                            </Link>
                            <Link to="/about" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:bg-gray-100 hover:shadow-lg">
                                Learn More
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Introduction Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center animate-fade-in">
                    <div className="text-6xl text-primary-600 mb-6">❝</div>
                    <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                        At TPGIT, we take immense pride in offering our students a vibrant and enriching living experience that perfectly complements their academic journey. Our state-of-the-art hostel facilities are meticulously designed to provide a secure, comfortable, and supportive environment, fostering both personal and academic growth.
                    </p>
                    <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                        Our hostels stand out for their modern amenities, which include spacious rooms, high-speed internet, and well-maintained recreational areas. Each room is thoughtfully equipped with essential furnishings, ensuring that students have everything they need to focus on their studies while enjoying a homely atmosphere. Additionally, our dedicated housekeeping staff ensures that cleanliness and hygiene are upheld to the highest standards.
                    </p>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        Beyond the physical comforts, the hostel environment at TPGIT promotes a strong sense of community and camaraderie. With various student-led activities and events organized throughout the year, residents have ample opportunities to engage with peers, develop leadership skills, and create lasting friendships. This vibrant community spirit is a hallmark of our hostel life, contributing significantly to the overall college experience.
                    </p>
                    <div className="text-6xl text-primary-600 mt-6">❞</div>
                </div>
            </div>

            {/* Vision & Mission */}
            <div className="bg-gray-100 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Vision */}
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 shadow-lg animate-fade-in">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Vision</h2>
                            <ol className="space-y-4 list-decimal list-inside text-gray-800">
                                <li className="leading-relaxed">
                                    To provide a high-quality learning environment through innovative teaching.
                                </li>
                                <li className="leading-relaxed">
                                    To promote research to produce globally competitive engineers of excellent quality.
                                </li>
                                <li className="leading-relaxed">
                                    To make the students feel at home.
                                </li>
                                <li className="leading-relaxed">
                                    To inculcate discipline and to make students more systematic and strategic.
                                </li>
                            </ol>
                        </div>

                        {/* Mission */}
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 shadow-lg animate-fade-in">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Mission</h2>
                            <ol className="space-y-4 list-decimal list-inside text-gray-800">
                                <li className="leading-relaxed">
                                    To offer education programmes that blend intensive technical training with appropriate guidance inculcating analytical skills and problem solving ability with high degree of professionalism.
                                </li>
                                <li className="leading-relaxed">
                                    To provide healthy environment with excellent facilities for learning, research and innovative thinking.
                                </li>
                                <li className="leading-relaxed">
                                    To educate the students achieve their professional excellence with ethical and social responsibilities.
                                </li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h2 className="text-4xl font-bold text-center mb-4">Awesome Features</h2>
                <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
                    Discover our awesome features: Real-Time Billing, Easy Payments, Detailed Reports, and Handling Notifications. Our mess bill management system is designed with your convenience in mind.
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className="feature-box group"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <Icon className="w-12 h-12 mb-4 group-hover:scale-110 transition-transform duration-300" />
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-white/90 leading-relaxed">{feature.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Guidelines & Prohibitions */}
            <div className="bg-gray-100 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Guidelines */}
                        <div className="bg-white rounded-2xl p-8 shadow-lg">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Guidelines</h2>
                            <ul className="space-y-4 text-gray-700">
                                <li className="flex items-start">
                                    <span className="text-primary-600 font-bold mr-3">•</span>
                                    <span>Confirm that you are authorized to stay within the hostel premises and only occupy the room officially assigned to you. Do not use or sleep in rooms that are assigned to other residents without prior permission.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-primary-600 font-bold mr-3">•</span>
                                    <span>Keep only essential items in your room to minimize the risk of theft. The hostel authorities are not liable for any loss or theft of personal belongings.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-primary-600 font-bold mr-3">•</span>
                                    <span>Dress appropriately and maintain a respectful appearance while in the hostel.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-primary-600 font-bold mr-3">•</span>
                                    <span>Immediately report any cases of contagious diseases to the Warden, Deputy Warden, or Resident Tutors.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-primary-600 font-bold mr-3">•</span>
                                    <span>Be present in the hostel after 5:30 p.m. and remain on the premises during class hours and other institutional obligations.</span>
                                </li>
                            </ul>
                        </div>

                        {/* Prohibitions */}
                        <div className="bg-gray-900 text-white rounded-2xl p-8 shadow-lg">
                            <h2 className="text-3xl font-bold mb-6">Prohibitions</h2>
                            <ul className="space-y-4">
                                <li className="flex items-start">
                                    <span className="text-red-400 font-bold mr-3">✕</span>
                                    <span>Do not permit unauthorized guests or outsiders to enter the hostel or its rooms. Allowing unauthorized individuals inside could lead to disciplinary action or expulsion.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-red-400 font-bold mr-3">✕</span>
                                    <span>Do not occupy or transfer to rooms that are not officially assigned to you.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-red-400 font-bold mr-3">✕</span>
                                    <span>Avoid storing costly or highly valuable items in the hostel. The hostel is not responsible for the loss or theft of such items.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-red-400 font-bold mr-3">✕</span>
                                    <span>Do not allow day scholars inside the hostel. Facilitating their stay or access to your room will result in disciplinary measures.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-red-400 font-bold mr-3">✕</span>
                                    <span>Do not neglect the requirement to be present in the hostel after 5:30 p.m. and during other scheduled times.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeContent;
