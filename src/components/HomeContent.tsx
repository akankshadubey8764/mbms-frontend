import React from 'react';

import {
    ChartLine,
    CreditCard,
    FileText,
    Fingerprint,
    History,
    Gauge,
    Bell,
    Shield,
    Users,
    Quote
} from 'lucide-react';
import VideoBg from '../assets/video/slideshow.mp4';
import B1 from '../assets/images/hostels/b1.png'; // Assuming png for b1 based on list_dir
import B2 from '../assets/images/hostels/b2.jpeg';
import B3 from '../assets/images/hostels/b3.jpeg';
import G1 from '../assets/images/hostels/g1.jpeg';
import G2 from '../assets/images/hostels/g2.jpeg';
import BoysHostelMain from '../assets/images/hostels/Boys-Hostel.jpg';

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
            title: 'Biometric Attendance',
            description: 'Effortlessly track student attendance with our biometric fingerprint device. It updates student presence and absence in real-time.',
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

    const hostelImages = [BoysHostelMain, B1, B2, B3, G1, G2];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section with Video Background */}
            <div className="relative h-screen w-full overflow-hidden">
                <video
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                >
                    <source src={VideoBg} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center px-4">
                    <h1 className="text-4xl md:text-6xl font-condensed font-bold text-white mb-6 animate-fade-in drop-shadow-lg relative inline-block">
                        Welcome To TPGIT Hostel
                        <div className="h-1 w-1/2 bg-white mx-auto mt-4 rounded-full"></div>
                    </h1>

                    <div className="max-w-4xl mx-auto bg-black/40 backdrop-blur-md p-8 md:p-12 rounded-2xl border-l-8 border-l-secondary shadow-2xl mt-8 transform hover:scale-105 transition-transform duration-500">
                        <p className="text-xl md:text-3xl font-display font-medium text-white leading-relaxed tracking-wide">
                            "Hostel life: Where every corner sparks new friendships, and every day ignites your journey of growth."
                        </p>
                    </div>
                </div>
            </div>

            {/* Introduction Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="bg-white rounded-xl shadow-lg p-10 md:p-16 text-center transform hover:-translate-y-2 transition-transform duration-500">
                    <Quote className="w-12 h-12 text-primary mx-auto mb-6 opacity-80" />
                    <p className="text-lg text-gray-600 mb-6 leading-relaxed font-sans">
                        At TPGIT, we take immense pride in offering our students a vibrant and enriching living experience that perfectly complements their academic journey. Our state-of-the-art hostel facilities are meticulously designed to provide a secure, comfortable, and supportive environment, fostering both personal and academic growth.
                    </p>
                    <p className="text-lg text-gray-600 mb-6 leading-relaxed font-sans">
                        Our hostels stand out for their modern amenities, which include spacious rooms, high-speed internet, and well-maintained recreational areas. Each room is thoughtfully equipped with essential furnishings, ensuring that students have everything they need to focus on their studies while enjoying a homely atmosphere. Additionally, our dedicated housekeeping staff ensures that cleanliness and hygiene are upheld to the highest standards.
                    </p>
                    <p className="text-lg text-gray-600 leading-relaxed font-sans">
                        Beyond the physical comforts, the hostel environment at TPGIT promotes a strong sense of community and camaraderie. With various student-led activities and events organized throughout the year, residents have ample opportunities to engage with peers, develop leadership skills, and create lasting friendships. This vibrant community spirit is a hallmark of our hostel life, contributing significantly to the overall college experience.
                    </p>
                    <Quote className="w-12 h-12 text-primary mx-auto mt-6 opacity-80 rotate-180" />
                </div>
            </div>

            {/* Life at Hostel (Images) */}
            <div className="bg-light-blue py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl font-condensed font-bold text-center text-dark mb-12 relative inline-block w-full">
                        Life at TPGIT Hostel
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {hostelImages.map((img, idx) => (
                            <div key={idx} className="group relative overflow-hidden rounded-xl shadow-md h-64 cursor-pointer">
                                <img
                                    src={img}
                                    alt={`Hostel View ${idx + 1}`}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                    <span className="text-white font-bold text-lg">View Gallery</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Vision & Mission */}
            <div className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Vision */}
                        <div className="bg-light-blue rounded-xl p-8 shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                            <h2 className="text-3xl font-condensed font-bold text-dark mb-8 text-center border-b-2 border-primary pb-4 inline-block w-full">Vision</h2>
                            <ol className="space-y-4 list-none text-gray-700">
                                {['To provide a high-quality learning environment through innovative teaching.',
                                    'To promote research to produce globally competitive engineers of excellent quality.',
                                    'To make the students feel at home.',
                                    'To inculcate discipline and to make students more systematic and strategic.'
                                ].map((text, i) => (
                                    <li key={i} className="flex items-start">
                                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 mr-4 font-bold text-sm">{i + 1}</div>
                                        <span className="mt-1 font-medium">{text}</span>
                                    </li>
                                ))}
                            </ol>
                        </div>

                        {/* Mission */}
                        <div className="bg-light-blue rounded-xl p-8 shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                            <h2 className="text-3xl font-condensed font-bold text-dark mb-8 text-center border-b-2 border-primary pb-4 inline-block w-full">Mission</h2>
                            <ol className="space-y-4 list-none text-gray-700">
                                {['To offer education programmes that blend intensive technical training with appropriate guidance inculcating analytical skills and problem solving ability with high degree of professionalism.',
                                    'To provide healthy environment with excellent facilities for learning, research and innovative thinking.',
                                    'To educate the students achieve their professional excellence with ethical and social responsibilities.'
                                ].map((text, i) => (
                                    <li key={i} className="flex items-start">
                                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 mr-4 font-bold text-sm">{i + 1}</div>
                                        <span className="mt-1 font-medium">{text}</span>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="bg-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-condensed font-bold text-dark mb-6">Awesome Features</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                            Discover our awesome features designed with your convenience in mind.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={index}
                                    className="group relative bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full -mr-4 -mt-4 transition-all group-hover:bg-primary/20"></div>
                                    <Icon className="w-14 h-14 text-primary mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10" />
                                    <h3 className="text-xl font-bold mb-4 text-gray-800 relative z-10">{feature.title}</h3>

                                    <div className="relative z-10">
                                        <p className="text-gray-600 leading-relaxed group-hover:text-gray-900 transition-colors">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Guidelines & Prohibitions */}
            <div className="bg-gray-50 py-20 px-4">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
                    {/* Guidelines */}
                    <div className="bg-white rounded-xl shadow-md p-8 border-l-4 border-primary">
                        <h2 className="text-3xl font-condensed font-bold text-dark mb-6 flex items-center">
                            <span className="mr-3">📋</span> Guidelines
                        </h2>
                        <ul className="space-y-4 text-gray-700">
                            {[
                                'Confirm authorized stay and only occupy assigned room.',
                                'Keep only essential items to minimize theft risk.',
                                'Dress appropriately and maintain a respectful appearance.',
                                'Report contagious diseases immediately to the Warden.',
                                'Be present after 5:30 p.m. and during class hours.'
                            ].map((item, i) => (
                                <li key={i} className="flex items-start">
                                    <span className="text-primary font-bold mr-3">•</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Prohibitions */}
                    <div className="bg-dark text-white rounded-xl shadow-md p-8 border-r-4 border-red-500">
                        <h2 className="text-3xl font-condensed font-bold mb-6 flex items-center">
                            <span className="mr-3">🚫</span> Prohibitions
                        </h2>
                        <ul className="space-y-4 text-gray-300">
                            {[
                                'Do not permit unauthorized guests or outsiders.',
                                'Do not occupy or transfer to unassigned rooms.',
                                'Avoid storing costly items; hostel is not liable for theft.',
                                'Do not allow day scholars inside the hostel.',
                                'Do not neglect attendance rules.'
                            ].map((item, i) => (
                                <li key={i} className="flex items-start">
                                    <span className="text-red-400 font-bold mr-3">✕</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeContent;
