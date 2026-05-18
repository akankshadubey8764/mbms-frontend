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
import B1 from '../assets/images/hostels/b1.png';
import B2 from '../assets/images/hostels/b2.jpeg';
import B3 from '../assets/images/hostels/b3.jpeg';
import G1 from '../assets/images/hostels/g1.jpeg';
import G2 from '../assets/images/hostels/g2.jpeg';
import BoysHostelMain from '../assets/images/hostels/Boys-Hostel.jpg';
import './HomeContent.css';

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
        <div className="hc-container">
            {/* Hero Section */}
            <div className="hc-hero">
                <video className="hc-hero-video" autoPlay loop muted playsInline>
                    <source src={VideoBg} type="video/mp4" />
                </video>
                <div className="hc-hero-overlay">
                    <h1 className="hc-hero-title">
                        Welcome To TPGIT Hostel
                        <div className="hc-title-line"></div>
                    </h1>
                    <div className="hc-quote-box">
                        <p className="hc-quote-text">
                            "Hostel life: Where every corner sparks new friendships, and every day ignites your journey of growth."
                        </p>
                    </div>
                </div>
            </div>

            {/* Introduction */}
            <div className="hc-section-wrapper">
                <div className="hc-intro-card">
                    <Quote className="hc-quote-icon" />
                    <p className="hc-section-text">
                        At TPGIT, we take immense pride in offering our students a vibrant and enriching living experience that perfectly complements their academic journey. Our state-of-the-art hostel facilities are meticulously designed to provide a secure, comfortable, and supportive environment, fostering both personal and academic growth.
                    </p>
                    <p className="hc-section-text">
                        Our hostels stand out for their modern amenities, which include spacious rooms, high-speed internet, and well-maintained recreational areas. Each room is thoughtfully equipped with essential furnishings, ensuring that students have everything they need to focus on their studies while enjoying a homely atmosphere.
                    </p>
                    <Quote className="hc-quote-icon" style={{ marginTop: '1.5rem', transform: 'rotate(180deg)' }} />
                </div>
            </div>

            {/* Gallery Grid */}
            <div style={{ backgroundColor: '#eff6ff', padding: '5rem 1rem' }}>
                <div className="hc-section-wrapper" style={{ padding: '0' }}>
                    <h2 style={{ fontSize: '2.25rem', fontWeight: '700', textAlign: 'center', color: '#0f172a', marginBottom: '3rem' }}>Life at TPGIT Hostel</h2>
                    <div className="hc-grid-3">
                        {hostelImages.map((img, idx) => (
                            <div key={idx} className="hc-gallery-item">
                                <img src={img} alt={`Gallery ${idx}`} className="hc-gallery-img" />
                                <div className="hc-gallery-overlay">
                                    <span style={{ color: '#ffffff', fontWeight: '700' }}>View Gallery</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="hc-section-wrapper">
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '2.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '1.5rem' }}>Awesome Features</h2>
                    <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>Discover our awesome features designed with your convenience in mind.</p>
                </div>

                <div className="hc-grid-3">
                    {features.map((feature, idx) => {
                        const Icon = feature.icon;
                        return (
                            <div key={idx} className="hc-feature-card">
                                <Icon className="hc-feature-icon" />
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem' }}>{feature.title}</h3>
                                <p style={{ color: '#4b5563', lineHeight: '1.6' }}>{feature.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Guidelines & Prohibitions */}
            <div style={{ backgroundColor: '#f9fafb', padding: '5rem 1rem' }}>
                <div className="hc-section-wrapper" style={{ padding: '0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    <div className="hc-guideline-card">
                        <h2 className="hc-section-title-alt">📋 Guidelines</h2>
                        <ul className="hc-list">
                            {[
                                'Ensure your stay is authorized and occupy only your assigned room.',
                                'Safeguard your personal belongings and minimize storing valuables.',
                                'Maintain a professional appearance and dress appropriately in common areas.',
                                'Promptly report any health concerns or contagious illnesses to the administration.'
                            ].map((text, i) => (
                                <li key={i} className="hc-list-item">
                                    <span className="hc-bullet">•</span>
                                    <span>{text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="hc-prohibition-card">
                        <h2 className="hc-section-title-alt">🚫 Prohibitions</h2>
                        <ul className="hc-list">
                            {[
                                'Unauthorized guests or visitors are strictly prohibited.',
                                'Transferring or occupying unassigned rooms without prior approval is forbidden.',
                                'The administration assumes no liability for the loss of valuable personal items.',
                                'Day scholars are not permitted within the hostel premises.'
                            ].map((text, i) => (
                                <li key={i} className="hc-list-item">
                                    <span className="hc-bullet-red">✕</span>
                                    <span>{text}</span>
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
