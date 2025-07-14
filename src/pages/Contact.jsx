import { useState } from 'react';
import Header from '../components/Header';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import Notification from '../components/Notification';

function ContactPage() {
    const [notification, setNotification] = useState({
        isVisible: false,
        type: '',
        message: ''
    });

    const showNotification = (type, message) => {
        setNotification({ isVisible: true, type, message });
    };

    const hideNotification = () => {
        setNotification(prev => ({ ...prev, isVisible: false }));
    };

    return (
        <div className="min-h-screen">
            <Header />
            <Contact onNotification={showNotification} />
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

export default ContactPage;