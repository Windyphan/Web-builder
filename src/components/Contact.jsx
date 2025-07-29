import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiClock } from 'react-icons/fi';

const Contact = () => {
    const contactInfo = [
        {
            icon: FiMail,
            title: 'Email',
            content: 'info@theinnovationcurve.com',
            link: 'mailto:info@theinnovationcurve.com'
        },
        {
            icon: FiPhone,
            title: 'Phone',
            content: '07340764930',
            link: 'tel:07340764930'
        },
        {
            icon: FiMapPin,
            title: 'Location',
            content: 'United Kingdom',
            link: '#'
        },
        {
            icon: FiClock,
            title: 'Response Time',
            content: 'Within 24 hours',
            link: '#'
        }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission here
        console.log('Form submitted');
    };

    return (
        <section id="contact" className="section-padding bg-gray-50 dark:bg-gray-800">
            <div className="container-max">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        Get In Touch
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Ready to start your project? Let's discuss how we can help bring your vision to life
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Information */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                            Let's Start a Conversation
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-8">
                            We'd love to hear about your project and discuss how we can help you achieve your digital goals. Get in touch with us for a free consultation.
                        </p>

                        <div className="space-y-6">
                            {contactInfo.map((info, index) => (
                                <motion.div
                                    key={index}
                                    className="flex items-start"
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <div className="bg-primary-100 dark:bg-primary-900/30 rounded-full p-3 mr-4">
                                        <info.icon className="text-primary-600 dark:text-primary-400" size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                            {info.title}
                                        </h4>
                                        {info.link !== '#' ? (
                                            <a
                                                href={info.link}
                                                className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                                            >
                                                {info.content}
                                            </a>
                                        ) : (
                                            <span className="text-gray-600 dark:text-gray-300">{info.content}</span>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Why Choose Us */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            viewport={{ once: true }}
                            className="mt-8 p-6 bg-white dark:bg-gray-700 rounded-xl shadow-sm"
                        >
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                Why Choose Us?
                            </h4>
                            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                                <li className="flex items-center">
                                    <div className="w-2 h-2 bg-primary-600 dark:bg-primary-400 rounded-full mr-3"></div>
                                    Free consultation and project estimate
                                </li>
                                <li className="flex items-center">
                                    <div className="w-2 h-2 bg-primary-600 dark:bg-primary-400 rounded-full mr-3"></div>
                                    Fast response within 24 hours
                                </li>
                                <li className="flex items-center">
                                    <div className="w-2 h-2 bg-primary-600 dark:bg-primary-400 rounded-full mr-3"></div>
                                    Transparent pricing with no hidden costs
                                </li>
                                <li className="flex items-center">
                                    <div className="w-2 h-2 bg-primary-600 dark:bg-primary-400 rounded-full mr-3"></div>
                                    3+ years of proven track record
                                </li>
                            </ul>
                        </motion.div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-lg dark:shadow-gray-900/20"
                    >
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                            Send Us a Message
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                                        placeholder="Your Name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Phone (Optional)
                                </label>
                                <input
                                    type="tel"
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                                    placeholder="Your phone number"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Project Type
                                </label>
                                <select className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-200">
                                    <option value="">Select a service</option>
                                    <option value="web-development">Web Development</option>
                                    <option value="ecommerce">E-commerce Solution</option>
                                    <option value="mobile-app">Mobile App</option>
                                    <option value="maintenance">Website Maintenance</option>
                                    <option value="consultation">Consultation</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Budget Range
                                </label>
                                <select className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-200">
                                    <option value="">Select budget range</option>
                                    <option value="under-1000">Under £1,000</option>
                                    <option value="1000-3000">£1,000 - £3,000</option>
                                    <option value="3000-5000">£3,000 - £5,000</option>
                                    <option value="5000-10000">£5,000 - £10,000</option>
                                    <option value="over-10000">Over £10,000</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Project Details *
                                </label>
                                <textarea
                                    rows="6"
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                                    placeholder="Tell us about your project, goals, timeline, and any specific requirements..."
                                ></textarea>
                            </div>

                            <motion.button
                                type="submit"
                                className="w-full bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Send Message
                            </motion.button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Or contact us directly at{' '}
                                <a
                                    href="mailto:info@theinnovationcurve.com"
                                    className="text-primary-600 dark:text-primary-400 hover:underline"
                                >
                                    info@theinnovationcurve.com
                                </a>
                                {' '}or{' '}
                                <a
                                    href="tel:07340764930"
                                    className="text-primary-600 dark:text-primary-400 hover:underline"
                                >
                                    07340764930
                                </a>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Contact;