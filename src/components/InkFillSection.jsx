import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const Character = ({ children, progress, range }) => {
    const { isDark } = useTheme();
    const amount = useTransform(progress, range, [0, 1]);
    const color = useTransform(amount, [0, 1], [isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)", isDark ? "rgba(255, 255, 255, 1)" : "rgba(0, 0, 0, 1)"]);

    return (
        <motion.span style={{ color: color }}>{children}</motion.span>
    );
};

const InkFillSection = () => {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start 0.2', 'end 0.8']
    });

    const text = "We are a Bristol based creative digital consultancy that designs and builds for web and mobile.";
    const lines = text.split('. ');

    return (
        <section ref={container} className="relative bg-white dark:bg-black transition-colors duration-300" style={{ minHeight: '120vh' }}>
            <div className="sticky top-0 h-screen flex items-center justify-center">
                <div className="max-w-4xl p-10 text-5xl font-display font-bold leading-tight flex flex-col">
                    {lines.map((line, lineIndex) => {
                        const words = line.split(' ');
                        const characters = words.flatMap(word => [...word.split(''), ' ']);
                        return (
                            <p key={lineIndex} className="flex flex-wrap">
                                {characters.map((char, charIndex) => {
                                    const start = (lineIndex * 0.3) + (charIndex / characters.length) * 0.7;
                                    const end = start + (1 / characters.length) * 0.7;
                                    return <Character key={charIndex} progress={scrollYProgress} range={[start, end]}>{char}</Character>
                                })}
                            </p>
                        )
                    })}
                </div>
            </div>
        </section>
    );
};

export default InkFillSection;
