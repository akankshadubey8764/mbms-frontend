import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';
import HeroImg from '../assets/images/hostels/Boys-Hostel.jpg'; // Using standard hero if no specific girls hero
import G1 from '../assets/images/hostels/g1.jpeg';
import G2 from '../assets/images/hostels/g2.jpeg';
import './hostel-details.css';

const WomensHostel: React.FC = () => {
    const navigate = useNavigate();
    const hostels = [
        {
            name: "Girls Hostel 1",
            image: G1,
            description: "Girls' Hostel 1 provides a safe and comfortable environment for female students, ensuring a healthy and secured living atmosphere. Equipped with essential amenities to accommodate students comfortably, it fosters a community of learning and growth.",
            features: ["24/7 Security", "Biometric Access", "Spacious Study Halls", "Hygienic Environment"],
            email: "warden.paari@college.edu",
            mobile: "8056016611"
        },
        {
            name: "Girls Hostel 2",
            image: G2,
            description: "Girls' Hostel 2 is known for its secure atmosphere and student-friendly amenities. It provides non-AC rooms with shared washrooms that are cleaned regularly, maintaining high standards of hygiene and comfort.",
            features: ["Warden Assistance", "Safe Common Areas", "Nutritious Mess Meals", "Regular Maintenance"],
            email: "warden.kaari@college.edu",
            mobile: "8056016612"
        }
    ];

    return (
        <div className="hd-page">
            <Navbar />

            {/* <button onClick={() => navigate('/about')} className="hd-back-btn">
                <ArrowLeft size={18} />
                <span>Back to About</span>
            </button> */}

            <div className="hd-hero hd-hero-girls" style={{ backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.6)), url(${HeroImg})` }}>
                <div className="hd-hero-content">
                    <h1 className="hd-hero-title">Womens' Hostels</h1>
                    <p className="hd-hero-subtitle">Safe and comfortable accommodation for female students, ensuring a secured and supportive living environment.</p>
                </div>
            </div>

            <div className="hd-container">
                {hostels.map((hostel, idx) => (
                    <div key={idx} className={`hd-card ${idx % 2 !== 0 ? 'hd-card-reverse' : ''}`}>
                        <div className="hd-image-box">
                            <img src={hostel.image} alt={hostel.name} />
                        </div>
                        <div className="hd-content-box">
                            <h2 className="hd-title">{hostel.name}</h2>
                            <p className="hd-description">{hostel.description}</p>

                            <div className="hd-features">
                                {hostel.features.map((f, i) => (
                                    <span key={i} className="hd-feature-tag">{f}</span>
                                ))}
                            </div>

                            <div className="hd-contact">
                                <div className="hd-contact-item">
                                    <span className="hd-label">Email:</span>
                                    <span className="hd-value">{hostel.email}</span>
                                </div>
                                <div className="hd-contact-item">
                                    <span className="hd-label">Mobile:</span>
                                    <span className="hd-value">{hostel.mobile}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Footer />
        </div>
    );
};

export default WomensHostel;
