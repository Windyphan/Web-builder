import { useState } from 'react';
import Header from '../components/Header';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import Notification from '../components/Notification';
import { useTheme } from '../contexts/ThemeContext';

function ContactPage() {
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
                ? 'bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 text-navy-100' 
                : 'bg-gradient-to-br from-navy-50 via-white to-navy-100 text-navy-900'
        }`}>
            <Header />
            <div className="pt-20">
                <Contact onNotification={showNotification} />
            </div>
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

export default ContactPage;