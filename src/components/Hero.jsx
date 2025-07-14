import { motion } from 'framer-motion';
import { FiArrowRight, FiPlay } from 'react-icons/fi';
import { scrollToSection } from '../utils/scrollUtils';
import Lottie from 'lottie-react';
import { useState, useEffect, useRef } from 'react';

// Import the optimized animation
import heroAnimation from '../assets/Hero_section_animation.json';

const Hero = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [animationLoaded, setAnimationLoaded] = useState(false);
    const lottieRef = useRef(null);

    useEffect(() => {
        console.log('Hero Animation Data:', heroAnimation);
        setIsVisible(true);
    }, []);

    const handleGetConsultation = () => {
        scrollToSection('contact');
    };

    const handleViewWork = () => {
        scrollToSection('portfolio');
    };

    // Enhanced animation data with higher opacity
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
                            s: frame.s ? frame.s.map(val => Math.min(val * 4, 100)) : [100]
                        }))
                        : Math.min((layer.ks?.o?.k || 15) * 6, 100)
                }
            }
        })) || []
    };

    const handleAnimationComplete = () => {
        console.log('Animation completed');
    };

    const handleAnimationLoaded = () => {
        console.log('Animation loaded successfully');
        setAnimationLoaded(true);
    };

    const handleAnimationError = (error) => {
        console.error('Animation error:', error);
    };

    return (
        <section
            id="home"
            className="pt-16 bg-gradient-to-br from-primary-50 to-white relative overflow-hidden"
            style={{ minHeight: '100vh' }}
        >
            {/* Animated Background Particles (CSS-based fallback) */}
            <div className="absolute inset-0 overflow-hidden z-0">
                {/* CSS Animated Background */}
                <div className="absolute inset-0">
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute rounded-full bg-gradient-to-r from-primary-200/20 to-blue-300/20"
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
                        onComplete={handleAnimationComplete}
                        onDOMLoaded={handleAnimationLoaded}
                        onLoadedImages={() => console.log('Images loaded')}
                        style={{
                            width: '100%',
                            height: '100%',
                            opacity: animationLoaded ? 0.8 : 0,
                            transition: 'opacity 1s ease-in-out',
                            filter: 'brightness(1.2) contrast(1.1)',
                        }}
                        rendererSettings={{
                            preserveAspectRatio: 'xMidYMid slice',
                            clearCanvas: false,
                            progressiveLoad: false,
                            hideOnTransparent: false,
                            className: 'lottie-animation'
                        }}
                    />
                </div>

                {/* Subtle overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/20 z-20" />
            </div>

            {/* Content */}
            <div className="section-padding relative z-30">
                <div className="container-max">
                    <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
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

            {/* Debug info */}
            {process.env.NODE_ENV === 'development' && (
                <div className="fixed bottom-4 right-4 bg-black/80 text-white p-2 rounded text-xs z-50">
                    <div>Animation Loaded: {animationLoaded ? '✅' : '❌'}</div>
                    <div>Layers: {heroAnimation?.layers?.length || 0}</div>
                    <div>Duration: {heroAnimation?.op || 0} frames</div>
                </div>
            )}
        </section>
    );
};

export default Hero;