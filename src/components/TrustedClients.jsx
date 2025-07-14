import { motion } from 'framer-motion';
import { FiStar, FiExternalLink } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';

import CIWUWLogo from '../assets/logos/CIWUW-lg.jpg';

const TrustedClients = () => {
    const { isDark } = useTheme();

    const trustedClient = {
        company: 'CIWUW',
        ceo: 'Grace',
        ceoTitle: 'CEO & Founder',
        logo: CIWUWLogo,
        testimonial: 'WebCraft Pro has been instrumental in our digital transformation. Their expertise in creating both our marketplace and tattoo booking platform has helped us establish a strong online presence. The quality of work and attention to detail is exceptional.',
        rating: 5,
        projects: [
            {
                name: 'CIWUW Marketplace',
                description: 'Multi-vendor e-commerce platform',
                url: 'https://github.com/Windyphan/CIWUW_market_web',
                tech: ['React', 'Node.js', 'MongoDB', 'Stripe']
            },
            {
                name: 'CIWUW Tattoo Platform',
                description: 'Tattoo artist booking and portfolio system',
                url: 'https://github.com/Windyphan/CIWUW_tatoo_web',
                tech: ['React', 'Express', 'PostgreSQL', 'Calendar API']
            },
            {
                name: 'Internal Email Platform',
                description: 'Custom email management system',
                url: 'https://github.com/Windyphan/internal-email-platform',
                tech: ['Node.js', 'React', 'Email APIs', 'Authentication']
            }
        ],
        partnership: 'Ongoing since 2024',
        industry: 'E-commerce & Beauty Services'
    };

    const additionalTestimonials = [
        {
            name: 'Sarah Johnson',
            role: 'Marketing Director',
            company: 'TechStart Solutions',
            content: 'Exceptional web development services. The team delivered exactly what we needed.',
            rating: 5,
            image: 'https://images.unsplash.com/photo-1494790108755-2616b612b06c?auto=format&fit=crop&w=400&q=80'
        },
        {
            name: 'Michael Chen',
            role: 'Operations Manager',
            company: 'GrowthCorp',
            content: 'Professional, reliable, and incredibly skilled. Highly recommended for any web project.',
            rating: 5,
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
        }
    ];

    return (
        <section id="trusted-clients" className={`section-padding transition-colors duration-300 ${
            isDark ? 'bg-gray-800' : 'bg-white'
        }`}>
            <div className="container-max">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className={`text-3xl md:text-4xl font-bold mb-4 transition-colors duration-300 ${
                        isDark ? 'text-gray-100' : 'text-gray-900'
                    }`}>
                        Our Trusted Partners
                    </h2>
                    <p className={`text-xl max-w-3xl mx-auto transition-colors duration-300 ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                        Building long-term partnerships with businesses who trust us with their digital success
                    </p>
                </motion.div>

                {/* Featured Client - CIWUW */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className={`rounded-3xl p-8 md:p-12 mb-16 border transition-colors duration-300 ${
                        isDark
                            ? 'bg-gradient-to-br from-gray-700 to-gray-800 border-gray-600'
                            : 'bg-gradient-to-br from-primary-50 to-white border-primary-100'
                    }`}
                >
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Client Info */}
                        <div>
                            <div className="flex items-center mb-6">
                                <div className={`p-4 rounded-2xl shadow-sm mr-4 transition-colors duration-300 ${
                                    isDark ? 'bg-gray-600' : 'bg-white'
                                }`}>
                                    <div className={`text-2xl font-bold transition-colors duration-300 ${
                                        isDark ? 'text-primary-400' : 'text-primary-600'
                                    }`}>CIWUW</div>
                                </div>
                                <div>
                                    <div className={`text-sm uppercase tracking-wide transition-colors duration-300 ${
                                        isDark ? 'text-gray-400' : 'text-gray-600'
                                    }`}>Featured Client</div>
                                    <div className={`font-semibold transition-colors duration-300 ${
                                        isDark ? 'text-gray-100' : 'text-gray-900'
                                    }`}>{trustedClient.industry}</div>
                                </div>
                            </div>

                            <blockquote className={`text-lg mb-6 italic transition-colors duration-300 ${
                                isDark ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                                "{trustedClient.testimonial}"
                            </blockquote>

                            <div className="flex items-center mb-6">
                                <img
                                    src="https://images.unsplash.com/photo-1494790108755-2616b612b06c?auto=format&fit=crop&w=400&q=80"
                                    alt={trustedClient.ceo}
                                    className="w-12 h-12 rounded-full mr-4 object-cover"
                                />
                                <div>
                                    <div className={`font-semibold transition-colors duration-300 ${
                                        isDark ? 'text-gray-100' : 'text-gray-900'
                                    }`}>{trustedClient.ceo}</div>
                                    <div className={`transition-colors duration-300 ${
                                        isDark ? 'text-gray-300' : 'text-gray-600'
                                    }`}>{trustedClient.ceoTitle}, {trustedClient.company}</div>
                                </div>
                            </div>

                            <div className="flex items-center mb-6">
                                {[...Array(trustedClient.rating)].map((_, i) => (
                                    <FiStar key={i} className="text-yellow-400 fill-current" size={20} />
                                ))}
                                <span className={`ml-2 transition-colors duration-300 ${
                                    isDark ? 'text-gray-300' : 'text-gray-600'
                                }`}>Partnership: {trustedClient.partnership}</span>
                            </div>
                        </div>

                        {/* Projects */}
                        <div>
                            <h3 className={`text-xl font-bold mb-6 transition-colors duration-300 ${
                                isDark ? 'text-gray-100' : 'text-gray-900'
                            }`}>Projects Delivered</h3>
                            <div className="space-y-4">
                                {trustedClient.projects.map((project, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.8, delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                        className={`rounded-xl p-6 shadow-sm border transition-colors duration-300 ${
                                            isDark
                                                ? 'bg-gray-700 border-gray-600'
                                                : 'bg-white border-gray-100'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <h4 className={`font-semibold transition-colors duration-300 ${
                                                isDark ? 'text-gray-100' : 'text-gray-900'
                                            }`}>{project.name}</h4>
                                            <a
                                                href={project.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`transition-colors ${
                                                    isDark
                                                        ? 'text-primary-400 hover:text-primary-300'
                                                        : 'text-primary-600 hover:text-primary-700'
                                                }`}
                                            >
                                                <FiExternalLink size={16} />
                                            </a>
                                        </div>
                                        <p className={`mb-3 transition-colors duration-300 ${
                                            isDark ? 'text-gray-300' : 'text-gray-600'
                                        }`}>{project.description}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {project.tech.map((tech, techIndex) => (
                                                <span
                                                    key={techIndex}
                                                    className={`px-2 py-1 rounded text-xs font-medium transition-colors duration-300 ${
                                                        isDark
                                                            ? 'bg-primary-900/30 text-primary-400'
                                                            : 'bg-primary-100 text-primary-600'
                                                    }`}
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Additional Testimonials */}
                <div className="grid md:grid-cols-2 gap-8">
                    {additionalTestimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className={`rounded-xl p-6 transition-colors duration-300 ${
                                isDark ? 'bg-gray-700' : 'bg-gray-50'
                            }`}
                        >
                            <div className="flex items-center mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <FiStar key={i} className="text-yellow-400 fill-current" size={16} />
                                ))}
                            </div>
                            <blockquote className={`mb-4 italic transition-colors duration-300 ${
                                isDark ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                                "{testimonial.content}"
                            </blockquote>
                            <div className="flex items-center">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    className="w-10 h-10 rounded-full mr-3 object-cover"
                                />
                                <div>
                                    <div className={`font-semibold transition-colors duration-300 ${
                                        isDark ? 'text-gray-100' : 'text-gray-900'
                                    }`}>{testimonial.name}</div>
                                    <div className={`text-sm transition-colors duration-300 ${
                                        isDark ? 'text-gray-300' : 'text-gray-600'
                                    }`}>{testimonial.role}, {testimonial.company}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustedClients;