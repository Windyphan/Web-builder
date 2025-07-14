import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiArrowRight, FiClock, FiUsers, FiTrendingUp } from 'react-icons/fi';

const Pricing = () => {
    const [selectedPlan, setSelectedPlan] = useState('professional');

    const plans = [
        {
            id: 'starter',
            name: 'Starter Package',
            price: '£1,500',
            duration: '2-3 weeks',
            description: 'Perfect for small businesses and personal websites',
            features: [
                'Up to 5 pages',
                'Responsive design',
                'Basic SEO optimization',
                'Contact form integration',
                'Mobile-friendly',
                '3 months free support',
                'Basic analytics setup'
            ],
            popular: false,
            buttonText: 'Get Started'
        },
        {
            id: 'professional',
            name: 'Professional Package',
            price: '£3,500',
            duration: '4-6 weeks',
            description: 'Ideal for growing businesses with advanced features',
            features: [
                'Up to 15 pages',
                'Custom design & branding',
                'Advanced SEO optimization',
                'CMS integration',
                'E-commerce functionality (up to 50 products)',
                'Payment gateway integration',
                'Advanced analytics',
                '6 months free support',
                'Performance optimization',
                'Security features'
            ],
            popular: true,
            buttonText: 'Most Popular'
        },
        {
            id: 'enterprise',
            name: 'Enterprise Package',
            price: '£7,500+',
            duration: '8-12 weeks',
            description: 'Comprehensive solutions for large businesses',
            features: [
                'Unlimited pages',
                'Custom web application',
                'Advanced e-commerce (unlimited products)',
                'Multi-vendor marketplace',
                'Custom integrations & APIs',
                'Advanced user management',
                'Real-time chat integration',
                'Email marketing platform',
                '12 months free support',
                'Dedicated project manager',
                'Training sessions included',
                'Ongoing consultation'
            ],
            popular: false,
            buttonText: 'Contact Us'
        }
    ];

    const addOns = [
        { name: 'Additional Page', price: '£150', description: 'Extra custom page design' },
        { name: 'Blog Setup', price: '£300', description: 'Complete blog system with CMS' },
        { name: 'Multi-language Support', price: '£500', description: 'Support for multiple languages' },
        { name: 'Advanced Analytics', price: '£200', description: 'Detailed tracking and reporting' },
        { name: 'Live Chat Integration', price: '£250', description: 'Real-time customer support' },
        { name: 'Social Media Integration', price: '£180', description: 'Connect all social platforms' }
    ];

    const handleGetQuote = (planId) => {
        // Scroll to contact section or open contact modal
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section id="pricing" className="section-padding bg-gray-50">
            <div className="container-max">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Transparent Pricing
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
                            className={`relative bg-white rounded-2xl shadow-lg p-8 ${
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
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                    {plan.name}
                                </h3>
                                <div className="text-4xl font-bold text-primary-600 mb-2">
                                    {plan.price}
                                </div>
                                <div className="flex items-center justify-center text-gray-500 mb-4">
                                    <FiClock className="mr-2" size={16} />
                                    <span>{plan.duration}</span>
                                </div>
                                <p className="text-gray-600">
                                    {plan.description}
                                </p>
                            </div>

                            <ul className="space-y-4 mb-8">
                                {plan.features.map((feature, featureIndex) => (
                                    <li key={featureIndex} className="flex items-start">
                                        <FiCheck className="text-green-500 mr-3 mt-1 flex-shrink-0" size={16} />
                                        <span className="text-gray-700">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleGetQuote(plan.id)}
                                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center ${
                                    plan.popular
                                        ? 'bg-primary-600 hover:bg-primary-700 text-white'
                                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
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
                    className="bg-white rounded-2xl shadow-lg p-8"
                >
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                        Additional Services
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {addOns.map((addOn, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-semibold text-gray-900">{addOn.name}</h4>
                                    <span className="text-primary-600 font-bold">{addOn.price}</span>
                                </div>
                                <p className="text-gray-600 text-sm">{addOn.description}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Why Choose Our Pricing */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="mt-16 text-center"
                >
                    <h3 className="text-2xl font-bold text-gray-900 mb-8">
                        Why Our Pricing Works
                    </h3>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="flex flex-col items-center">
                            <div className="bg-primary-100 rounded-full p-4 mb-4">
                                <FiTrendingUp className="text-primary-600" size={24} />
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-2">No Hidden Costs</h4>
                            <p className="text-gray-600">What you see is what you pay. No surprise fees or hidden charges.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="bg-primary-100 rounded-full p-4 mb-4">
                                <FiUsers className="text-primary-600" size={24} />
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-2">Flexible Payment</h4>
                            <p className="text-gray-600">50% upfront, 50% on completion. We work with your budget.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="bg-primary-100 rounded-full p-4 mb-4">
                                <FiCheck className="text-primary-600" size={24} />
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-2">100% Satisfaction</h4>
                            <p className="text-gray-600">We guarantee your satisfaction or we'll make it right.</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Pricing;