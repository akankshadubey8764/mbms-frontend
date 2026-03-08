import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';
import apiClient from '../api/apiClient';

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
        <div className="min-h-screen py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Get In Touch
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Have questions or need assistance? We're here to help! Reach out to us and we'll respond as soon as possible.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="form-label">Your Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div>
                                <label className="form-label">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="form-input pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="form-label">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3.5 text-gray-400" size={20} />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="form-input pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="form-label">Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div>
                                <label className="form-label">Message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={5}
                                    className="form-input resize-none"
                                    required
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50"
                            >
                                <Send size={20} />
                                <span>{loading ? 'Sending...' : 'Send Message'}</span>
                            </button>
                        </form>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-8">
                        {/* Contact Cards */}
                        <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white rounded-2xl shadow-xl p-8 animate-fade-in">
                            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                            <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">Address</h3>
                                        <p className="text-white/90">
                                            TPGIT Campus<br />
                                            Vellore, Tamil Nadu<br />
                                            India - 632014
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">Phone</h3>
                                        <p className="text-white/90">+91 123 456 7890</p>
                                        <p className="text-white/90">+91 098 765 4321</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">Email</h3>
                                        <p className="text-white/90">hostel@tpgit.edu.in</p>
                                        <p className="text-white/90">support@tpgit.edu.in</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Office Hours */}
                        <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Office Hours</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                                    <span className="font-semibold text-gray-700">Monday - Friday</span>
                                    <span className="text-gray-600">9:00 AM - 6:00 PM</span>
                                </div>
                                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                                    <span className="font-semibold text-gray-700">Saturday</span>
                                    <span className="text-gray-600">9:00 AM - 2:00 PM</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-gray-700">Sunday</span>
                                    <span className="text-red-600 font-semibold">Closed</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Response */}
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl shadow-xl p-8 animate-fade-in">
                            <h3 className="text-xl font-bold mb-3">Quick Response</h3>
                            <p className="text-gray-300 mb-4">
                                For urgent matters, please call our 24/7 emergency helpline:
                            </p>
                            <a
                                href="tel:+911234567890"
                                className="inline-block bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                            >
                                📞 +91 123 456 7890
                            </a>
                        </div>
                    </div>
                </div>

                {/* Google Map Section */}
                <div className="mt-16 bg-white rounded-2xl shadow-xl p-4 animate-fade-in relative z-10 transition-transform duration-500 hover:scale-[1.01]">
                    <div className="rounded-xl overflow-hidden h-[450px] shadow-inner">
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
