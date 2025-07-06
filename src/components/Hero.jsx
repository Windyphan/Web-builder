import { motion } from 'framer-motion';
import { FiArrowRight, FiPlay } from 'react-icons/fi';
import { scrollToSection } from '../utils/scrollUtils';
import Lottie from 'lottie-react';
import heroAnimation from '../assets/Hero_section_animation.json';

const Hero = () => {
    const handleGetConsultation = () => {
        scrollToSection('contact');
    };

    const handleViewWork = () => {
        scrollToSection('portfolio');
    };

    return (
        <section
            id="home"
            className="pt-16 bg-gradient-to-br from-primary-50 to-white relative overflow-hidden"
            style={{ minHeight: '600px' }} // adjust as needed
        >
            {/* Lottie Animation as right-half background */}
            <div
                className="absolute top-0 bottom-0 right-0 w-full lg:w-1/2 h-full pointer-events-none z-0"
                aria-hidden="true"
                style={{ minHeight: '600px' }}
            >
                <Lottie
                    animationData={heroAnimation}
                    loop
                    autoplay
                    style={{
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        objectFit: 'cover',
                        opacity: 0.18, // LIGHT overlay
                    }}
                />
                {/* Optional: very subtle overlay for legibility */}
                <div className="hidden lg:block absolute inset-0 bg-white/10" />
            </div>
            {/* Content */}
            <div className="section-padding relative z-10">
                <div className="container-max">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                                Building Digital{' '}
                                <span className="text-primary-600">Excellence</span>
                            </h1>
                            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                We create stunning, high-performance websites and applications that drive results for your business. From concept to launch, we deliver professional web solutions that exceed expectations.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={handleGetConsultation}
                                    className="btn-primary inline-flex items-center group"
                                >
                                    Get Free Consultation
                                    <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button
                                    onClick={handleViewWork}
                                    className="btn-secondary inline-flex items-center group"
                                >
                                    <FiPlay className="mr-2 group-hover:scale-110 transition-transform" />
                                    View Our Work
                                </button>
                            </div>
                        </motion.div>
                        {/* Empty right column for spacing/alignment */}
                        <div className="hidden lg:block"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;