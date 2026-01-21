import React from 'react';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';
import HomeContent from '../components/HomeContent';

const Home: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
                <HomeContent />
            </main>
            <Footer />
        </div>
    );
};

export default Home;
