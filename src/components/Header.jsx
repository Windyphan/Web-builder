import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();

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
        { name: 'Blog', path: '/blog' },
        { name: 'SEO Tool', path: '/seo-tool' },
        { name: 'Contact', path: '/contact' }
    ];

    const handleNavClick = () => {
        setIsMenuOpen(false);
        // Scroll to top logic
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    };

    return (
        <>
            <motion.header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    isScrolled
                        ? 'bg-white/90 dark:bg-navy-900/90 backdrop-blur-xl shadow-premium dark:shadow-premium-dark border-b border-navy-200/20 dark:border-navy-700/20'
                        : 'bg-transparent'
                }`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <nav className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link to="/" onClick={() => { if(isMenuOpen) handleNavClick(); else window.scrollTo({top: 0, behavior: 'instant'})}}>
                            <motion.div
                                className="font-display text-2xl font-extrabold bg-gradient-to-r from-primary-600 via-accent-500 to-primary-700 dark:from-primary-400 dark:via-accent-400 dark:to-primary-500 bg-clip-text text-transparent tracking-tight"
                                whileHover={{ scale: 1.05 }}
                            >
                                The Innovation Curve
                            </motion.div>
                        </Link>

                        {/* Header Controls */}
                        <div className="flex items-center space-x-4">
                            <ThemeToggle />
                            <motion.button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="text-navy-700 dark:text-navy-300 p-2 rounded-lg hover:bg-navy-100 dark:hover:bg-navy-800 transition-colors z-50"
                                whileTap={{ scale: 0.95 }}
                            >
                                {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                            </motion.button>
                        </div>
                    </div>
                </nav>
            </motion.header>

            {/* Fullscreen Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        className="fixed inset-0 bg-white/80 dark:bg-navy-950/90 backdrop-blur-2xl z-40 flex items-center justify-center"
                        initial={{ opacity: 0, y: '-100%' }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: '-100%' }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="flex flex-col space-y-8 text-center">
                            {navItems.map((item, index) => (
                                <motion.div
                                    key={item.path}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + index * 0.1, ease: "easeOut" }}
                                >
                                    <Link
                                        to={item.path}
                                        onClick={handleNavClick}
                                        className={`font-display text-4xl font-bold transition-colors duration-300 hover:text-accent-500 dark:hover:text-accent-400 ${
                                            location.pathname === item.path
                                                ? 'text-accent-600 dark:text-accent-400'
                                                : 'text-navy-800 dark:text-navy-200'
                                        }`}
                                    >
                                        {item.name}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Header;
