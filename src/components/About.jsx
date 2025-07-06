import { motion } from 'framer-motion';
import { FiUsers, FiAward, FiTrendingUp, FiClock } from 'react-icons/fi';
import Lottie from 'lottie-react';
import aboutAnimation from '../assets/About_section_animation.json';

const About = () => {
    const stats = [
        { icon: FiUsers, value: '50+', label: 'Happy Clients' },
        { icon: FiAward, value: '100+', label: 'Projects Completed' },
        { icon: FiTrendingUp, value: '99%', label: 'Success Rate' },
        { icon: FiClock, value: '5+', label: 'Years Experience' },
    ];

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
                            <div className="flex items-start">
                                <div className="bg-primary-100 rounded-full p-2 mr-4">
                                    <FiAward className="text-primary-600" size={20} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-1">Quality First</h4>
                                    <p className="text-gray-600">We never compromise on quality and deliver pixel-perfect solutions</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="bg-primary-100 rounded-full p-2 mr-4">
                                    <FiClock className="text-primary-600" size={20} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-1">On-Time Delivery</h4>
                                    <p className="text-gray-600">We respect deadlines and deliver projects on schedule</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="bg-primary-100 rounded-full p-2 mr-4">
                                    <FiUsers className="text-primary-600" size={20} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-1">Client-Focused</h4>
                                    <p className="text-gray-600">Your success is our priority, and we're with you every step</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Animation + Stats (Right) */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="flex flex-col items-center"
                    >
                        <div className="w-72 h-72 mb-8">
                            <Lottie
                                animationData={aboutAnimation}
                                loop
                                autoplay
                                style={{ width: '100%', height: '100%' }}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-6 w-full">
                            {stats.map((stat, index) => (
                                <div key={index} className="bg-gray-50 p-6 rounded-xl text-center w-full">
                                    <stat.icon className="text-primary-600 mx-auto mb-4" size={32} />
                                    <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                                    <div className="text-gray-600">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default About;