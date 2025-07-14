import Header from '../components/Header';
import Pricing from '../components/Pricing';
import Footer from '../components/Footer';
import { useTheme } from '../contexts/ThemeContext';

function PricingPage() {
    const { isDark } = useTheme();

    return (
        <div className={`min-h-screen transition-colors duration-300 ${
            isDark ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'
        }`}>
            <Header />
            <div className="pt-20">
                <Pricing />
            </div>
            <Footer />
        </div>
    );
}

export default PricingPage;