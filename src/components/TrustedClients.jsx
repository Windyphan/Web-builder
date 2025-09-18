import { motion } from 'framer-motion';
import { FiStar, FiExternalLink, FiUser } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';
import { useScrollAnimation, fadeInUp, staggerContainer, staggerItem } from '../hooks/useScrollAnimation';

const TrustedClients = () => {
    const { isDark } = useTheme();

    // Scroll animation hooks
    const [titleRef, titleControls] = useScrollAnimation(0.2);
    const [testimonialsRef, testimonialsControls] = useScrollAnimation(0.1);

    // Real customer reviews
    const customerReviews = [
        {
            id: 1,
            author: "Jamie Osborne",
            company: "ArtSync",
            testimonial: "Excellent website, professional and consistent communication. Would definitely recommend!",
            rating: 5,
            reviewCount: 3,
            timeAgo: "2 weeks ago",
            verified: true
        },
        {
            id: 2,
            author: "Lee Cooper",
            testimonial: "I was recommended this company from a previous business associate and I cant speak highly enough, honest, professional and most importantly extremely knowledgeable. Highly recommend 👌",
            rating: 5,
            reviewCount: 2,
            timeAgo: "5 weeks ago",
            verified: true
        },
        {
            id: 3,
            author: "AzulPlays",
            testimonial: "I recently met the founder, and he was extremely helpful and knowledeable on the industy. They gave us some exciting website solutions, and really helped us innovate our business",
            rating: 5,
            reviewCount: 9,
            timeAgo: "5 weeks ago",
            verified: true
        },
        {
            id: 4,
            author: "Sam Hodgson",
            company: "EnviroIT",
            position: "Founder",
            testimonial: "Excellent website designs and advice. Highly recommend!",
            rating: 5,
            reviewCount: 4,
            timeAgo: "6 weeks ago",
            verified: true
        }
    ];

    // Animation variants
    const cardVariants = {
        rest: {
            scale: 1,
            y: 0,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            transition: { duration: 0.3, ease: "easeInOut" }
        },
        hover: {
            scale: 1.02,
            y: -5,
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
            transition: { duration: 0.3, ease: "easeInOut" }
        }
    };

    return (
        <section id="trusted-clients" className="section-padding bg-gradient-to-br from-navy-50 via-white to-primary-50 dark:from-navy-900 dark:via-navy-800 dark:to-navy-950 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 opacity-30 dark:opacity-20">
                <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-accent-200 to-primary-200 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-br from-primary-200 to-accent-200 rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                {/* Header */}
                <motion.div
                    ref={titleRef}
                    initial="hidden"
                    animate={titleControls}
                    variants={fadeInUp}
                    className="text-center mb-16"
                >
                    <h2 className="font-display text-display-lg md:text-6xl font-extrabold bg-gradient-to-r from-navy-900 via-primary-600 to-accent-600 dark:from-navy-100 dark:via-primary-400 dark:to-accent-400 bg-clip-text text-transparent mb-6 tracking-headline">
                        Client Reviews
                    </h2>
                    <p className="font-body text-xl md:text-2xl text-navy-600 dark:text-navy-300 max-w-3xl mx-auto leading-relaxed font-medium">
                        Real feedback from satisfied clients who trust us with their digital success
                    </p>

                    {/* Overall Rating Summary */}
                    <motion.div
                        className="flex items-center justify-center gap-4 mt-8"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        viewport={{ once: true }}
                    >
                        <div className="flex items-center gap-2">
                            {[...Array(5)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: 0.4 + (i * 0.1) }}
                                    viewport={{ once: true }}
                                >
                                    <FiStar className="text-accent-500 fill-current" size={28} />
                                </motion.div>
                            ))}
                        </div>
                        <div className="text-center">
                            <div className="font-display text-2xl font-bold text-navy-900 dark:text-navy-100">5.0</div>
                            <div className="font-body text-sm text-navy-600 dark:text-navy-400">Perfect Rating</div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Customer Reviews Grid */}
                <motion.div
                    ref={testimonialsRef}
                    initial="hidden"
                    animate={testimonialsControls}
                    variants={staggerContainer}
                    className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto"
                >
                    {customerReviews.map((review, index) => (
                        <motion.div
                            key={review.id}
                            variants={staggerItem}
                            className="relative group"
                        >
                            <motion.div
                                variants={cardVariants}
                                initial="rest"
                                whileHover="hover"
                                className="bg-white/90 dark:bg-navy-800/90 backdrop-blur-sm rounded-2xl p-8 h-full border border-navy-200/30 dark:border-navy-700/30 relative overflow-hidden"
                            >
                                {/* Verified Badge */}
                                {review.verified && (
                                    <div className="absolute top-4 right-4">
                                        <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full text-xs font-semibold">
                                            ✓ Verified
                                        </div>
                                    </div>
                                )}

                                {/* Rating Stars */}
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(review.rating)].map((_, i) => (
                                        <FiStar key={i} className="text-accent-500 fill-current" size={18} />
                                    ))}
                                    <span className="ml-2 font-body text-sm text-navy-500 dark:text-navy-400">
                                        {review.timeAgo}
                                    </span>
                                </div>

                                {/* Review Text */}
                                <blockquote className="font-body text-navy-700 dark:text-navy-300 mb-6 leading-relaxed italic">
                                    "{review.testimonial}"
                                </blockquote>

                                {/* Author Info */}
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full text-white font-bold">
                                        {review.author.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="font-display text-lg font-bold text-navy-900 dark:text-navy-100 mb-1">
                                            {review.author}
                                        </div>
                                        {review.company && (
                                            <div className="font-body text-accent-600 dark:text-accent-400 font-medium mb-1">
                                                {review.position && `${review.position}, `}{review.company}
                                            </div>
                                        )}
                                        <div className="font-body text-navy-600 dark:text-navy-400 text-sm">
                                            {review.reviewCount} review{review.reviewCount !== 1 ? 's' : ''}
                                        </div>
                                    </div>
                                </div>

                                {/* Hover Glow Effect */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                                />
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Call to Action */}
                <motion.div
                    className="text-center mt-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    viewport={{ once: true }}
                >
                    <div className="bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-500 dark:to-accent-500 rounded-3xl p-8 text-white shadow-2xl">
                        <h3 className="font-display text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                            Join Our Satisfied Clients
                        </h3>
                        <p className="font-body text-navy-200 mb-8 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
                            Experience the same level of excellence and professionalism that earned us these 5-star reviews
                        </p>
                        <motion.a
                            href="/contact"
                            className="bg-gradient-accent hover:shadow-glow text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 shadow-premium"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Start Your Project
                        </motion.a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default TrustedClients;