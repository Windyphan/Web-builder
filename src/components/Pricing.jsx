import { motion } from 'framer-motion';
import { FiStar, FiExternalLink } from 'react-icons/fi';

const TrustedClients = () => {
    const trustedClient = {
        company: 'CIWUW',
        ceo: 'Grace',
        ceoTitle: 'CEO & Founder',
        logo: '/logos/ciwuw-logo.png', // Add CIWUW logo to public/logos/
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
        <section id="trusted-clients" className="section-padding bg-white">
            <div className="container-max">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Our Trusted Partners
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Building long-term partnerships with businesses who trust us with their digital success
                    </p>
                </motion.div>

                {/* Featured Client - CIWUW */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-br from-primary-50 to-white rounded-3xl p-8 md:p-12 mb-16 border border-primary-100"
                >
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Client Info */}
                        <div>
                            <div className="flex items-center mb-6">
                                <div className="bg-white p-4 rounded-2xl shadow-sm mr-4">
                                    <div className="text-2xl font-bold text-primary-600">CIWUW</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600 uppercase tracking-wide">Featured Client</div>
                                    <div className="font-semibold text-gray-900">{trustedClient.industry}</div>
                                </div>
                            </div>

                            <blockquote className="text-lg text-gray-700 mb-6 italic">
                                "{trustedClient.testimonial}"
                            </blockquote>

                            <div className="flex items-center mb-6">
                                <img
                                    src="https://images.unsplash.com/photo-1494790108755-2616b612b06c?auto=format&fit=crop&w=400&q=80"
                                    alt={trustedClient.ceo}
                                    className="w-12 h-12 rounded-full mr-4 object-cover"
                                />
                                <div>
                                    <div className="font-semibold text-gray-900">{trustedClient.ceo}</div>
                                    <div className="text-gray-600">{trustedClient.ceoTitle}, {trustedClient.company}</div>
                                </div>
                            </div>

                            <div className="flex items-center mb-6">
                                {[...Array(trustedClient.rating)].map((_, i) => (
                                    <FiStar key={i} className="text-yellow-400 fill-current" size={20} />
                                ))}
                                <span className="ml-2 text-gray-600">Partnership: {trustedClient.partnership}</span>
                            </div>
                        </div>

                        {/* Projects */}
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Projects Delivered</h3>
                            <div className="space-y-4">
                                {trustedClient.projects.map((project, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.8, delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <h4 className="font-semibold text-gray-900">{project.name}</h4>
                                            <a
                                                href={project.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary-600 hover:text-primary-700 transition-colors"
                                            >
                                                <FiExternalLink size={16} />
                                            </a>
                                        </div>
                                        <p className="text-gray-600 mb-3">{project.description}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {project.tech.map((tech, techIndex) => (
                                                <span
                                                    key={techIndex}
                                                    className="bg-primary-100 text-primary-600 px-2 py-1 rounded text-xs font-medium"
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
                            className="bg-gray-50 rounded-xl p-6"
                        >
                            <div className="flex items-center mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <FiStar key={i} className="text-yellow-400 fill-current" size={16} />
                                ))}
                            </div>
                            <blockquote className="text-gray-700 mb-4 italic">
                                "{testimonial.content}"
                            </blockquote>
                            <div className="flex items-center">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    className="w-10 h-10 rounded-full mr-3 object-cover"
                                />
                                <div>
                                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                                    <div className="text-gray-600 text-sm">{testimonial.role}, {testimonial.company}</div>
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