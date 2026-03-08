import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-dark-900 text-gray-300 mt-auto border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* About Section */}
                    <div className="space-y-6">
                        <h3 className="text-2xl font-display font-bold text-white tracking-wider">TPGIT HOSTEL</h3>
                        <p className="text-gray-400 leading-relaxed font-sans">
                            Providing a safe, comfortable, and supportive living environment for our students with modern facilities and excellent mess management.
                        </p>
                        <div className="flex space-x-5">
                            <a href="#" className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center hover:bg-secondary hover:border-secondary hover:text-dark-900 transition-all duration-300">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center hover:bg-secondary hover:border-secondary hover:text-dark-900 transition-all duration-300">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center hover:bg-secondary hover:border-secondary hover:text-dark-900 transition-all duration-300">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center hover:bg-secondary hover:border-secondary hover:text-dark-900 transition-all duration-300">
                                <Linkedin size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xl font-bold font-display text-white mb-6 uppercase tracking-wider">Quick Links</h3>
                        <ul className="space-y-3">
                            {[
                                { name: 'Home', path: '/' },
                                { name: 'About Us', path: '/about' },
                                { name: 'Register', path: '/registration' },
                                { name: 'Contact', path: '/contact' }
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link to={item.path} className="flex items-center group">
                                        <span className="w-2 h-2 bg-secondary rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                        <span className="hover:text-white hover:translate-x-1 transition-all duration-300 font-sans">{item.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-xl font-bold font-condensed text-white mb-6 uppercase tracking-wider">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-4 group">
                                <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-primary transition-colors duration-300">
                                    <MapPin size={20} className="text-secondary group-hover:text-white" />
                                </div>
                                <span className="text-gray-400 group-hover:text-white transition-colors duration-300 mt-1">
                                    TPGIT Campus, Vellore,<br />Tamil Nadu, India
                                </span>
                            </li>
                            <li className="flex items-center space-x-4 group">
                                <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-primary transition-colors duration-300">
                                    <Phone size={20} className="text-secondary group-hover:text-white" />
                                </div>
                                <span className="text-gray-400 group-hover:text-white transition-colors duration-300">+91 123 456 7890</span>
                            </li>
                            <li className="flex items-center space-x-4 group">
                                <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-primary transition-colors duration-300">
                                    <Mail size={20} className="text-secondary group-hover:text-white" />
                                </div>
                                <span className="text-gray-400 group-hover:text-white transition-colors duration-300">hostel@tpgit.edu.in</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-content-between items-center text-sm text-gray-500">
                    <p className="text-center md:text-left w-full">
                        &copy; {new Date().getFullYear()} TPGIT Hostel Mess Management System. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
