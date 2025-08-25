import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiClock, FiArrowRight } from 'react-icons/fi';

const Pricing = () => {
    const [showNotification, setShowNotification] = useState(false);

    const plans = [
        {
            id: 'student',
            name: 'Student / Portfolio',
            price: '£299',
            duration: '1-2 weeks',
            description: 'A professional one-page site to showcase your work or CV.',
            popular: false,
            features: [
                'Single-page "scrolling" design',
                'Built from a pre-selected premium template',
                'Mobile & tablet responsive',
                'Contact form integration',
                'Link to your social media profiles',
                'Free SSL certificate',
                '3 months free hosting'
            ],
            buttonText: 'Get Started'
        },
        {
            id: 'launchpad',
            name: 'Launchpad Package',
            price: '£1,299',
            duration: '3-4 weeks',
            description: 'Perfect for new businesses needing a professional online presence.',
            popular: false,
            features: [
                'Up to 5 custom-designed pages',
                'WordPress Content Management System (CMS)',
                'On-Page SEO Foundation',
                'Secure contact form',
                'Social media integration',
                'Google Analytics setup',
                'Mobile & tablet responsive',
                '6 months free hosting & SSL'
            ],
            buttonText: 'Choose Plan'
        },
        {
            id: 'business-growth',
            name: 'Business Growth',
            price: '£3,499',
            duration: '5-7 weeks',
            description: 'For established businesses ready to scale and sell online.',
            popular: true,
            features: [
                'All features from Launchpad Package',
                'Up to 15 pages',
                'E-commerce functionality (up to 50 products)',
                'Advanced SEO & performance tuning',
                'Blog / Content Hub setup',
                'Payment gateway integration (Stripe/PayPal)',
                'CMS training session',
                '12 months free hosting & SSL'
            ],
            buttonText: 'Most Popular'
        },
        {
            id: 'bespoke',
            name: 'Bespoke Solution',
            price: 'Starting at £7,999',
            duration: 'Project-based Timeline',
            description: 'For businesses with unique requirements needing custom solutions.',
            popular: false,
            features: [
                'Fully custom design & development',
                'Unlimited pages & products',
                'Bespoke feature development',
                'Third-party API integrations (CRM, etc.)',
                'Advanced analytics & reporting',
                'Dedicated project manager',
                'Priority support & maintenance',
                'Full documentation & training'
            ],
            buttonText: 'Book a Consultation'
        }
    ];

    const addOns = [
        { name: 'Logo & Brand Guide', price: '£399', description: 'Professional logo with a basic brand style guide.' },
        { name: 'Content Strategy & Copywriting', price: '£599', description: 'Professional, SEO-friendly copy for up to 5 pages.' },
        { name: 'Advanced SEO Pack', price: '£499', description: 'Local SEO setup, keyword research, and competitor analysis.' },
        { name: 'Additional Pages', price: '£150', description: 'Per additional page beyond package limit.' },
        { name: 'Rush Delivery', price: '25% of Total', description: 'Priority development to reduce delivery time by ~30%.' }
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
                        Our Packages
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Transparent pricing for every stage of your business journey. Find the perfect fit to achieve your goals.
                    </p>
                </motion.div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className={`relative flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/20 p-8 ${
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
                                <p className="text-gray-600 dark:text-gray-300 h-12">
                                    {plan.description}
                                </p>
                            </div>

                            <ul className="space-y-4 mb-8 flex-grow">
                                {plan.features.map((feature, featureIndex) => (
                                    <li key={featureIndex} className="flex items-start">
                                        <FiCheck className="text-green-500 mr-3 mt-1 flex-shrink-0" size={16} />
                                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleGetQuote(plan.id)}
                                className={`w-full mt-auto py-3 px-6 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center ${
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
                        Optional Add-ons
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