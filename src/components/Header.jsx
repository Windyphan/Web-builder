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
        { name: 'Pricing', path: '/pricing' },
        { name: 'Contact', path: '/contact' }
    ];

    const handleNavClick = () => {
        setIsMenuOpen(false);

        // ULTRA AGGRESSIVE scroll to top - execute IMMEDIATELY
        const ultimateScrollToTop = () => {
            // Method 1: Standard scrollTo with instant behavior
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

            // Method 2: Direct property assignment
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;

            // Method 3: Force pageYOffset to 0
            try {
                window.pageYOffset = 0;
            } catch (e) {
                // Some browsers don't allow setting pageYOffset
            }

            // Method 4: Using scrollIntoView
            document.body.scrollIntoView({ behavior: 'instant', block: 'start' });

            // Method 5: CSS scroll behavior override
            document.documentElement.style.scrollBehavior = 'auto';
            window.scrollTo(0, 0);
        };

        // Execute IMMEDIATELY (before React Router processes the navigation)
        ultimateScrollToTop();

        // Execute multiple times at different intervals to catch any async rendering
        setTimeout(ultimateScrollToTop, 0);
        setTimeout(ultimateScrollToTop, 1);
        setTimeout(ultimateScrollToTop, 10);
        setTimeout(ultimateScrollToTop, 25);
        setTimeout(ultimateScrollToTop, 50);
        setTimeout(ultimateScrollToTop, 100);
        setTimeout(ultimateScrollToTop, 200);

        requestAnimationFrame(ultimateScrollToTop);
        requestAnimationFrame(() => {
            setTimeout(ultimateScrollToTop, 0);
        });
    };

    return (
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
                    <Link to="/" onClick={handleNavClick}>
                        <motion.div
                            className="font-display text-2xl font-extrabold bg-gradient-to-r from-primary-600 via-accent-500 to-primary-700 dark:from-primary-400 dark:via-accent-400 dark:to-primary-500 bg-clip-text text-transparent tracking-tight"
                            whileHover={{ scale: 1.05 }}
                        >
                            The Innovation Curve
                        </motion.div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={handleNavClick}
                                className={`relative transition-all duration-300 hover:text-accent-500 dark:hover:text-accent-400 ${
                                    location.pathname === item.path
                                        ? 'text-accent-600 dark:text-accent-400 font-bold'
                                        : 'text-navy-700 dark:text-navy-300 font-medium'
                                }`}
                            >
                                <motion.span
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="relative z-10"
                                >
                                    {item.name}
                                </motion.span>
                                {location.pathname === item.path && (
                                    <motion.div
                                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-accent rounded-full"
                                        layoutId="activeTab"
                                        initial={false}
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                            </Link>
                        ))}
                        <ThemeToggle className="ml-4" />
                    </div>

                    <div className="md:hidden flex items-center space-x-4">
                        <ThemeToggle />
                        <motion.button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-navy-700 dark:text-navy-300 p-2 rounded-lg hover:bg-navy-100 dark:hover:bg-navy-800 transition-colors"
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
                            className="md:hidden mt-4 py-4 bg-gradient-card dark:bg-gradient-card-dark backdrop-blur-xl rounded-2xl shadow-premium dark:shadow-premium-dark border border-navy-200/20 dark:border-navy-700/20"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="flex flex-col space-y-4 px-4">
                                {navItems.map((item, index) => (
                                    <motion.div
                                        key={item.path}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Link
                                            to={item.path}
                                            onClick={handleNavClick}
                                            className={`block py-3 px-4 rounded-xl transition-all duration-300 font-medium ${
                                                location.pathname === item.path
                                                    ? 'bg-gradient-accent text-white shadow-glow'
                                                    : 'text-navy-700 dark:text-navy-300 hover:bg-accent-50 dark:hover:bg-navy-800 hover:text-accent-600 dark:hover:text-accent-400'
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
            </nav>
        </motion.header>
    );
};

export default Header;