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
        <motion.span style={{ color }} className="inline">
            {children}
        </motion.span>
    );
};

const Word = ({ word, progress, wordStart, wordDuration }) => {
    const characters = word.split('');

    return (
        <span className="inline-block whitespace-nowrap">
            {characters.map((char, charIndex) => {
                const charStart = wordStart + (charIndex / characters.length) * wordDuration;
                const charEnd = charStart + (1 / characters.length) * wordDuration;

                return (
                    <Character key={charIndex} progress={progress} range={[charStart, charEnd]}>
                        {char}
                    </Character>
                );
            })}
        </span>
    );
};

const InkFillSection = () => {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start 0.2', 'end 0.7']
    });

    const lines = [
        "We are a Bristol based creative digital",
        "consultancy that designs and builds for",
        "web and mobile."
    ];

    return (
        <section ref={container} className="relative bg-white dark:bg-black transition-colors duration-300" style={{ minHeight: '150vh' }}>
            <div className="sticky top-0 h-screen flex items-center justify-center">
                <div className="max-w-4xl p-10 text-5xl font-display font-bold leading-tight text-center">
                    {lines.map((line, lineIndex) => {
                        const words = line.split(' ');
                        const lineDuration = 0.4;
                        const lineOverlap = 0.15;
                        const lineStart = lineIndex * (lineDuration - lineOverlap);

                        return (
                            <p key={lineIndex} className="mb-4">
                                {words.map((word, wordIndex) => {
                                    const wordDuration = lineDuration / words.length;
                                    const wordStart = lineStart + (wordIndex * wordDuration);

                                    return (
                                        <span key={wordIndex}>
                                            <Word
                                                word={word}
                                                progress={scrollYProgress}
                                                wordStart={wordStart}
                                                wordDuration={wordDuration}
                                            />
                                            {wordIndex < words.length - 1 && (
                                                <Character
                                                    progress={scrollYProgress}
                                                    range={[wordStart + wordDuration * 0.8, wordStart + wordDuration]}
                                                >
                                                    {' '}
                                                </Character>
                                            )}
                                        </span>
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
