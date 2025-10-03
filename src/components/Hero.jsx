import { motion } from 'framer-motion';
import { FiArrowRight, FiPlay } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const Hero = () => {
    const [isVisible, setIsVisible] = useState(false);
    const { isDark } = useTheme();

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <section
            id="home"
            className="pt-16 relative overflow-hidden transition-colors duration-300"
            style={{ minHeight: '100vh' }}
        >
            {/* Vimeo Background */}
            <div className="absolute inset-0 z-0">
                <div style={{padding: '56.25% 0 0 0', position: 'relative', width: '100%', height: '100%'}}>
                    <iframe
                        src="https://player.vimeo.com/video/1124235622?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&loop=1&muted=1"
                        frameBorder="0"
                        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}
                        title="1350205-hd_1920_1080_30fps"
                    ></iframe>
                </div>
                <script src="https://player.vimeo.com/api/player.js"></script>
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
