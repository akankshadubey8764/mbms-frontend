import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';
import apiClient from '../api/apiClient';
import './ContactContent.css';

const ContactContent: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const contactToast = toast.loading('Sending message...');

        try {
            await apiClient.post('/contact/submit', formData);
            toast.success('Your message has been sent successfully!', { id: contactToast });
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: '',
            });
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to send message', { id: contactToast });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="cc-container">
            <div className="cc-wrapper">
                <div className="cc-header">
                    <h1 className="cc-title">Get In Touch</h1>
                    <p className="cc-subtitle">
                        Have questions or need assistance? We're here to help! Reach out to us and we'll respond as soon as possible.
                    </p>
                </div>

                <div className="cc-grid">
                    {/* Contact Form */}
                    <div className="cc-form-card">
                        <h2 className="cc-form-title">Send Us a Message</h2>
                        <form onSubmit={handleSubmit} className="cc-form">
                            <div className="cc-field">
                                <label className="cc-label">Your Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="cc-input"
                                    required
                                />
                            </div>

                            <div className="cc-field">
                                <label className="cc-label">Email Address</label>
                                <div className="cc-input-wrapper">
                                    <Mail className="cc-input-icon" size={20} />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="cc-input cc-input-with-icon"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="cc-field">
                                <label className="cc-label">Phone Number</label>
                                <div className="cc-input-wrapper">
                                    <Phone className="cc-input-icon" size={20} />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="cc-input cc-input-with-icon"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="cc-field">
                                <label className="cc-label">Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="cc-input"
                                    required
                                />
                            </div>

                            <div className="cc-field">
                                <label className="cc-label">Message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={5}
                                    className="cc-textarea"
                                    required
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="cc-submit-btn"
                            >
                                <Send size={20} />
                                <span>{loading ? 'Sending...' : 'Send Message'}</span>
                            </button>
                        </form>
                    </div>

                    {/* Contact Information */}
                    <div className="cc-info-section">
                        <div className="cc-info-card">
                            <h2 className="cc-info-title">Contact Information</h2>
                            <div className="cc-info-list">
                                <div className="cc-info-item">
                                    <div className="cc-icon-box">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h3 className="cc-item-title">Address</h3>
                                        <p className="cc-item-text">
                                            TPGIT Campus<br />
                                            Vellore, Tamil Nadu<br />
                                            India - 632014
                                        </p>
                                    </div>
                                </div>

                                <div className="cc-info-item">
                                    <div className="cc-icon-box">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <h3 className="cc-item-title">Phone</h3>
                                        <p className="cc-item-text">0416 226 6101</p>
                                        <p className="cc-item-text">0416 226 6102</p>
                                    </div>
                                </div>

                                <div className="cc-info-item">
                                    <div className="cc-icon-box">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h3 className="cc-item-title">Email</h3>
                                        <p className="cc-item-text">principal@tpgit.edu.in</p>
                                        <p className="cc-item-text">hostel@tpgit.edu.in</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="cc-hours-card">
                            <h2 className="cc-form-title">Office Hours</h2>
                            <div className="cc-hours-list">
                                <div className="cc-hour-row">
                                    <span className="cc-day">Monday - Saturday</span>
                                    <span className="cc-time">10:00 AM - 5:45 PM</span>
                                </div>
                                <div className="cc-hour-row">
                                    <span className="cc-day">Second Saturday</span>
                                    <span className="cc-closed">Closed</span>
                                </div>
                                <div className="cc-hour-row">
                                    <span className="cc-day">Sunday</span>
                                    <span className="cc-closed">Closed</span>
                                </div>
                            </div>
                        </div>

                        <div className="cc-quick-card">
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.75rem' }}>Quick Response</h3>
                            <p style={{ color: '#d1d5db', fontSize: '0.875rem', marginBottom: '1rem' }}>
                                For urgent matters, please call our 24/7 emergency helpline:
                            </p>
                            <a href="tel:04162266101" className="cc-quick-btn">
                                📞 0416 226 6101
                            </a>
                        </div>
                    </div>
                </div>

                <div className="cc-map-container">
                    <div className="cc-map-wrapper">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.303986422792!2d79.11706247473215!3d12.91500438739502!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bad389d00000001%3A0xe67c638c4c34d852!2sThanthai%20Periyar%20Government%20Institute%20of%20Technology!5e0!3m2!1sen!2sin!4v1709123456789!5m2!1sen!2sin"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="TPGIT Location"
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactContent;
