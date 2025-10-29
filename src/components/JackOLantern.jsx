import React from 'react';
import { motion } from 'framer-motion';

// --- Main Scene Component ---
const JackOLantern = () => {
    const flickerAnimation = {
        opacity: [0.8, 0.95, 0.85, 1, 0.9, 1],
        transition: { duration: 1.2, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' },
    };

    return (
        <motion.div
            className="fixed bottom-8 right-8 z-50"
            style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))' }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.2, type: 'spring', stiffness: 120 }}
        >
            <svg
                width="200"
                height="180"
                viewBox="0 0 200 180"
                xmlns="http://www.w3.org/2000/svg"
                style={{ overflow: 'visible' }}
            >
                <defs>
                    <radialGradient id="pumpkinGradient" cx="0.5" cy="0.4" r="0.6">
                        <stop offset="0%" stopColor="#ffb74d" />
                        <stop offset="60%" stopColor="#f57c00" />
                        <stop offset="90%" stopColor="#e65100" />
                        <stop offset="100%" stopColor="#bf360c" />
                    </radialGradient>
                    <linearGradient id="stemGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#558B2F" />
                        <stop offset="100%" stopColor="#33691E" />
                    </linearGradient>
                    <filter id="carveDepthEffect">
                        {/* Inner shadow for carved effect */}
                        <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur"/>
                        <feOffset in="blur" dx="-2" dy="-2" result="offsetBlur"/>
                        <feFlood floodColor="#1a0800" floodOpacity="0.8" result="offsetColor"/>
                        <feComposite in="offsetColor" in2="offsetBlur" operator="in" result="offsetBlur"/>
                        <feComposite in="SourceGraphic" in2="offsetBlur" operator="over"/>
                    </filter>
                    <filter id="bloomEffect">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
                    </filter>
                    <filter id="innerGlow">
                        {/* Inner glow for the light coming from inside */}
                        <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur"/>
                        <feOffset in="blur" dx="0" dy="0" result="offsetBlur"/>
                        <feFlood floodColor="#FF8C00" floodOpacity="0.6" result="glowColor"/>
                        <feComposite in="glowColor" in2="offsetBlur" operator="in" result="glow"/>
                        <feComposite in="SourceGraphic" in2="glow" operator="over"/>
                    </filter>
                </defs>

                {/* --- Pumpkin Body Group --- */}
                <g>
                    <ellipse cx="100" cy="165" rx="80" ry="15" fill="rgba(0,0,0,0.4)" />
                    <path
                        d="M 100,25 C 25,25 10,70 15,120 C 20,160 50,170 100,170 C 150,170 180,160 185,120 C 190,70 175,25 100,25 Z"
                        fill="url(#pumpkinGradient)"
                        stroke="#8a2d0f"
                        strokeWidth="2"
                    />
                    <g fill="none" stroke="#bf360c" opacity="0.6">
                        <path d="M 100,26 Q 125,30 120,168" strokeWidth="3" />
                        <path d="M 100,26 Q 75,30 80,168" strokeWidth="3" />
                        <path d="M 105,26 Q 160,30 133,160" strokeWidth="2.5" opacity="0.8" />
                        <path d="M 95,26 Q 40,30 66,160" strokeWidth="2.5" opacity="0.8" />
                        <path d="M 105,26 Q 200,30 148,160" strokeWidth="2.5" opacity="0.8" />
                        <path d="M 95,26 Q 0,30 52,160" strokeWidth="2.5" opacity="0.8" />
                    </g>
                </g>

                {/* --- Pumpkin Face and Lighting --- */}
                {/* Dark carved edges to show depth */}
                <g>
                    <path d="M 50,65 L 85,80 L 65,95 Z" fill="#bd5902" opacity="0.9" />
                    <path d="M 150,65 L 115,80 L 135,95 Z" fill="#bd5902" opacity="0.9" />
                    <path d="M 95,98 L 105,98 L 100,110 Z" fill="#bd5902" opacity="0.9" />
                    <path
                        d="M 45,120 C 60,140 80,145 100,145 C 120,145 140,140 155,120 L 145,130 L 130,122 L 115,135 L 100,125 L 85,135 L 70,122 L 55,130 Z"
                        fill="#bd5902"
                        opacity="0.9"
                    />
                </g>

                {/* Inner carved shadows */}
                <g opacity="0.7">
                    <path d="M 52,67 L 83,79 L 66,93 Z" fill="#f5804c" />
                    <path d="M 148,67 L 117,79 L 134,93 Z" fill="#f5804c" />
                    <path d="M 96,99 L 104,99 L 100,109 Z" fill="#f5804c" />
                    <path
                        d="M 47,121 C 61,139 81,143 100,143 C 119,143 139,139 153,121 L 144,129 L 131,123 L 116,134 L 100,126 L 84,134 L 69,123 L 56,129 Z"
                        fill="#f5804c"
                    />
                </g>

                {/* Bright inner glow with flicker */}
                <motion.g filter="url(#bloomEffect)" animate={flickerAnimation}>
                    <path d="M 55,70 L 80,78 L 67,90 Z" fill="#FFF4E0" />
                    <path d="M 145,70 L 120,78 L 133,90 Z" fill="#FFF4E0" />
                    <path d="M 97,100 L 103,100 L 100,108 Z" fill="#FFF4E0" />
                    <path
                        d="M 50,123 C 63,138 82,142 100,142 C 118,142 137,138 150,123 L 143,128 L 132,124 L 118,133 L 100,127 L 82,133 L 68,124 L 57,128 Z"
                        fill="#FFF4E0"
                    />
                </motion.g>

                {/* Mid-tone orange glow */}
                <motion.g animate={flickerAnimation}>
                    <path d="M 56,71 L 79,79 L 68,89 Z" fill="#FFB300" opacity="0.8" />
                    <path d="M 144,71 L 121,79 L 132,89 Z" fill="#FFB300" opacity="0.8" />
                    <path d="M 97,101 L 103,101 L 100,107 Z" fill="#FFB300" opacity="0.8" />
                    <path
                        d="M 51,124 C 62,137 83,141 100,141 C 117,141 138,137 149,124 L 142,127 L 133,125 L 119,132 L 100,128 L 81,132 L 67,125 L 58,127 Z"
                        fill="#FFB300"
                        opacity="0.8"
                    />
                </motion.g>

                {/* --- Pumpkin Stem --- */}
                <path
                    d="M 95,26 C 90,15 100,10 110,18 C 115,22 105,28 100,26 Z"
                    fill="url(#stemGradient)"
                    stroke="#1B5E20"
                    strokeWidth="1.5"
                />

            </svg>
        </motion.div>
    );
};

export default JackOLantern;
