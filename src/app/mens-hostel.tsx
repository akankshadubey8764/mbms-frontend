import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';
import HeroImg from '../assets/images/hostels/Boys-Hostel.jpg';
import B1 from '../assets/images/hostels/b1.png';
import B2 from '../assets/images/hostels/b2.jpeg';
import B3 from '../assets/images/hostels/b3.jpeg';
import './hostel-details.css';

const MensHostel: React.FC = () => {
    const navigate = useNavigate();
    const hostels = [
        {
            name: "Boys Hostel 1",
            image: B1,
            description: "Boys' Hostel 1 is a well-maintained accommodation facility for up to 204 students. It provides a secure and comfortable environment to promote student well-being and academic focus. The rooms are non-AC, with communal washroom facilities located conveniently on each floor. This hostel offers round-the-clock water and electricity, ensuring students have uninterrupted access to essential services.",
            features: ["High-speed Wi-Fi", "Common lounge with TV", "Indoor games (Carrom, Chess)", "Dedicated study zones"],
            email: "warden.paari@college.edu",
            mobile: "8056016611"
        },
        {
            name: "Boys Hostel 2",
            image: B2,
            description: "Boys' Hostel 2 accommodates around 201 students. It is known for its comfortable and student-friendly environment, fostering a sense of community among its residents. The hostel mess is known for its hygienic food, offering a variety of vegetarian and non-vegetarian dishes throughout the day.",
            features: ["Hygienic Mess", "24/7 Water & Electricity", "Housekeeping services", "Social common rooms"],
            email: "warden.kaari@college.edu",
            mobile: "8056016612"
        },
        {
            name: "Boys Hostel 3",
            image: B3,
            description: "Boys' Hostel 3, housing up to 153 students, provides a peaceful and conducive setting for academic focus. It offers extracurricular opportunities, including a gym and a study hall where students can prepare for exams.",
            features: ["On-campus Gym", "Extracurricular focus", "Balanced nutritious meals", "Regular health checks"],
            email: "warden.senguttuvan@college.edu",
            mobile: "8056016613"
        }
    ];

    return (
        <div className="hd-page">
            <Navbar />

            {/* <button onClick={() => navigate('/about')} className="hd-back-btn">
                <ArrowLeft size={18} />
                <span>Back to About</span>
            </button> */}

            <div className="hd-hero" style={{ backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.6)), url(${HeroImg})` }}>
                <div className="hd-hero-content">
                    <h1 className="hd-hero-title">Mens' Hostels</h1>
                    <p className="hd-hero-subtitle">Providing a well-maintained and productive living environment for over 1,000 students across multiple blocks.</p>
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

export default MensHostel;
