import Header from '../components/Header';
import About from '../components/About';
import Team from '../components/Team';
import TrustedClients from '../components/TrustedClients';
import Footer from '../components/Footer';
import { useTheme } from '../contexts/ThemeContext';

function AboutPage() {
    const { isDark } = useTheme();

    return (
        <div className={`min-h-screen transition-colors duration-300 ${
            isDark ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'
        }`}>
            <Header />
            <div className="pt-20">
                <About />
                <Team />
                <TrustedClients />
            </div>
            <Footer />
        </div>
    );
}

export default AboutPage;