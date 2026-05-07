import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import './Footer.css';

const Footer: React.FC = () => {
    return (
        <footer className="footer-container">
            <div className="footer-wrapper">
                <div className="footer-grid">
                    {/* About Section */}
                    <div className="footer-section">
                        <h3 className="footer-title">TPGIT HOSTEL</h3>
                        <p className="footer-text">
                            Providing a safe, comfortable, and supportive living environment for our students with modern facilities and excellent mess management.
                        </p>
                        <div className="footer-socials">
                            <a href="#" className="footer-social-link"><Facebook size={18} /></a>
                            <a href="#" className="footer-social-link"><Twitter size={18} /></a>
                            <a href="#" className="footer-social-link"><Instagram size={18} /></a>
                            <a href="#" className="footer-social-link"><Linkedin size={18} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-section">
                        <h3 className="footer-title">Quick Links</h3>
                        <ul className="footer-links-list">
                            {[
                                { name: 'Home', path: '/' },
                                { name: 'About Us', path: '/about' },
                                { name: 'Register', path: '/registration' },
                                { name: 'Contact', path: '/contact' }
                            ].map((item) => (
                                <li key={item.name} className="footer-link-item">
                                    <Link to={item.path} className="footer-link">
                                        <span className="footer-link-dot"></span>
                                        <span>{item.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="footer-section">
                        <h3 className="footer-title">Contact Us</h3>
                        <ul className="footer-contact-list">
                            <li className="footer-contact-item">
                                <div className="footer-contact-icon-box"><MapPin size={20} /></div>
                                <span className="footer-contact-text">
                                    TPGIT Campus, Vellore,<br />Tamil Nadu, India
                                </span>
                            </li>
                            <li className="footer-contact-item">
                                <div className="footer-contact-icon-box"><Phone size={20} /></div>
                                <span className="footer-contact-text">+91 123 456 7890</span>
                            </li>
                            <li className="footer-contact-item">
                                <div className="footer-contact-icon-box"><Mail size={20} /></div>
                                <span className="footer-contact-text">hostel@tpgit.edu.in</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p className="footer-copyright">
                        &copy; {new Date().getFullYear()} TPGIT Hostel Mess Management System. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
