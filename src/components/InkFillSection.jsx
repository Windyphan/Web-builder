import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const Word = ({ children, progress, range }) => {
    const { isDark } = useTheme();
    const amount = useTransform(progress, range, [0, 1]);
    const opacity = useTransform(progress, [range[0], (range[0] + range[1]) / 2, range[1]], [0.1, 1, 0.1]);

    return (
        <span className="relative mr-3 mt-3">
            <span className="absolute opacity-10">{children}</span>
            <motion.span style={{ opacity: opacity }}>{children}</motion.span>
        </span>
    );
};

const InkFillSection = () => {
    const { isDark } = useTheme();
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start 0.9', 'end 0.1']
    });

    const text = "We are a Bristol based creative digital consultancy that designs and builds for web and mobile.";
    const words = text.split(" ");

    return (
        <section ref={container} className={`relative h-screen flex items-center justify-center transition-colors duration-300 ${
            isDark ? 'bg-black text-white' : 'bg-white text-black'
        }`}>
            <div className="max-w-4xl p-10 text-4xl font-bold leading-relaxed flex flex-wrap">
                {words.map((word, i) => {
                    const start = i / words.length;
                    const end = start + (1 / words.length);
                    return <Word key={i} progress={scrollYProgress} range={[start, end]}>{word}</Word>
                })}
            </div>
        </section>
    );
};

export default InkFillSection;
