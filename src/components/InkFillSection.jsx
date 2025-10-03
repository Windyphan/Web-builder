import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const Character = ({ children, progress, range }) => {
    const { isDark } = useTheme();
    const amount = useTransform(progress, range, [0, 1]);
    const color = useTransform(amount, [0, 1], [
        isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        isDark ? "rgba(255, 255, 255, 1)" : "rgba(0, 0, 0, 1)"
    ]);

    return (
        <motion.span style={{ color }}>
            {/* Use a non-breaking space to ensure spaces are rendered correctly in flex layout */}
            {children === ' ' ? '\u00A0' : children}
        </motion.span>
    );
};

const InkFillSection = () => {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start 0.2', 'end 0.9'] // Widen the scroll area for a smoother animation
    });

    const lines = [
        "We are a Bristol based creative digital",
        "consultancy that designs and builds for",
        "web and mobile."
    ];

    return (
        <section ref={container} className="relative bg-white dark:bg-black transition-colors duration-300" style={{ minHeight: '150vh' }}>
            <div className="sticky top-0 h-screen flex items-center justify-center">
                <div className="max-w-4xl p-10 text-5xl font-display font-bold leading-tight flex flex-col items-center text-center">
                    {lines.map((line, lineIndex) => {
                        const characters = line.split('');
                        const lineDuration = 0.5;
                        const lineOverlap = 0.2;
                        const lineStart = lineIndex * (lineDuration - lineOverlap);

                        return (
                            <p key={lineIndex} className="flex flex-wrap justify-center">
                                {characters.map((char, charIndex) => {
                                    const charStart = lineStart + (charIndex / characters.length) * lineDuration;
                                    const charEnd = charStart + (0.5 / characters.length) * lineDuration;

                                    return (
                                        <Character key={charIndex} progress={scrollYProgress} range={[charStart, charEnd]}>
                                            {char}
                                        </Character>
                                    );
                                })}
                            </p>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default InkFillSection;
