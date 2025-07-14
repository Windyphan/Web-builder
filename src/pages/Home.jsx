import { useState } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import Footer from '../components/Footer';
import Notification from '../components/Notification';

function Home() {
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
            <Hero />
            <About />
            <Services />
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