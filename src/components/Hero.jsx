import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

// Individual star component with a looping animation
const Star = ({ style }) => (
    <motion.div
        className="absolute rounded-full bg-white"
        style={style}
        initial={{ opacity: 0, scale: 0 }}
        animate={{
            opacity: [0, 1, 0.5, 1, 0],
            scale: [0, 1, 0.8, 1, 0],
        }}
        transition={{
            duration: Math.random() * 3 + 2, // Twinkle duration
            repeat: Infinity,
            repeatType: "loop",
            delay: Math.random() * 7, // Staggered start time
            ease: "easeInOut"
        }}
    />
);

// Component to generate a field of stars
const Starfield = () => {
    // Create an array of 150 stars with random positions and sizes
    const stars = Array.from({ length: 150 }).map((_, i) => {
        const size = Math.random() * 2 + 1;
        const style = {
            width: `${size}px`,
            height: `${size}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
        };
        return <Star key={i} style={style} />;
    });

    return <div className="absolute inset-0 z-0">{stars}</div>;
};

const Hero = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <section
            id="home"
            className="relative overflow-hidden bg-black flex items-center justify-center"
            style={{ minHeight: '100vh' }}
        >
            <Starfield />

            {/* Main Content */}
            <div className="container mx-auto px-6 relative z-20 flex flex-col justify-center items-center text-center pt-24">
                <motion.h1
                    className="font-display text-hero-lg md:text-hero-xl font-black mb-6 bg-gradient-to-r from-white via-navy-100 to-primary-100 bg-clip-text text-transparent tracking-headline"
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
                    className="font-body text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-navy-200 font-medium leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    We help you create stunning, responsive websites.
                </motion.p>

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
