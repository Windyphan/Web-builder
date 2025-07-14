import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCode, FiSmartphone, FiGlobe, FiSettings, FiMessageCircle, FiShield } from 'react-icons/fi';
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
        <section id="services" className="section-padding bg-gray-50 dark:bg-gray-800">
            <div className="container-max">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        Our Services
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        We offer comprehensive web development services to help your business succeed online
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg dark:shadow-gray-900/20 hover:shadow-xl dark:hover:shadow-gray-900/30 transition-shadow duration-300 cursor-pointer group"
                            onClick={() => handleServiceClick(service)}
                        >
                            <div className="bg-primary-100 dark:bg-primary-900/30 rounded-full p-3 w-fit mb-4 group-hover:bg-primary-200 dark:group-hover:bg-primary-800/40 transition-colors">
                                <service.icon className="text-primary-600 dark:text-primary-400" size={24} />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                {service.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                                {service.description}
                            </p>
                            <ul className="space-y-2 mb-4">
                                {service.features.map((feature, featureIndex) => (
                                    <li key={featureIndex} className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                        <div className="w-2 h-2 bg-primary-600 dark:bg-primary-400 rounded-full mr-2"></div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <button className="text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                                Learn More →
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Service Modal */}
            <ServiceModal
                isOpen={isModalOpen}
                onClose={closeModal}
                service={selectedService}
            />
        </section>
    );
};

export default Services;