import { motion } from 'framer-motion';
import { FiUsers, FiAward, FiTrendingUp, FiClock } from 'react-icons/fi';
import Lottie from 'lottie-react';
import { useState, useEffect, useRef } from 'react';

// Import the optimized animation
import aboutAnimation from '../assets/About_section_animation.json';

const About = () => {
    const [isInView, setIsInView] = useState(false);
    const [animationLoaded, setAnimationLoaded] = useState(false);
    const lottieRef = useRef(null);

    const stats = [
        { icon: FiUsers, value: '50+', label: 'Happy Clients' },
        { icon: FiAward, value: '100+', label: 'Projects Completed' },
        { icon: FiTrendingUp, value: '99%', label: 'Success Rate' },
        { icon: FiClock, value: '5+', label: 'Years Experience' },
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
        animationData: aboutAnimation,
        loop: true,
        autoplay: false,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
            clearCanvas: true,
            progressiveLoad: true,
        }
    };

    return (
        <section id="about" className="section-padding bg-white">
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
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                            About WebCraft Pro
                        </h2>
                        <p className="text-lg text-gray-600 mb-6">
                            We are a UK-based web development company specializing in creating exceptional digital experiences. Our mission is to help businesses thrive online through innovative web solutions that combine cutting-edge technology with outstanding design.
                        </p>
                        <p className="text-lg text-gray-600 mb-8">
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
                                        className="bg-primary-100 rounded-full p-2 mr-4"
                                        whileHover={{ scale: 1.1 }}
                                    >
                                        <item.icon className="text-primary-600" size={20} />
                                    </motion.div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                                        <p className="text-gray-600">{item.desc}</p>
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
                        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden rounded-xl">
                            {animationLoaded ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 1 }}
                                >
                                    <Lottie
                                        ref={lottieRef}
                                        {...lottieOptions}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            opacity: 0.25,
                                            willChange: 'auto',
                                            transform: 'translateZ(0)',
                                        }}
                                    />
                                </motion.div>
                            ) : (
                                <motion.div
                                    className="w-full h-full bg-gradient-to-br from-primary-50 to-blue-50 rounded-xl"
                                    animate={{
                                        background: [
                                            'linear-gradient(45deg, #EFF6FF, #DBEAFE)',
                                            'linear-gradient(45deg, #DBEAFE, #BFDBFE)',
                                            'linear-gradient(45deg, #EFF6FF, #DBEAFE)',
                                        ]
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />
                            )}
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-6 w-full relative z-10">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    className="bg-white/95 p-6 rounded-xl text-center shadow-lg border border-gray-100 backdrop-blur-sm"
                                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{
                                        duration: 0.6,
                                        delay: index * 0.15,
                                        type: "spring",
                                        stiffness: 100
                                    }}
                                    viewport={{ once: true }}
                                    whileHover={{
                                        scale: 1.05,
                                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                                        y: -5
                                    }}
                                >
                                    <motion.div
                                        initial={{ scale: 0, rotate: -180 }}
                                        whileInView={{ scale: 1, rotate: 0 }}
                                        transition={{
                                            duration: 0.8,
                                            delay: index * 0.15 + 0.3,
                                            type: "spring",
                                            stiffness: 200
                                        }}
                                        viewport={{ once: true }}
                                    >
                                        <stat.icon className="text-primary-600 mx-auto mb-4" size={32} />
                                    </motion.div>
                                    <motion.div
                                        className="text-3xl font-bold text-gray-900 mb-2"
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5, delay: index * 0.15 + 0.5 }}
                                        viewport={{ once: true }}
                                    >
                                        {stat.value}
                                    </motion.div>
                                    <div className="text-gray-600">{stat.label}</div>
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