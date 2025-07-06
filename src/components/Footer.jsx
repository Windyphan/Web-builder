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
        <footer className="bg-gray-900 text-white">
            <div className="container-max section-padding">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="text-2xl font-bold text-white mb-4">
                            WebCraft Pro
                        </h3>
                        <p className="text-gray-300 mb-6">
                            Building digital excellence through innovative web solutions. We help businesses thrive online with cutting-edge technology and outstanding design.
                        </p>
                        <div className="flex space-x-4">
                            <a
                                href="https://linkedin.com/in/phong-phan"
                                className="text-gray-400 hover:text-white transition-colors duration-200"
                            >
                                <FiLinkedin size={24} />
                            </a>
                            <a
                                href="https://github.com/Windyphan"
                                className="text-gray-400 hover:text-white transition-colors duration-200"
                            >
                                <FiGithub size={24} />
                            </a>
                            <a
                                href="mailto:pmphong1999@gmail.com"
                                className="text-gray-400 hover:text-white transition-colors duration-200"
                            >
                                <FiMail size={24} />
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
                        <h4 className="text-lg font-semibold text-white mb-4">
                            Quick Links
                        </h4>
                        <ul className="space-y-2">
                            {quickLinks.map((link, index) => (
                                <li key={index}>
                                    <a
                                        href={link.href}
                                        className="text-gray-300 hover:text-white transition-colors duration-200"
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
                        <h4 className="text-lg font-semibold text-white mb-4">
                            Services
                        </h4>
                        <ul className="space-y-2">
                            {services.map((service, index) => (
                                <li key={index}>
                  <span className="text-gray-300">
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
                        <h4 className="text-lg font-semibold text-white mb-4">
                            Get In Touch
                        </h4>
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <FiMail className="mr-3 text-primary-400" size={18} />
                                <a
                                    href="mailto:pmphong1999@gmail.com"
                                    className="text-gray-300 hover:text-white transition-colors duration-200"
                                >
                                    pmphong1999@gmail.com
                                </a>
                            </div>
                            <div className="flex items-center">
                                <FiPhone className="mr-3 text-primary-400" size={18} />
                                <a
                                    href="tel:07340764930"
                                    className="text-gray-300 hover:text-white transition-colors duration-200"
                                >
                                    07340764930
                                </a>
                            </div>
                            <div className="flex items-center">
                                <FiMapPin className="mr-3 text-primary-400" size={18} />
                                <span className="text-gray-300">United Kingdom</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 mt-12 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-400 text-sm">
                            © {currentYear} WebCraft Pro. All rights reserved.
                        </p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                                Privacy Policy
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                                Terms of Service
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;