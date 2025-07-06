import { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import Team from './components/Team';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Notification from './components/Notification';

function App() {
    const [notification, setNotification] = useState({
        type: '',
        message: '',
        isVisible: false
    });

    const showNotification = (type, message) => {
        setNotification({
            type,
            message,
            isVisible: true
        });
    };

    const hideNotification = () => {
        setNotification(prev => ({
            ...prev,
            isVisible: false
        }));
    };

    return (
        <Router>
            <div className="App">
                <Header />
                <Hero />
                <About />
                <Services />
                <Portfolio />
                <Team />
                <Testimonials />
                <Contact onNotification={showNotification} />
                <Footer />

                {/* Notification Component */}
                <Notification
                    type={notification.type}
                    message={notification.message}
                    isVisible={notification.isVisible}
                    onClose={hideNotification}
                />
            </div>
        </Router>
    );
}

export default App;