import React from 'react';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';
import AboutContent from '../components/AboutContent';

const About: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
                <AboutContent />
            </main>
            <Footer />
        </div>
    );
};

export default About;
