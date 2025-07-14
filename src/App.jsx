import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Pricing from './components/Pricing'; // New import
import Portfolio from './components/Portfolio';
import Team from './components/Team';
import TrustedClients from './components/TrustedClients'; // Updated import
import Contact from './components/Contact';
import Footer from './components/Footer';
import Notification from './components/Notification';

function App() {
    const [notification, setNotification] = useState({
        isVisible: false,
        type: '',
        message: ''
    });

    const showNotification = (type, message) => {
        setNotification({
            isVisible: true,
            type,
            message
        });
    };

    const hideNotification = () => {
        setNotification(prev => ({
            ...prev,
            isVisible: false
        }));
    };

    return (
        <div className="min-h-screen">
            <Header />
            <Hero />
            <About />
            <Services />
            <Pricing /> {/* New section */}
            <Portfolio />
            <Team />
            <TrustedClients /> {/* Updated component */}
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

export default App;