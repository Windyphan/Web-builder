import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiClock, FiArrowRight } from 'react-icons/fi';

const Pricing = () => {
    const [showNotification, setShowNotification] = useState(false);

    const plans = [
        {
            id: 'starter',
            name: 'Starter Package',
            price: '£899',
            duration: '2-3 weeks',
            description: 'Perfect for small businesses and personal websites',
            popular: false,
            features: [
                'Responsive design (up to 5 pages)',
                'Contact form integration',
                'Basic SEO optimization',
                'Social media integration',
                'Mobile-friendly design',
                'Free SSL certificate',
                'Basic analytics setup',
                '3 months free hosting'
            ],
            buttonText: 'Get Started'
        },
        {
            id: 'professional',
            name: 'Professional Package',
            price: '£1,599',
            duration: '3-4 weeks',
            description: 'Ideal for growing businesses and e-commerce',
            popular: true,
            features: [
                'Responsive design (up to 10 pages)',
                'E-commerce functionality (up to 50 products)',
                'Advanced SEO optimization',
                'Content management system',
                'Payment gateway integration',
                'Free SSL certificate',
                'Google Analytics & Search Console',
                '6 months free hosting',
                'Social media integration',
                'Newsletter signup form'
            ],
            buttonText: 'Most Popular'
        },
        {
            id: 'enterprise',
            name: 'Enterprise Package',
            price: '£2,999',
            duration: '4-6 weeks',
            description: 'For large businesses with complex requirements',
            popular: false,
            features: [
                'Unlimited pages',
                'Advanced e-commerce (unlimited products)',
                'Custom functionality development',
                'Multi-language support',
                'Advanced SEO & performance optimization',
                'Custom integrations (CRM, APIs)',
                'Priority support',
                '12 months free hosting',
                'Advanced analytics dashboard',
                'Training & documentation'
            ],
            buttonText: 'Contact Us'
        }
    ];

    const addOns = [
        { name: 'Logo Design', price: '£199', description: 'Professional logo design with multiple concepts' },
        { name: 'Content Creation', price: '£299', description: 'Professional copywriting for all pages' },
        { name: 'Photography', price: '£399', description: 'Professional product or business photography' },
        { name: 'Additional Pages', price: '£99', description: 'Per additional page beyond package limit' },
        { name: 'Rush Delivery', price: '£499', description: 'Priority development for faster delivery' }
    ];

    const handleGetQuote = (planId) => {
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
    };

    return (
        <section id="pricing" className="section-padding bg-white dark:bg-gray-900">
            <div className="container-max">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        Transparent Pricing
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Choose the perfect package for your business needs. All prices include hosting setup and SSL certificate.
                    </p>
                </motion.div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/20 p-8 ${
                                plan.popular ? 'ring-2 ring-primary-500 scale-105' : ''
                            }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                                    {plan.name}
                                </h3>
                                <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                                    {plan.price}
                                </div>
                                <div className="flex items-center justify-center text-gray-500 dark:text-gray-400 mb-4">
                                    <FiClock className="mr-2" size={16} />
                                    <span>{plan.duration}</span>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300">
                                    {plan.description}
                                </p>
                            </div>

                            <ul className="space-y-4 mb-8">
                                {plan.features.map((feature, featureIndex) => (
                                    <li key={featureIndex} className="flex items-start">
                                        <FiCheck className="text-green-500 mr-3 mt-1 flex-shrink-0" size={16} />
                                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleGetQuote(plan.id)}
                                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center ${
                                    plan.popular
                                        ? 'bg-primary-600 hover:bg-primary-700 text-white'
                                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100'
                                }`}
                            >
                                {plan.buttonText}
                                <FiArrowRight className="ml-2" size={16} />
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* Add-ons Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/20 p-8"
                >
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
                        Additional Services
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {addOns.map((addon, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">{addon.name}</h4>
                                    <span className="text-primary-600 dark:text-primary-400 font-bold">{addon.price}</span>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">{addon.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Notification */}
                {showNotification && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
                    >
                        Quote request sent! We'll contact you soon.
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default Pricing;