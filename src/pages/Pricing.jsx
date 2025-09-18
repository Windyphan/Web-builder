import Header from '../components/Header';
import Pricing from '../components/Pricing';
import Footer from '../components/Footer';
import { useTheme } from '../contexts/ThemeContext';

function PricingPage() {
    const { isDark } = useTheme();

    return (
        <div className={`min-h-screen transition-colors duration-300 ${
            isDark 
                ? 'bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 text-navy-100' 
                : 'bg-gradient-to-br from-navy-50 via-white to-navy-100 text-navy-900'
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