import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';
import companyLogo from '../assets/logos/Company_logo.png';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();
    const { isDark } = useTheme();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Portfolio', path: '/portfolio' },
        { name: 'Pricing', path: '/pricing' },
        { name: 'Contact', path: '/contact' }
    ];

    const handleNavClick = () => {
        setIsMenuOpen(false);
    };

    return (
        <motion.header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled
                    ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg'
                    : 'bg-transparent'
            }`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <nav className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/">
                        <motion.div
                            className="flex items-center"
                            whileHover={{ scale: 1.05 }}
                        >
                            <img 
                                src={companyLogo} 
                                alt="The Innovation Curve" 
                                className="h-10 w-10 transition-all duration-300 dark:filter dark:invert dark:brightness-0 dark:contrast-100"
                            />
                            <span className="ml-3 text-xl font-bold text-primary-600 dark:text-primary-400 hidden sm:inline">
                                The Innovation Curve
                            </span>
                        </motion.div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`transition-colors duration-200 hover:text-primary-600 dark:hover:text-primary-400 ${
                                    location.pathname === item.path
                                        ? 'text-primary-600 dark:text-primary-400 font-semibold'
                                        : 'text-gray-700 dark:text-gray-300'
                                }`}
                            >
                                <motion.span
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {item.name}
                                </motion.span>
                            </Link>
                        ))}
                        <ThemeToggle className="ml-4" />
                    </div>

                    {/* Mobile Menu Toggle + Theme Toggle */}
                    <div className="md:hidden flex items-center space-x-4">
                        <ThemeToggle />
                        <motion.button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-700 dark:text-gray-300 p-2"
                            whileTap={{ scale: 0.95 }}
                        >
                            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                        </motion.button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            className="md:hidden mt-4 py-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-lg shadow-lg"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={handleNavClick}
                                    className={`block px-4 py-2 transition-colors duration-200 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800 ${
                                        location.pathname === item.path
                                            ? 'text-primary-600 dark:text-primary-400 font-semibold'
                                            : 'text-gray-700 dark:text-gray-300'
                                    }`}
                                >
                                    <motion.span whileHover={{ x: 10 }}>
                                        {item.name}
                                    </motion.span>
                                </Link>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </motion.header>
    );
};

export default Header;