import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';
import { scrollToSection, getCurrentSection } from '../utils/scrollUtils';

const Header = ({ onGetQuoteClick }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');

    const navItems = [
        { name: 'Home', href: 'home' },
        { name: 'About', href: 'about' },
        { name: 'Services', href: 'services' },
        { name: 'Portfolio', href: 'portfolio' },
        { name: 'Team', href: 'team' },
        { name: 'Contact', href: 'contact' },
    ];

    useEffect(() => {
        const handleScroll = () => {
            const currentSection = getCurrentSection();
            setActiveSection(currentSection);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = (sectionId) => {
        scrollToSection(sectionId);
        setIsMenuOpen(false);
    };

    const handleGetQuoteClick = () => {
        setIsMenuOpen(false);
        if (onGetQuoteClick) {
            onGetQuoteClick();
        } else {
            scrollToSection('contact');
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-50 border-b border-gray-200">
            <div className="container-max">
                <nav className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center cursor-pointer"
                        onClick={() => handleNavClick('home')}
                    >
                        <div className="text-2xl font-bold text-primary-600">
                            WebCraft Pro
                        </div>
                    </motion.div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => handleNavClick(item.href)}
                                className={`text-gray-600 hover:text-primary-600 transition-colors duration-200 ${
                                    activeSection === item.href ? 'text-primary-600 font-medium' : ''
                                }`}
                            >
                                {item.name}
                            </button>
                        ))}
                        <button
                            onClick={handleGetQuoteClick}
                            className="btn-primary"
                        >
                            Get Quote
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                </nav>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="md:hidden bg-white border-t border-gray-200 py-4"
                    >
                        {navItems.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => handleNavClick(item.href)}
                                className={`block w-full text-left px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-colors duration-200 ${
                                    activeSection === item.href ? 'text-primary-600 font-medium bg-primary-50' : ''
                                }`}
                            >
                                {item.name}
                            </button>
                        ))}
                        <div className="px-4 py-2">
                            <button
                                onClick={handleGetQuoteClick}
                                className="btn-primary w-full"
                            >
                                Get Quote
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </header>
    );
};

export default Header;