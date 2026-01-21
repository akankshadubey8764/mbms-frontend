import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-900 text-white mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* About Section */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">TPGIT Hostel</h3>
                        <p className="text-gray-400 mb-4">
                            Providing a safe, comfortable, and supportive living environment for our students with modern facilities and excellent mess management.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                                <Linkedin size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-gray-400 hover:text-primary-400 transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-gray-400 hover:text-primary-400 transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/registration" className="text-gray-400 hover:text-primary-400 transition-colors">
                                    Register
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-gray-400 hover:text-primary-400 transition-colors">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Contact Us</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start space-x-3">
                                <MapPin size={20} className="text-primary-400 mt-1 flex-shrink-0" />
                                <span className="text-gray-400">
                                    TPGIT Campus, Vellore, Tamil Nadu, India
                                </span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Phone size={20} className="text-primary-400 flex-shrink-0" />
                                <span className="text-gray-400">+91 123 456 7890</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Mail size={20} className="text-primary-400 flex-shrink-0" />
                                <span className="text-gray-400">hostel@tpgit.edu.in</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center">
                    <p className="text-gray-400">
                        &copy; {new Date().getFullYear()} TPGIT Hostel Mess Management System. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
