import { motion } from 'framer-motion';
import { FiArrowRight, FiPlay } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';

// Import the optimized animation
import heroAnimation from '../assets/Hero_section_animation.json';

const Hero = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [animationLoaded, setAnimationLoaded] = useState(false);
    const lottieRef = useRef(null);
    const { isDark } = useTheme();

    useEffect(() => {
        setIsVisible(true);
    }, []);

    // Enhanced animation data with theme-aware colors
    const enhancedAnimationData = {
        ...heroAnimation,
        layers: heroAnimation.layers?.map(layer => ({
            ...layer,
            ks: {
                ...layer.ks,
                o: {
                    ...layer.ks?.o,
                    k: Array.isArray(layer.ks?.o?.k)
                        ? layer.ks.o.k.map(frame => ({
                            ...frame,
                            s: frame.s ? frame.s.map(val => Math.min(val * (isDark ? 3 : 4), 100)) : [100]
                        }))
                        : Math.min((layer.ks?.o?.k || 15) * (isDark ? 4 : 6), 100)
                }
            },
            shapes: layer.shapes?.map(shape => ({
                ...shape,
                ...(shape.ty === 'fl' && {
                    c: {
                        ...shape.c,
                        k: isDark
                            ? [0.6, 0.8, 1, 1] // Light blue for dark mode
                            : shape.c?.k || [0.12, 0.15, 0.25, 1]
                    }
                })
            })) || layer.shapes
        })) || []
    };

    return (
        <section
            id="home"
            className={`pt-16 relative overflow-hidden transition-colors duration-300 ${
                isDark
                    ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
                    : 'bg-gradient-to-br from-primary-50 to-white'
            }`}
            style={{ minHeight: '100vh' }}
        >
            {/* Animated Background Particles */}
            <div className="absolute inset-0 overflow-hidden z-0">
                {/* CSS Animated Background */}
                <div className="absolute inset-0">
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            className={`absolute rounded-full transition-colors duration-300 ${
                                isDark
                                    ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10'
                                    : 'bg-gradient-to-r from-primary-200/20 to-blue-300/20'
                            }`}
                            style={{
                                width: `${100 + i * 50}px`,
                                height: `${100 + i * 50}px`,
                                left: `${10 + i * 15}%`,
                                top: `${10 + i * 10}%`,
                            }}
                            animate={{
                                x: [0, 30, 0],
                                y: [0, -20, 0],
                                rotate: [0, 180, 360],
                                scale: [1, 1.1, 1],
                            }}
                            transition={{
                                duration: 8 + i * 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: i * 0.5,
                            }}
                        />
                    ))}
                </div>

                {/* Lottie Animation Overlay */}
                <div className="absolute inset-0 z-10">
                    <Lottie
                        lottieRef={lottieRef}
                        animationData={enhancedAnimationData}
                        loop={true}
                        autoplay={true}
                        style={{
                            width: '100%',
                            height: '100%',
                            opacity: isDark ? 0.4 : 0.2,
                            filter: isDark ? 'brightness(1.5) hue-rotate(180deg)' : 'none',
                        }}
                    />
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-6 py-20 relative z-20">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.h1
                        className={`text-5xl md:text-7xl font-bold mb-6 transition-colors duration-300 ${
                            isDark ? 'text-white' : 'text-gray-900'
                        }`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={isVisible ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8 }}
                    >
                        Build Your
                        <span className="text-primary-600 dark:text-primary-400 block">
                            Digital Future
                        </span>
                    </motion.h1>

                    <motion.p
                        className={`text-xl md:text-2xl mb-8 max-w-2xl mx-auto transition-colors duration-300 ${
                            isDark ? 'text-gray-300' : 'text-gray-600'
                        }`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={isVisible ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        We create stunning, responsive websites that drive results
                        and elevate your brand in the digital landscape.
                    </motion.p>

                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={isVisible ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <Link to="/contact">
                            <motion.button
                                className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white px-8 py-4 rounded-full font-semibold flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Get Free Consultation
                                <FiArrowRight />
                            </motion.button>
                        </Link>

                        <Link to="/portfolio">
                            <motion.button
                                className={`border-2 px-8 py-4 rounded-full font-semibold flex items-center gap-2 transition-all duration-200 ${
                                    isDark
                                        ? 'border-gray-600 text-gray-300 hover:border-primary-400 hover:text-primary-400'
                                        : 'border-gray-300 text-gray-700 hover:border-primary-600 hover:text-primary-600'
                                }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FiPlay />
                                View Our Work
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;