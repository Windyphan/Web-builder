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

// New component for shooting stars
const ShootingStar = () => {
    const duration = Math.random() * 2 + 1;
    const delay = Math.random() * 5 + 5;

    return (
        <motion.div
            className="absolute h-0.5 w-24 bg-gradient-to-l from-white"
            style={{
                top: `${Math.random() * 50}%`, // Start in the top half
                left: '-100px',
            }}
            initial={{
                x: 0,
                y: 0,
                opacity: 0,
            }}
            animate={{
                x: '150vw', // Move across the screen
                y: '50vh', // and downwards
                opacity: [0, 1, 0],
            }}
            transition={{
                duration,
                delay,
                repeat: Infinity,
                repeatDelay: delay,
                ease: 'linear',
            }}
        />
    );
};

// New component for a galaxy effect
const Galaxy = () => (
    <motion.div
        className="absolute"
        style={{
            top: '15%',
            left: '25%',
            width: '50%',
            height: '50%',
            background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 70%)',
            transform: 'rotate(-25deg)'
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: [0, 0.8, 0.2, 0.8, 0], scale: 1 }}
        transition={{
            duration: 30,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut"
        }}
    />
);

// Component to generate a field of stars, now with galaxy and shooting stars
const Starfield = () => {
    // Create an array of 250 stars with random positions and sizes
    const stars = Array.from({ length: 250 }).map((_, i) => {
        const size = Math.random() * 2 + 1;
        const style = {
            width: `${size}px`,
            height: `${size}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`
        };
        return <Star key={`star-${i}`} style={style} />;
    });

    const shootingStars = Array.from({ length: 3 }).map((_, i) => (
        <ShootingStar key={`shooting-star-${i}`} />
    ));

    return (
        <div className="absolute inset-0 z-0 overflow-hidden">
            <Galaxy />
            {stars}
            {shootingStars}
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

        </section>
    );
};

export default Hero;
