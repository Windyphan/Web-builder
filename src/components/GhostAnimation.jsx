import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const GhostAnimation = () => {
    const { isDark } = useTheme();
    const [ghosts, setGhosts] = useState([]);

    useEffect(() => {
        // Only generate ghosts in dark mode
        if (!isDark) return;

        // Generate random ghosts at intervals
        const generateGhost = () => {
            const newGhost = {
                id: Date.now() + Math.random(),
                startY: Math.random() * 60 + 10, // Random Y position between 10% and 70%
                startX: Math.random() > 0.5 ? -100 : window.innerWidth + 100, // Start from left or right
                direction: Math.random() > 0.5 ? 1 : -1, // 1 for left-to-right, -1 for right-to-left
                delay: Math.random() * 2,
                duration: 10 + Math.random() * 8, // Random duration between 10-18 seconds (slower, more ghostly)
                size: 50 + Math.random() * 40, // Random size between 50-90px
                floatPattern: Math.random(), // Random float pattern
            };

            setGhosts(prev => [...prev, newGhost]);

            // Remove ghost after animation completes
            setTimeout(() => {
                setGhosts(prev => prev.filter(ghost => ghost.id !== newGhost.id));
            }, (newGhost.duration + newGhost.delay) * 1000);
        };

        // Generate first ghost immediately
        generateGhost();

        // Generate new ghosts at random intervals (every 5-10 seconds)
        const interval = setInterval(() => {
            generateGhost();
        }, 1000 + Math.random() * 1000);

        return () => clearInterval(interval);
    }, [isDark]);

    // Don't show ghosts in light mode
    if (!isDark) {
        return null;
    }

    return (
        <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
            <AnimatePresence>
                {ghosts.map(ghost => (
                    <motion.div
                        key={ghost.id}
                        initial={{
                            x: ghost.startX,
                            y: `${ghost.startY}vh`,
                            opacity: 0,
                            scale: 0.7
                        }}
                        animate={{
                            x: ghost.direction > 0 ? window.innerWidth + 100 : -100,
                            y: [
                                `${ghost.startY}vh`,
                                `${ghost.startY - 8}vh`,
                                `${ghost.startY + 6}vh`,
                                `${ghost.startY - 5}vh`,
                                `${ghost.startY + 4}vh`,
                                `${ghost.startY - 3}vh`,
                                `${ghost.startY}vh`
                            ],
                            opacity: [0, 0.7, 0.9, 0.8, 0.9, 0.7, 0],
                            scale: [0.7, 1, 0.95, 1, 0.95, 1, 0.7],
                            rotate: ghost.direction > 0
                                ? [0, -3, 3, -2, 2, -1, 0]
                                : [0, 3, -3, 2, -2, 1, 0]
                        }}
                        exit={{ opacity: 0 }}
                        transition={{
                            duration: ghost.duration,
                            delay: ghost.delay,
                            ease: "easeInOut",
                            y: {
                                duration: ghost.duration,
                                ease: "easeInOut",
                                times: [0, 0.15, 0.35, 0.5, 0.65, 0.85, 1]
                            },
                            opacity: {
                                duration: ghost.duration,
                                times: [0, 0.1, 0.3, 0.5, 0.7, 0.9, 1]
                            },
                            rotate: {
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }
                        }}
                        style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                        }}
                    >
                        <img
                            src="https://media.giphy.com/media/qScirtwx8kNmyf1xPR/giphy.gif"
                            alt="Flying ghost"
                            style={{
                                width: `${ghost.size}px`,
                                height: 'auto',
                                transform: ghost.direction < 0 ? 'scaleX(-1)' : 'scaleX(1)',
                                filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.6)) drop-shadow(0 4px 12px rgba(0,0,0,0.3))',
                            }}
                        />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default GhostAnimation;

