import { useState } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import InkFillSection from '../components/InkFillSection';
import VideoSection from '../components/VideoSection';
import Services from '../components/Services';
import TrustedClients from '../components/TrustedClients';
import Footer from '../components/Footer';
import Notification from '../components/Notification';
import { useTheme } from '../contexts/ThemeContext';

function Home() {
    const [notification, setNotification] = useState({
        isVisible: false,
        type: '',
        message: ''
    });
    const { isDark } = useTheme();

    const showNotification = (type, message) => {
        setNotification({ isVisible: true, type, message });
    };

    const hideNotification = () => {
        setNotification(prev => ({ ...prev, isVisible: false }));
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 ${
            isDark 
                ? 'bg-navy-950 text-navy-100' 
                : 'bg-white text-navy-900'
        }`}>
            <Header />
            <Hero />
            <InkFillSection />
            <VideoSection />
            <TrustedClients />
            <Services />
            <Footer />

            <Notification
                isVisible={notification.isVisible}
                type={notification.type}
                message={notification.message}
                onClose={hideNotification}
            />
        </div>
    );
}

export default Home;
