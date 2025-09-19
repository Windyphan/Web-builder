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
            className="pt-16 relative overflow-hidden transition-colors duration-300 bg-gradient-hero dark:bg-gradient-to-br dark:from-navy-950 dark:via-navy-900 dark:to-navy-800"
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
                                    ? 'bg-gradient-to-r from-primary-500/20 to-accent-500/20'
                                    : 'bg-gradient-to-r from-primary-200/30 to-accent-200/30'
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
                <div className="max-w-5xl mx-auto text-center">
                    <motion.h1
                        className="font-display text-hero-lg md:text-hero-xl font-black mb-6 transition-colors duration-300 bg-gradient-to-r from-white via-navy-100 to-primary-100 dark:from-white dark:via-primary-200 dark:to-accent-200 bg-clip-text text-transparent tracking-headline"
                        initial={{ opacity: 0, y: 30 }}
                        animate={isVisible ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8 }}
                    >
                        Build Your
                        <span className="block bg-gradient-accent bg-clip-text text-transparent font-black tracking-tighter leading-tight">
                            Digital Future
                        </span>
                    </motion.h1>

                    <motion.p
                        className="font-body text-xl md:text-2xl mb-8 max-w-2xl mx-auto transition-colors duration-300 text-navy-100 dark:text-navy-200 font-medium leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={isVisible ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        We help you create stunning, responsive websites.
                    </motion.p>

                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={isVisible ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                    </motion.div>

                    {/* Stats Section */}
                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-2 gap-8 mt-16 pt-16 border-t border-white/20"
                        initial={{ opacity: 0, y: 20 }}
                        animate={isVisible ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.6 }}
                    >
                        {[
                            { number: '100%', label: 'Client Satisfaction' },
                            { number: '24/7', label: 'Support Available' }
                        ].map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="font-display text-4xl md:text-5xl font-extrabold bg-gradient-accent bg-clip-text text-transparent mb-2">
                                    {stat.number}
                                </div>
                                <div className="font-body text-navy-200 text-sm font-medium">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
                    <div className="w-1 h-3 bg-accent-400 rounded-full mt-2 animate-pulse"></div>
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;