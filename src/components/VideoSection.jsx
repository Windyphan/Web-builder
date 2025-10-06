import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const VideoSection = () => {
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
        <section ref={sectionRef} className="relative bg-gray-900 py-20 overflow-hidden">
            {/* Video Background with Lighter Overlay */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 via-gray-900/40 to-gray-900/60 z-10"></div>
                <iframe
                    src="https://player.vimeo.com/video/1124235622?background=1&autoplay=1&loop=1&muted=1"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    className="absolute top-1/2 left-1/2 w-screen h-screen object-cover"
                    style={{
                        transform: 'translate(-50%, -50%)',
                        minWidth: '100%',
                        minHeight: '100%',
                    }}
                    title="background video"
                ></iframe>
            </div>

            {/* Content */}
            <motion.div
                className="container mx-auto px-6 relative z-20"
                style={{ opacity, scale }}
            >
                {/* Section Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-5xl md:text-6xl font-display font-black text-white mb-4 drop-shadow-lg">
                        How We
                        <span className="block bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
                            Create Magic
                        </span>
                    </h2>
                    <p className="text-xl text-gray-100 max-w-2xl mx-auto font-medium drop-shadow-md">
                        From concept to launch, we follow a proven process that delivers exceptional results
                    </p>
                </motion.div>

                {/* Process Steps Grid */}
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {processSteps.map((step, index) => (
                        <motion.div
                            key={index}
                            className="bg-gray-900/70 backdrop-blur-md p-8 rounded-2xl border border-gray-600/50 hover:border-blue-400/70 transition-all duration-300 shadow-xl"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.2)" }}
                        >
                            <div className="flex items-start gap-4">
                                <span className="text-5xl font-black text-blue-400/40">
                                    {step.number}
                                </span>
                                <div>
                                    <h3 className="text-2xl font-display font-bold text-white mb-3 drop-shadow-md">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-200 leading-relaxed drop-shadow-sm">
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
