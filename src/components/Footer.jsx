import { motion } from 'framer-motion';
import { FiLinkedin, FiGithub, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const quickLinks = [
        { name: 'Home', href: '#home' },
        { name: 'About', href: '#about' },
        { name: 'Services', href: '#services' },
        { name: 'Portfolio', href: '#portfolio' },
        { name: 'Team', href: '#team' },
        { name: 'Contact', href: '#contact' }
    ];

    const services = [
        'Web Development',
        'E-commerce Solutions',
        'UI/UX Design',
        'Mobile Apps',
        'Website Maintenance',
        'Consultation'
    ];

    return (
        <footer className="bg-gradient-navy dark:bg-gradient-to-br dark:from-navy-950 dark:via-navy-900 dark:to-navy-800 text-white">
            <div className="container-max section-padding">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="font-display text-2xl font-bold bg-gradient-to-r from-white via-primary-200 to-accent-400 bg-clip-text text-transparent mb-4">
                            The Innovation Curve
                        </h3>
                        <p className="font-body text-navy-200 mb-6 leading-relaxed">
                            Building digital excellence through innovative web solutions. We help businesses thrive online with cutting-edge technology and outstanding design.
                        </p>
                        <div className="flex space-x-4">
                            <a
                                href="https://www.linkedin.com/company/the-innovation-curve/"
                                className="p-2 bg-navy-800 text-navy-200 hover:bg-accent-600 hover:text-white rounded-lg transition-all duration-300 hover:scale-110"
                            >
                                <FiLinkedin size={20} />
                            </a>
                            <a
                                href="https://github.com/Windyphan"
                                className="p-2 bg-navy-800 text-navy-200 hover:bg-primary-600 hover:text-white rounded-lg transition-all duration-300 hover:scale-110"
                            >
                                <FiGithub size={20} />
                            </a>
                            <a
                                href="mailto:info@theinnovationcurve.com"
                                className="p-2 bg-navy-800 text-navy-200 hover:bg-accent-600 hover:text-white rounded-lg transition-all duration-300 hover:scale-110"
                            >
                                <FiMail size={20} />
                            </a>
                        </div>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        viewport={{ once: true }}
                    >
                        <h4 className="font-display text-lg font-bold text-white mb-4">
                            Quick Links
                        </h4>
                        <ul className="space-y-2">
                            {quickLinks.map((link, index) => (
                                <li key={index}>
                                    <a
                                        href={link.href}
                                        className="font-body text-navy-200 hover:text-accent-400 transition-colors duration-200"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Services */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <h4 className="font-display text-lg font-bold text-white mb-4">
                            Services
                        </h4>
                        <ul className="space-y-2">
                            {services.map((service, index) => (
                                <li key={index}>
                                    <span className="font-body text-navy-200">
                                        {service}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        viewport={{ once: true }}
                    >
                        <h4 className="font-display text-lg font-bold text-white mb-4">
                            Contact Info
                        </h4>
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <FiMail className="text-accent-400 mr-3" size={18} />
                                <a
                                    href="mailto:info@theinnovationcurve.com"
                                    className="font-body text-navy-200 hover:text-accent-400 transition-colors duration-200"
                                >
                                    info@theinnovationcurve.com
                                </a>
                            </div>
                            <div className="flex items-center">
                                <FiPhone className="text-accent-400 mr-3" size={18} />
                                <a
                                    href="tel:07340764930"
                                    className="font-body text-navy-200 hover:text-accent-400 transition-colors duration-200"
                                >
                                    07340764930
                                </a>
                            </div>
                            <div className="flex items-center">
                                <FiMapPin className="text-accent-400 mr-3" size={18} />
                                <span className="font-body text-navy-200">
                                    United Kingdom
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="border-t border-navy-700 mt-12 pt-8 text-center"
                >
                    <p className="font-body text-navy-300">
                        © {currentYear} The Innovation Curve. All rights reserved.
                    </p>
                </motion.div>
            </div>
        </footer>
    );
};

export default Footer;