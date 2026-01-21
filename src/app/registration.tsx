import React from 'react';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';
import RegistrationForm from '../components/RegistrationForm';

const Registration: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
                <RegistrationForm />
            </main>
            <Footer />
        </div>
    );
};

export default Registration;
