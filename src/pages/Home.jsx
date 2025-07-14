import { useState } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
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
            isDark ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'
        }`}>
            <Header />
            <Hero />
            <Services />
            <TrustedClients />
            <Footer />

            <Notification
                type={notification.type}
                message={notification.message}
                isVisible={notification.isVisible}
                onClose={hideNotification}
            />
        </div>
    );
}

export default Home;