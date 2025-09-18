import { motion } from 'framer-motion';
import { FiStar, FiExternalLink } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';

const TrustedClients = () => {
    const { isDark } = useTheme();

    const trustedClient = {
        name: "Local Business Solutions",
        logo: "/api/placeholder/120/60",
        testimonial: "The Innovation Curve transformed our online presence completely. Their attention to detail and technical expertise exceeded our expectations.",
        author: "Sarah Johnson",
        position: "Managing Director",
        rating: 5,
        projectUrl: "#"
    };

    const additionalTestimonials = [
        {
            author: "Mark Thompson",
            position: "E-commerce Manager",
            company: "TechStart Solutions",
            testimonial: "Outstanding work on our e-commerce platform. The team delivered exactly what we needed, on time and within budget.",
            rating: 5
        },
        {
            author: "Lisa Chen",
            position: "Marketing Director",
            company: "Digital Ventures",
            testimonial: "Professional, creative, and technically sound. They helped us achieve our digital goals with innovative solutions.",
            rating: 5
        }
    ];

    return (
        <section id="trusted-clients" className="section-padding bg-gradient-to-br from-navy-50 via-white to-primary-50 dark:from-navy-900 dark:via-navy-800 dark:to-navy-950">
            <div className="container-max">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="font-display text-display-lg md:text-6xl font-extrabold bg-gradient-to-r from-navy-900 via-primary-600 to-accent-600 dark:from-navy-100 dark:via-primary-400 dark:to-accent-400 bg-clip-text text-transparent mb-6 tracking-headline">
                        Client Success Stories
                    </h2>
                    <p className="font-body text-xl md:text-2xl text-navy-600 dark:text-navy-300 max-w-3xl mx-auto leading-relaxed font-medium">
                        Building long-term partnerships with businesses who trust us with their digital success
                    </p>
                </motion.div>

                {/* Featured Client */}
                {trustedClient.name && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="bg-gradient-card dark:bg-gradient-card-dark rounded-3xl shadow-premium dark:shadow-premium-dark p-8 lg:p-12 mb-16 border border-navy-200/20 dark:border-navy-700/20 text-center"
                    >
                        <div className="flex justify-center mb-6">
                            {[...Array(trustedClient.rating)].map((_, i) => (
                                <FiStar key={i} className="text-accent-500 fill-current" size={24} />
                            ))}
                        </div>

                        <blockquote className="font-body text-xl md:text-2xl text-navy-700 dark:text-navy-300 mb-8 leading-relaxed italic">
                            "{trustedClient.testimonial}"
                        </blockquote>

                        <div className="flex items-center justify-center gap-4 mb-6">
                            <div className="text-center">
                                <div className="font-display text-lg font-bold text-navy-900 dark:text-navy-100">
                                    {trustedClient.author}
                                </div>
                                <div className="font-body text-accent-600 dark:text-accent-400 font-medium">
                                    {trustedClient.position}
                                </div>
                                <div className="font-body text-navy-600 dark:text-navy-400">
                                    {trustedClient.name}
                                </div>
                            </div>
                        </div>

                        {trustedClient.projectUrl !== "#" && (
                            <a
                                href={trustedClient.projectUrl}
                                className="inline-flex items-center gap-2 text-accent-600 dark:text-accent-400 font-semibold hover:text-accent-500 transition-colors duration-300"
                            >
                                View Project <FiExternalLink size={18} />
                            </a>
                        )}
                    </motion.div>
                )}

                {/* Additional Testimonials */}
                <div className="grid md:grid-cols-2 gap-8">
                    {additionalTestimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-gradient-card dark:bg-gradient-card-dark rounded-3xl shadow-premium dark:shadow-premium-dark p-8 border border-navy-200/20 dark:border-navy-700/20 hover:shadow-glow-blue dark:hover:shadow-glow transition-all duration-300 hover:scale-105"
                        >
                            <div className="flex justify-center mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <FiStar key={i} className="text-accent-500 fill-current" size={20} />
                                ))}
                            </div>

                            <blockquote className="font-body text-navy-700 dark:text-navy-300 mb-6 leading-relaxed italic">
                                "{testimonial.testimonial}"
                            </blockquote>

                            <div className="text-center">
                                <div className="font-display text-lg font-bold text-navy-900 dark:text-navy-100 mb-1">
                                    {testimonial.author}
                                </div>
                                <div className="font-body text-accent-600 dark:text-accent-400 font-medium mb-1">
                                    {testimonial.position}
                                </div>
                                <div className="font-body text-navy-600 dark:text-navy-400 text-sm">
                                    {testimonial.company}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Call to Action */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="text-center mt-16"
                >
                    <div className="bg-gradient-navy dark:bg-gradient-card-dark rounded-3xl p-8 lg:p-12 shadow-premium dark:shadow-premium-dark">
                        <h3 className="font-display text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                            Ready to Join Our Success Stories?
                        </h3>
                        <p className="font-body text-navy-200 mb-8 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
                            Let's work together to create something amazing that your customers will love.
                        </p>
                        <motion.button
                            className="bg-gradient-accent hover:shadow-glow text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 shadow-premium"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => window.location.href = '/contact'}
                        >
                            Start Your Project
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default TrustedClients;