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
        { value: '30+', label: 'Happy Clients' },
        { value: '100%', label: 'Client Satisfaction' }
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
        <section id="about" className="section-padding bg-gradient-to-br from-white via-navy-50 to-primary-50 dark:from-navy-950 dark:via-navy-900 dark:to-navy-800">
            <div className="container-max">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Content (Left) */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <div>
                            <h2 className="font-display text-display-lg md:text-6xl font-black bg-gradient-to-r from-navy-900 via-primary-600 to-accent-600 dark:from-navy-100 dark:via-primary-400 dark:to-accent-400 bg-clip-text text-transparent mb-6 tracking-headline">
                                About Us
                            </h2>
                            <p className="font-body text-xl md:text-2xl text-navy-600 dark:text-navy-300 mb-6 font-bold leading-relaxed">
                                We're passionate about creating digital experiences that make a difference.
                            </p>
                            <p className="font-body text-navy-600 dark:text-navy-300 leading-relaxed mb-6 font-semibold">
                                At The Innovation Curve, we believe in the power of technology to transform businesses.
                                Our team combines creativity with technical expertise to deliver solutions that not only
                                look great but perform exceptionally.
                            </p>
                            <p className="font-body text-navy-600 dark:text-navy-300 leading-relaxed font-semibold">
                                From startups to established enterprises, we've helped countless businesses establish
                                their digital presence and achieve their goals through innovative web solutions.
                            </p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-6 pt-8">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="text-center bg-gradient-card dark:bg-gradient-card-dark rounded-2xl p-6 shadow-premium dark:shadow-premium-dark border border-navy-200/20 dark:border-navy-700/20"
                                >
                                    <div className="font-display text-3xl md:text-4xl font-extrabold bg-gradient-accent bg-clip-text text-transparent mb-2">
                                        {stat.value}
                                    </div>
                                    <div className="font-body text-navy-600 dark:text-navy-300 text-sm font-medium">
                                        {stat.label}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Animation (Right) */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="relative"
                        onViewportEnter={() => setIsInView(true)}
                    >
                        <div className="aspect-square max-w-lg mx-auto">
                            {animationData && (
                                <Lottie
                                    lottieRef={lottieRef}
                                    {...lottieOptions}
                                    className="w-full h-full"
                                />
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default About;