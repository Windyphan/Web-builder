import { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { FiAward, FiClock, FiUsers } from 'react-icons/fi';
import Lottie from 'lottie-react';
import { useThemeAnimation } from '../hooks/useThemeAnimation';

const About = () => {
    const [isInView, setIsInView] = useState(false);
    const [animationLoaded, setAnimationLoaded] = useState(false);
    const lottieRef = useRef(null);
    const animationData = useThemeAnimation('about');

    const stats = [
        { value: '50+', label: 'Projects Completed' },
        { value: '30+', label: 'Happy Clients' },
        { value: '3+', label: 'Years Experience' },
        { value: '99%', label: 'Client Satisfaction' }
    ];

    useEffect(() => {
        if (isInView && !animationLoaded) {
            const timer = setTimeout(() => {
                setAnimationLoaded(true);
                if (lottieRef.current && typeof lottieRef.current.play === 'function') {
                    lottieRef.current.play();
                }
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isInView, animationLoaded]);

    const lottieOptions = {
        animationData: animationData,
        loop: true,
        autoplay: true,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
            clearCanvas: true,
            progressiveLoad: true,
        }
    };

    return (
        <section id="about" className="section-padding bg-white dark:bg-gray-900">
            <div className="container-max">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Content (Left) */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        onViewportEnter={() => setIsInView(true)}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                            About The Innovation Curve
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                            We are a UK-based web development company specializing in creating exceptional digital experiences. Our mission is to help businesses thrive online through innovative web solutions that combine cutting-edge technology with outstanding design.
                        </p>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                            Founded by experienced developer Phong Minh Phan, we bring years of expertise in modern web technologies, ensuring your project is built with the latest industry standards and best practices.
                        </p>

                        {/* Why Choose Us */}
                        <div className="space-y-4">
                            {[
                                { icon: FiAward, title: "Quality First", desc: "We never compromise on quality and deliver pixel-perfect solutions" },
                                { icon: FiClock, title: "On-Time Delivery", desc: "We respect deadlines and deliver projects on schedule" },
                                { icon: FiUsers, title: "Client-Focused", desc: "Your success is our priority, and we're with you every step" }
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    className="flex items-start"
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <motion.div
                                        className="bg-primary-100 dark:bg-primary-900/30 rounded-full p-2 mr-4"
                                        whileHover={{ scale: 1.1 }}
                                    >
                                        <item.icon className="text-primary-600 dark:text-primary-400" size={20} />
                                    </motion.div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{item.title}</h4>
                                        <p className="text-gray-600 dark:text-gray-300">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Animation + Stats (Right) */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="relative flex items-center justify-center min-h-[340px]"
                    >
                        {/* Optimized Lottie Background */}
                        <motion.div
                            className="w-80 h-80 flex items-center justify-center"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 0.3 }}
                            viewport={{ once: true }}
                        >
                            {animationLoaded && (
                                <Lottie
                                    lottieRef={lottieRef}
                                    {...lottieOptions}
                                    className="w-full h-full opacity-80 dark:opacity-60"
                                />
                            )}
                        </motion.div>

                        {/* Stats positioned over animation */}
                        <div className="absolute inset-0 grid grid-cols-2 gap-4 p-8">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 text-center shadow-lg border border-white/20 dark:border-gray-700/50"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.6, delay: index * 0.15 }}
                                    viewport={{ once: true }}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <motion.div
                                        className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-1"
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5, delay: index * 0.15 + 0.5 }}
                                        viewport={{ once: true }}
                                    >
                                        {stat.value}
                                    </motion.div>
                                    <div className="text-gray-600 dark:text-gray-300">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default About;