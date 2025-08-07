import { motion } from 'framer-motion';
import { FiStar, FiExternalLink } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';

const TrustedClients = () => {
    const { isDark } = useTheme();

    const trustedClient = {
    };

    const additionalTestimonials = [
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
                        {/*Our Trusted Partners*/}
                    </h2>
                    <p className={`text-xl max-w-3xl mx-auto transition-colors duration-300 ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                        Building long-term partnerships with businesses who trust us with their digital success
                    </p>
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