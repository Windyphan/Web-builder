import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const VideoSection = () => {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"] // Start animation when section enters viewport from bottom, end when it exits from top
    });

    // Create more dramatic scaling: start very small (0.3) and grow to full size (1)
    const scale = useTransform(scrollYProgress, [0, 0.7], [0.3, 1]);
    // Animate vertical position for smooth entry
    const y = useTransform(scrollYProgress, [0, 0.5], ["30%", "0%"]);
    // Add opacity animation for smoother entrance
    const opacity = useTransform(scrollYProgress, [0, 0.3], [0.5, 1]);

    return (
        <section ref={sectionRef} className="relative h-screen overflow-hidden bg-black flex items-center justify-center">
            <motion.div
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    x: '-50%', // Center horizontally
                    y: y,      // Animated vertical position
                    scale: scale, // Animated scale
                    opacity: opacity, // Animated opacity
                    width: '100%', // Container fills the section
                    height: '100%', // Container fills the section
                    overflow: 'hidden', // Hide parts of the video that go beyond the container during scaling
                }}
            >
                <iframe
                    src="https://player.vimeo.com/video/1124235622?background=1&autoplay=1&loop=1&muted=1"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '100vw', // Ensure it covers the viewport width
                        height: '56.25vw', // Maintain 16:9 aspect ratio
                        minWidth: '100%', // Ensure it covers at least 100% of its parent (motion.div)
                        minHeight: '100%', // Ensure it covers at least 100% of its parent (motion.div)
                        transform: 'translate(-50%, -50%)', // Center the iframe within its parent
                    }}
                    title="background video"
                ></iframe>
            </motion.div>
        </section>
    );
};

export default VideoSection;
