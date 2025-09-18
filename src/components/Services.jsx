import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCode, FiSmartphone, FiGlobe, FiMessageCircle, FiShield } from 'react-icons/fi';
import ServiceModal from './ServiceModal';

const Services = () => {
    const [selectedService, setSelectedService] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const services = [
        {
            icon: FiCode,
            title: 'Web Development',
            description: 'Custom websites and web applications built with modern technologies like React, Vue.js, and Node.js.',
            features: ['Responsive Design', 'SEO Optimized', 'Fast Loading', 'Cross-browser Compatible']
        },
        {
            icon: FiGlobe,
            title: 'E-commerce Solutions',
            description: 'Complete online stores with payment integration, inventory management, and admin dashboards.',
            features: ['Payment Gateway', 'Inventory Management', 'Order Tracking', 'Admin Dashboard']
        },
        {
            icon: FiShield,
            title: 'Website Maintenance',
            description: 'Ongoing support, security updates, performance optimization, and content management services.',
            features: ['Security Updates', 'Performance Optimization', 'Content Updates', 'Backup Solutions']
        },
        {
            icon: FiMessageCircle,
            title: 'Consultation Services',
            description: 'Strategic guidance on technology choices, architecture decisions, and digital transformation initiatives.',
            features: ['Technical Strategy', 'Architecture Planning', 'Code Review', 'Performance Audit']
        },
        {
            icon: FiSmartphone,
            title: 'Mobile App Development',
            description: 'Native and cross-platform mobile applications built with React Native and Flutter for iOS and Android.',
            features: ['React Native', 'Flutter', 'Cross-platform', 'App Store Deployment']
        }
    ];

    const handleServiceClick = (service) => {
        setSelectedService(service);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedService(null);
    };

    return (
        <section id="services" className="section-padding bg-gradient-to-br from-white via-navy-50 to-primary-50 dark:from-navy-950 dark:via-navy-900 dark:to-navy-800">
            <div className="container-max">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="font-display text-display-lg md:text-6xl font-extrabold bg-gradient-to-r from-navy-900 via-primary-600 to-accent-600 dark:from-navy-100 dark:via-primary-400 dark:to-accent-400 bg-clip-text text-transparent mb-6 tracking-headline">
                        Our Services
                    </h2>
                    <p className="font-body text-xl md:text-2xl text-navy-600 dark:text-navy-300 max-w-3xl mx-auto leading-relaxed font-medium">
                        We provide comprehensive digital solutions to help your business thrive in the modern world.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="group cursor-pointer"
                            onClick={() => handleServiceClick(service)}
                        >
                            <div className="bg-gradient-card dark:bg-gradient-card-dark rounded-3xl p-8 h-full shadow-premium dark:shadow-premium-dark hover:shadow-glow-blue dark:hover:shadow-glow transition-all duration-300 hover:scale-105 border border-navy-200/20 dark:border-navy-700/20 hover:border-accent-400/30">
                                <div className="flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-6 group-hover:bg-gradient-accent transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                    <service.icon className="text-white" size={32} />
                                </div>

                                <h3 className="font-display text-2xl font-bold text-navy-900 dark:text-navy-100 mb-4 group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors duration-300 tracking-tight">
                                    {service.title}
                                </h3>

                                <p className="font-body text-navy-600 dark:text-navy-300 mb-6 leading-relaxed">
                                    {service.description}
                                </p>

                                <ul className="space-y-2">
                                    {service.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-center text-navy-700 dark:text-navy-300">
                                            <div className="w-2 h-2 bg-gradient-accent rounded-full mr-3 flex-shrink-0"></div>
                                            <span className="font-body text-sm font-medium">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-6 pt-6 border-t border-navy-200/30 dark:border-navy-700/30">
                                    <div className="text-accent-600 dark:text-accent-400 font-semibold group-hover:text-accent-500 transition-colors duration-300 flex items-center">
                                        Learn More
                                        <motion.span
                                            className="ml-2"
                                            animate={{ x: [0, 5, 0] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        >
                                            →
                                        </motion.span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Call to Action */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    viewport={{ once: true }}
                    className="mt-24 relative"
                >
                    {/* Strategic Negative Space - Left Side */}
                    <div className="grid lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-2">
                            {/* Intentional negative space with floating accent */}
                            <div className="hidden lg:block relative h-32">
                                <div className="absolute top-8 right-0 w-8 h-8 bg-accent-500/30 rounded-full animate-pulse"></div>
                            </div>
                        </div>

                        <div className="lg:col-span-8">
                            <div className="bg-gradient-navy dark:bg-gradient-card-dark rounded-3xl shadow-premium dark:shadow-premium-dark relative overflow-hidden">
                                {/* Overlapping Background Pattern */}
                                <div className="absolute inset-0 bg-gradient-to-r from-accent-500/5 to-primary-500/5"></div>
                                <div className="absolute top-0 right-0 w-40 h-40 bg-accent-500/10 rounded-full blur-2xl transform translate-x-8 -translate-y-8"></div>

                                <div className="relative z-10 p-8 lg:p-12 text-center">
                                    <h3 className="font-display text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                                        Ready to Start Your Project?
                                    </h3>
                                    <p className="font-body text-navy-200 mb-8 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
                                        Let's discuss how we can help bring your vision to life with our expert development services.
                                    </p>
                                    <motion.button
                                        className="bg-gradient-accent hover:shadow-glow text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 shadow-premium relative overflow-hidden group"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => window.location.href = '/contact'}
                                    >
                                        <span className="relative z-10">Get Free Consultation</span>

                                        {/* Overlapping Shine Effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                    </motion.button>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-2">
                            {/* Strategic negative space with decorative element */}
                            <div className="hidden lg:block relative h-32">
                                <div className="absolute bottom-8 left-0 w-6 h-6 border-2 border-primary-500/30 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Service Modal */}
            <ServiceModal
                isOpen={isModalOpen}
                onClose={closeModal}
                service={selectedService}
            />

            {/* Overlapping Section Divider */}
            <div className="absolute bottom-0 right-0 w-full h-20 bg-gradient-to-l from-navy-800/10 to-transparent transform skew-y-1 translate-y-10 pointer-events-none"></div>
        </section>
    );
};

export default Services;