import React from 'react';
import { Link } from 'react-router-dom';
import './AboutContent.css';
import BoysImg from '../assets/images/hostels/Boys-Hostel.jpg';
import GirlsImg from '../assets/images/hostels/g1.jpeg';

const AboutContent: React.FC = () => {
    return (
        <div className="ac-container">
            <div className="ac-wrapper">
                <h1 className="ac-title">About Our College Hostels</h1>

                <div className="ac-intro">
                    <p className="ac-intro-text">
                        Welcome to our college hostels! We provide a safe, comfortable, and supportive living environment for our students. Our hostels are designed to foster a sense of community while offering all the necessary facilities to ensure a pleasant stay.
                    </p>
                </div>

                <div style={{ marginBottom: '4rem' }}>
                    <h2 className="ac-section-title">Boys' Hostels</h2>
                    <div className="ac-card">
                        <div className="ac-card-image">
                            <img src={BoysImg} alt="Boys Hostel" className="w-full h-full object-cover" />
                        </div>
                        <div className="ac-card-body">
                            <h3 className="ac-card-title">Boys' Hostels</h3>
                            <p className="ac-card-text">
                                Explore comfortable and well-facilitated boys' hostels available on campus. Our boys' hostels include GHT (Gents Hostel TPGIT) and Boys Hall 2, equipped with modern amenities, spacious rooms, and recreational facilities. Each hostel is designed to provide a conducive environment for academic excellence and personal development.
                            </p>
                            <div className="ac-features-grid">
                                <div className="ac-feature-box">
                                    <h4 className="ac-feature-title">Facilities</h4>
                                    <ul className="ac-list">
                                        <li className="ac-list-item">• Spacious rooms with modern furnishings</li>
                                        <li className="ac-list-item">• High-speed internet connectivity</li>
                                        <li className="ac-list-item">• 24/7 security and CCTV surveillance</li>
                                        <li className="ac-list-item">• Common areas and study rooms</li>
                                    </ul>
                                </div>
                                <div className="ac-feature-box">
                                    <h4 className="ac-feature-title">Amenities</h4>
                                    <ul className="ac-list">
                                        <li className="ac-list-item">• Mess with nutritious meals</li>
                                        <li className="ac-list-item">• Recreational facilities</li>
                                        <li className="ac-list-item">• Laundry services</li>
                                        <li className="ac-list-item">• Medical facilities on campus</li>
                                    </ul>
                                </div>
                            </div>
                            <Link to="/mens-hostel" className="ac-button">
                                Explore More
                            </Link>
                        </div>
                    </div>
                </div>

                <div style={{ marginBottom: '4rem' }}>
                    <h2 className="ac-section-title">Girls' Hostels</h2>
                    <div className="ac-card">
                        <div className="ac-card-image">
                            <img src={GirlsImg} alt="Girls Hostel" className="w-full h-full object-cover" />
                        </div>
                        <div className="ac-card-body">
                            <h3 className="ac-card-title">Girls' Hostels</h3>
                            <p className="ac-card-text">
                                Safe and secure accommodation for female students, ensuring comfort and convenience. Our girls' hostels are designed with enhanced security measures, comfortable living spaces, and a supportive environment that promotes academic success and personal growth. The hostels feature modern amenities and are managed by dedicated staff to ensure the well-being of all residents.
                            </p>
                            <div className="ac-features-grid">
                                <div className="ac-feature-box">
                                    <h4 className="ac-feature-title">Security Features</h4>
                                    <ul className="ac-list">
                                        <li className="ac-list-item">• 24/7 security personnel</li>
                                        <li className="ac-list-item">• Biometric access control</li>
                                        <li className="ac-list-item">• CCTV monitoring</li>
                                        <li className="ac-list-item">• Female wardens on duty</li>
                                    </ul>
                                </div>
                                <div className="ac-feature-box">
                                    <h4 className="ac-feature-title">Comfort & Care</h4>
                                    <ul className="ac-list">
                                        <li className="ac-list-item">• Well-furnished rooms</li>
                                        <li className="ac-list-item">• Hygienic mess facilities</li>
                                        <li className="ac-list-item">• Common recreation areas</li>
                                        <li className="ac-list-item">• Counseling services available</li>
                                    </ul>
                                </div>
                            </div>
                            <Link to="/womens-hostel" className="ac-button">
                                Explore More
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="ac-why-box">
                    <h2 className="ac-section-title" style={{ color: '#ffffff', marginBottom: '3rem' }}>Why Choose Our Hostels?</h2>
                    <div className="ac-why-grid">
                        <div className="ac-why-item">
                            <div className="ac-why-icon-box">🏠</div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Home Away From Home</h3>
                            <p style={{ color: '#d1d5db' }}>Experience a warm, welcoming environment that makes you feel at home.</p>
                        </div>
                        <div className="ac-why-item">
                            <div className="ac-why-icon-box">🤝</div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Community Living</h3>
                            <p style={{ color: '#d1d5db' }}>Build lasting friendships and develop essential life skills through community living.</p>
                        </div>
                        <div className="ac-why-item">
                            <div className="ac-why-icon-box">📚</div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Academic Support</h3>
                            <p style={{ color: '#d1d5db' }}>Access study rooms, libraries, and a conducive environment for academic excellence.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutContent;
