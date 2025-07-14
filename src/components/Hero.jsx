import { motion } from 'framer-motion';
import { FiArrowRight, FiPlay } from 'react-icons/fi';
import { scrollToSection } from '../utils/scrollUtils';
import Lottie from 'lottie-react';
import { useState, useEffect, useRef } from 'react';

// Import the optimized animation
import heroAnimation from '../assets/Hero_section_animation.json';

const Hero = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);
    const lottieRef = useRef();

    useEffect(() => {
        // Delay animation start to prevent initial load freeze
        const timer = setTimeout(() => {
            setShouldRender(true);
            setIsVisible(true);
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    const handleGetConsultation = () => {
        scrollToSection('contact');
    };

    const handleViewWork = () => {
        scrollToSection('portfolio');
    };

    // Optimized Lottie options
    const lottieOptions = {
        animationData: heroAnimation,
        loop: true,
        autoplay: false, // We'll control this manually
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
            clearCanvas: true,
            progressiveLoad: true,
            hideOnTransparent: true,
        }
    };

    // Start animation when component is visible
    useEffect(() => {
        if (isVisible && lottieRef.current) {
            setTimeout(() => {
                lottieRef.current.play();
            }, 200);
        }
    }, [isVisible]);

    return (
        <section
            id="home"
            className="pt-16 bg-gradient-to-br from-primary-50 to-white relative overflow-hidden"
            style={{ minHeight: '600px' }}
        >
            {/* Optimized Lottie Animation Background */}
            <div
                className="absolute top-0 bottom-0 right-0 w-full lg:w-1/2 h-full pointer-events-none z-0"
                aria-hidden="true"
                style={{ minHeight: '600px' }}
            >
                {shouldRender && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isVisible ? 1 : 0 }}
                        transition={{ duration: 1 }}
                        className="w-full h-full"
                    >
                        <Lottie
                            ref={lottieRef}
                            {...lottieOptions}
                            style={{
                                width: '100%',
                                height: '100%',
                                position: 'absolute',
                                right: 0,
                                top: 0,
                                objectFit: 'cover',
                                opacity: 0.3,
                                // Performance optimizations
                                willChange: 'auto',
                                transform: 'translateZ(0)',
                            }}
                        />
                    </motion.div>
                )}

                {/* Fallback gradient while loading */}
                {!shouldRender && (
                    <div className="w-full h-full bg-gradient-to-br from-primary-100 to-blue-100 opacity-20" />
                )}

                <div className="hidden lg:block absolute inset-0 bg-white/5" />
            </div>

            {/* Content */}
            <div className="section-padding relative z-10">
                <div className="container-max">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <motion.h1
                                className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                Building Digital{' '}
                                <motion.span
                                    className="text-primary-600"
                                    animate={{
                                        textShadow: [
                                            '0 0 0px rgba(59, 130, 246, 0)',
                                            '0 0 10px rgba(59, 130, 246, 0.3)',
                                            '0 0 0px rgba(59, 130, 246, 0)',
                                        ]
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                >
                                    Excellence
                                </motion.span>
                            </motion.h1>
                            <motion.p
                                className="text-xl text-gray-600 mb-8 leading-relaxed"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                            >
                                We create stunning, high-performance websites and applications that drive results for your business. From concept to launch, we deliver professional web solutions that exceed expectations.
                            </motion.p>
                            <motion.div
                                className="flex flex-col sm:flex-row gap-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                            >
                                <motion.button
                                    onClick={handleGetConsultation}
                                    className="btn-primary inline-flex items-center group"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Get Free Consultation
                                    <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                                <motion.button
                                    onClick={handleViewWork}
                                    className="btn-secondary inline-flex items-center group"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FiPlay className="mr-2 group-hover:scale-110 transition-transform" />
                                    View Our Work
                                </motion.button>
                            </motion.div>
                        </motion.div>
                        <div className="hidden lg:block"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;