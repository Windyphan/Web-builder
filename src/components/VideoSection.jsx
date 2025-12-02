import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const VideoSection = () => {
    const { isDark } = useTheme();
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.8]);

    const processSteps = [
        {
            number: "01",
            title: "Discovery",
            description: "We dive deep into your business goals, target audience, and vision to craft the perfect digital strategy."
        },
        {
            number: "02",
            title: "Design",
            description: "Our creative team designs stunning, user-centric interfaces that bring your brand to life."
        },
        {
            number: "03",
            title: "Development",
            description: "We build robust, scalable solutions using cutting-edge technologies and best practices."
        },
        {
            number: "04",
            title: "Deliver",
            description: "We launch your project and provide ongoing support to ensure long-term success."
        }
    ];

    return (
        <section ref={sectionRef} className={`relative overflow-hidden transition-colors duration-300 ${
            isDark ? 'bg-gradient-to-b from-navy-900 to-navy-950' : 'bg-gradient-to-b from-gray-50 to-white'
        }`}>
            {/* Video Background with Lighter Overlay */}
            <div className="absolute inset-0 z-0">
                <div className={`absolute inset-0 z-10 transition-colors duration-300 ${
                    isDark 
                        ? 'bg-gradient-to-b from-gray-900/60 via-gray-900/40 to-gray-900/60' 
                        : 'bg-gradient-to-b from-gray-100/60 via-gray-100/40 to-gray-100/60'
                }`}></div>
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                    <iframe
                        src="https://player.vimeo.com/video/1124235622?background=1&autoplay=1&loop=1&muted=1"
                        allow="autoplay; fullscreen; picture-in-picture"
                        className="border-0"
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            width: '133.33vh',
                            height: '100vh',
                            minWidth: '100vw',
                            minHeight: '75vw',
                            transform: 'translate(-50%, -50%)',
                            pointerEvents: 'none',
                        }}
                        title="background video"
                    ></iframe>
                </div>
            </div>

            {/* Content */}
            <motion.div
                className="container mx-auto px-6 relative z-20"
                style={{ opacity, scale }}
            >
                {/* Section Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <h2 className={`text-5xl md:text-6xl font-display font-black mb-4 drop-shadow-lg ${
                        isDark ? 'text-white' : 'text-navy-900'
                    }`}>
                        How We
                        <span className={`block bg-gradient-to-r bg-clip-text text-transparent drop-shadow-lg ${
                            isDark 
                                ? 'from-blue-400 to-purple-500' 
                                : 'from-primary-600 to-accent-600'
                        }`}>
                            Create Magic
                        </span>
                    </h2>
                    <p className={`text-xl max-w-2xl mx-auto font-medium drop-shadow-md ${
                        isDark ? 'text-gray-100' : 'text-navy-600'
                    }`}>
                        From concept to launch, we follow a proven process that delivers exceptional results
                    </p>
                </motion.div>

                {/* Process Steps Grid */}
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {processSteps.map((step, index) => (
                        <motion.div
                            key={index}
                            className={`backdrop-blur-md p-8 rounded-2xl transition-all duration-300 shadow-xl ${
                                isDark
                                    ? 'bg-gray-900/70 border border-gray-600/50 hover:border-blue-400/70'
                                    : 'bg-white/70 border border-gray-300/50 hover:border-primary-500/70'
                            }`}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -5, boxShadow: isDark ? "0 20px 40px rgba(59, 130, 246, 0.2)" : "0 20px 40px rgba(99, 102, 241, 0.2)" }}
                        >
                            <div className="flex items-start gap-4">
                                <span className={`text-5xl font-black ${
                                    isDark ? 'text-blue-400/40' : 'text-primary-600/40'
                                }`}>
                                    {step.number}
                                </span>
                                <div>
                                    <h3 className={`text-2xl font-display font-bold mb-3 drop-shadow-md ${
                                        isDark ? 'text-white' : 'text-navy-900'
                                    }`}>
                                        {step.title}
                                    </h3>
                                    <p className={`leading-relaxed drop-shadow-sm ${
                                        isDark ? 'text-gray-200' : 'text-navy-600'
                                    }`}>
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
};

export default VideoSection;
