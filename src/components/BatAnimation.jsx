import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BatAnimation = () => {
    const [bats, setBats] = useState([]);

    useEffect(() => {
        // Generate random bats at intervals
        const generateBat = () => {
            const newBat = {
                id: Date.now() + Math.random(),
                startY: Math.random() * 60 + 10, // Random Y position between 10% and 70%
                startX: Math.random() > 0.5 ? -100 : window.innerWidth + 100, // Start from left or right
                direction: Math.random() > 0.5 ? 1 : -1, // 1 for left-to-right, -1 for right-to-left
                delay: Math.random() * 2,
                duration: 8 + Math.random() * 6, // Random duration between 8-14 seconds
                size: 40 + Math.random() * 30, // Random size between 40-70px
            };

            setBats(prev => [...prev, newBat]);

            // Remove bat after animation completes
            setTimeout(() => {
                setBats(prev => prev.filter(bat => bat.id !== newBat.id));
            }, (newBat.duration + newBat.delay) * 1000);
        };

        // Generate first bat immediately
        generateBat();

        // Generate new bats at random intervals (every 4-8 seconds)
        const interval = setInterval(() => {
            generateBat();
        }, 1000 + Math.random() * 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
            <AnimatePresence>
                {bats.map(bat => (
                    <motion.div
                        key={bat.id}
                        initial={{
                            x: bat.startX,
                            y: `${bat.startY}vh`,
                            opacity: 0,
                            scale: 0.8
                        }}
                        animate={{
                            x: bat.direction > 0 ? window.innerWidth + 100 : -100,
                            y: [
                                `${bat.startY}vh`,
                                `${bat.startY - 5}vh`,
                                `${bat.startY + 8}vh`,
                                `${bat.startY - 3}vh`,
                                `${bat.startY + 5}vh`,
                                `${bat.startY}vh`
                            ],
                            opacity: [0, 1, 1, 1, 1, 0],
                            scale: [0.8, 1, 1, 1, 0.8],
                            rotate: bat.direction > 0 ? [0, -5, 5, -3, 0] : [0, 5, -5, 3, 0]
                        }}
                        exit={{ opacity: 0 }}
                        transition={{
                            duration: bat.duration,
                            delay: bat.delay,
                            ease: "linear",
                            y: { duration: bat.duration, ease: "easeInOut" },
                            rotate: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                        }}
                        style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                        }}
                    >
                        <img
                            src="https://media1.giphy.com/media/0xR7MUO0hJfWtco7C6/giphy.gif"
                            alt="Flying bat"
                            style={{
                                width: `${bat.size}px`,
                                height: 'auto',
                                transform: bat.direction < 0 ? 'scaleX(-1)' : 'scaleX(1)',
                                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                            }}
                        />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default BatAnimation;

