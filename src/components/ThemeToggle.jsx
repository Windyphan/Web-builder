import React from 'react';
import { motion } from 'framer-motion';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
    const { isDark, toggleTheme } = useTheme();

    return (
        <motion.button
            onClick={toggleTheme}
            className={`relative w-14 h-7 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                isDark
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-gray-200 hover:bg-gray-300'
            } ${className}`}
            whileTap={{ scale: 0.95 }}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
            <motion.div
                className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors duration-300 ${
                    isDark
                        ? 'bg-gray-900 text-yellow-400'
                        : 'bg-white text-gray-700'
                }`}
                animate={{
                    x: isDark ? 24 : 0,
                }}
                transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                }}
            >
                <motion.div
                    initial={false}
                    animate={{
                        rotate: isDark ? 0 : 180,
                        scale: isDark ? 0.8 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                >
                    {isDark ? <FiMoon size={12} /> : <FiSun size={12} />}
                </motion.div>
            </motion.div>
        </motion.button>
    );
};

export default ThemeToggle;