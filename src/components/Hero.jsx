import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

// Animated particles background
const AnimatedBackground = () => {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden">
            {/* Animated gradient orbs */}
            <motion.div
                className="absolute w-96 h-96 rounded-full blur-3xl opacity-20"
                style={{
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.6) 0%, transparent 70%)',
                    top: '10%',
                    left: '10%',
                }}
                animate={{
                    x: [0, 50, 0],
                    y: [0, 30, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
            <motion.div
                className="absolute w-80 h-80 rounded-full blur-3xl opacity-20"
                style={{
                    background: 'radial-gradient(circle, rgba(168, 85, 247, 0.6) 0%, transparent 70%)',
                    top: '60%',
                    right: '15%',
                }}
                animate={{
                    x: [0, -40, 0],
                    y: [0, 40, 0],
                    scale: [1, 1.15, 1],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Floating particles */}
            {[...Array(15)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-30"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        y: [0, -30, 0],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: 3 + Math.random() * 4,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                        ease: "easeInOut"
                    }}
                />
            ))}

            {/* Subtle grid overlay */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage:
                        'linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
                    backgroundSize: '50px 50px',
                }}
            />
        </div>
    );
};

const Hero = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <section
            id="home"
            className="relative overflow-hidden bg-gray-900 flex items-center justify-center"
            style={{ minHeight: '100vh' }}
        >
            <AnimatedBackground />

            {/* Main Content */}
            <div className="container mx-auto px-6 relative z-10 flex flex-col justify-center items-center text-center pt-24">
                <motion.h1
                    className="font-display text-hero-lg md:text-hero-xl font-black mb-6 bg-gradient-to-r from-white via-gray-300 to-primary-100 bg-clip-text text-transparent tracking-headline"
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
                    className="font-body text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-gray-300 font-medium leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    We help you create stunning, responsive websites.
                </motion.p>

            </div>

        </section>
    );
};

export default Hero;
