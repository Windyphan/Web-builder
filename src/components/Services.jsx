import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCode, FiSmartphone, FiShoppingCart, FiTool, FiUsers, FiMessageCircle } from 'react-icons/fi';
import ServiceModal from './ServiceModal';

const Services = () => {
    const [selectedService, setSelectedService] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const services = [
        {
            icon: FiCode,
            title: 'Custom Web Development',
            description: 'Modern, responsive websites built with React, Vue, Angular, and Node.js. We create fast, scalable solutions tailored to your business needs.',
            features: ['React & Vue.js', 'Node.js Backend', 'Database Integration', 'API Development']
        },
        {
            icon: FiShoppingCart,
            title: 'E-commerce Solutions',
            description: 'Complete online stores with secure payment processing, inventory management, and user-friendly shopping experiences.',
            features: ['Shopify Development', 'WooCommerce', 'Custom E-commerce', 'Payment Integration']
        },
        {
            icon: FiUsers,
            title: 'UI/UX Design',
            description: 'User-centered design that converts visitors into customers. We create intuitive interfaces that users love.',
            features: ['Figma Design', 'Adobe XD', 'Prototyping', 'User Research']
        },
        {
            icon: FiTool,
            title: 'Website Maintenance',
            description: 'Keep your website secure, updated, and performing at its best with our comprehensive maintenance services.',
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
        <section id="services" className="section-padding bg-gray-50">
            <div className="container-max">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Our Services
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
                            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer group"
                            onClick={() => handleServiceClick(service)}
                        >
                            <div className="bg-primary-100 rounded-full p-3 w-fit mb-4 group-hover:bg-primary-200 transition-colors">
                                <service.icon className="text-primary-600" size={24} />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                                {service.title}
                            </h3>
                            <p className="text-gray-600 mb-4">
                                {service.description}
                            </p>
                            <ul className="space-y-2 mb-4">
                                {service.features.map((feature, featureIndex) => (
                                    <li key={featureIndex} className="flex items-center text-sm text-gray-500">
                                        <div className="w-2 h-2 bg-primary-600 rounded-full mr-2"></div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <button className="text-primary-600 font-medium hover:text-primary-700 transition-colors">
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