import React from 'react';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';
import ContactContent from '../components/ContactContent';

const Contact: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
                <ContactContent />
            </main>
            <Footer />
        </div>
    );
};

export default Contact;
