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
        <section id="pricing" className="section-padding bg-gradient-to-br from-white via-navy-50 to-primary-50 dark:from-navy-950 dark:via-navy-900 dark:to-navy-800">
            <div className="container-max">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="font-display text-display-lg md:text-6xl font-black bg-gradient-to-r from-navy-900 via-primary-600 to-accent-600 dark:from-navy-100 dark:via-primary-400 dark:to-accent-400 bg-clip-text text-transparent mb-6 tracking-headline">
                        Transparent Pricing
                    </h2>
                    <p className="font-body text-xl md:text-2xl text-navy-600 dark:text-navy-300 max-w-3xl mx-auto leading-relaxed font-bold">
                        Choose the perfect plan for your project. No hidden fees, no surprises.
                    </p>
                </motion.div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className={`relative flex flex-col rounded-3xl shadow-premium dark:shadow-premium-dark p-8 min-h-[650px] group hover:scale-105 transition-all duration-300 ${
                                plan.popular 
                                    ? 'bg-gradient-navy dark:bg-gradient-card-dark ring-2 ring-accent-500 shadow-glow' 
                                    : 'bg-gradient-card dark:bg-gradient-card-dark hover:shadow-glow-blue'
                            }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-gradient-accent text-white px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap shadow-glow animate-glow-pulse">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            <div className="text-center mb-8">
                                <h3 className={`text-2xl font-bold mb-4 min-h-[3.5rem] flex items-center justify-center leading-tight ${
                                    plan.popular 
                                        ? 'text-white' 
                                        : 'text-navy-900 dark:text-navy-100'
                                }`}>
                                    {plan.name}
                                </h3>
                                <div className={`text-4xl lg:text-5xl font-bold mb-4 ${
                                    plan.popular 
                                        ? 'text-accent-400' 
                                        : 'text-primary-600 dark:text-primary-400'
                                }`}>
                                    {plan.price}
                                </div>
                                <div className={`flex items-center justify-center mb-6 ${
                                    plan.popular 
                                        ? 'text-navy-300' 
                                        : 'text-navy-500 dark:text-navy-400'
                                }`}>
                                    <FiClock className="mr-2 flex-shrink-0" size={18} />
                                    <span className="font-medium">{plan.duration}</span>
                                </div>
                                <p className={`text-base min-h-[4rem] flex items-center justify-center leading-relaxed ${
                                    plan.popular 
                                        ? 'text-navy-200' 
                                        : 'text-navy-600 dark:text-navy-300'
                                }`}>
                                    {plan.description}
                                </p>
                            </div>

                            <ul className="space-y-4 mb-8 flex-grow">
                                {plan.features.map((feature, featureIndex) => (
                                    <li key={featureIndex} className="flex items-start">
                                        <FiCheck className={`mt-1 mr-3 flex-shrink-0 ${
                                            plan.popular 
                                                ? 'text-accent-400' 
                                                : 'text-primary-500'
                                        }`} size={18} />
                                        <span className={`leading-relaxed ${
                                            plan.popular 
                                                ? 'text-navy-100' 
                                                : 'text-navy-700 dark:text-navy-300'
                                        }`}>
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleGetQuote(plan.id)}
                                className={`w-full mt-auto py-4 px-6 rounded-xl font-bold transition-all duration-300 flex items-center justify-center text-base group-hover:scale-105 ${
                                    plan.popular
                                        ? 'bg-gradient-accent hover:shadow-glow text-white transform hover:scale-110'
                                        : 'bg-gradient-primary hover:bg-gradient-accent text-white hover:shadow-glow-blue'
                                }`}
                            >
                                {plan.buttonText}
                                <FiArrowRight className="ml-3 flex-shrink-0 transition-transform group-hover:translate-x-1" size={18} />
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* Add-ons Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="bg-gradient-card dark:bg-gradient-card-dark rounded-3xl shadow-premium dark:shadow-premium-dark p-8 lg:p-12"
                >
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-navy-900 via-primary-600 to-accent-600 dark:from-navy-100 dark:via-primary-400 dark:to-accent-400 bg-clip-text text-transparent mb-8 text-center">
                        Optional Add-ons
                    </h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {addOns.map((addon, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="border-2 border-navy-200 dark:border-navy-700 rounded-2xl p-6 hover:border-accent-400 dark:hover:border-accent-500 transition-all duration-300 min-h-[140px] flex flex-col hover:shadow-lg hover:scale-105 bg-white/50 dark:bg-navy-800/50 backdrop-blur-sm"
                            >
                                <div className="flex justify-between items-start mb-4 gap-3">
                                    <h4 className="font-bold text-navy-900 dark:text-navy-100 leading-tight flex-1">
                                        {addon.name}
                                    </h4>
                                    <span className="bg-gradient-accent bg-clip-text text-transparent font-bold whitespace-nowrap flex-shrink-0 text-lg">
                                        {addon.price}
                                    </span>
                                </div>
                                <p className="text-navy-600 dark:text-navy-300 text-sm leading-relaxed flex-grow">
                                    {addon.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Notification */}
                {showNotification && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -50, scale: 0.9 }}
                        className="fixed top-6 right-6 bg-gradient-accent text-white px-8 py-4 rounded-2xl shadow-glow z-50 font-bold"
                    >
                        Quote request sent! We'll contact you soon.
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default Pricing;