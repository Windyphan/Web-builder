import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';

const Testimonials = () => {
    const testimonials = [
        {
            name: 'Sarah Johnson',
            role: 'CEO, TechStart Solutions',
            content: 'WebCraft Pro delivered an exceptional website that exceeded our expectations. Their attention to detail and technical expertise is outstanding.',
            rating: 5,
            image: 'https://images.unsplash.com/photo-1494790108755-2616b612b06c?auto=format&fit=crop&w=400&q=80'
        },
        {
            name: 'Michael Chen',
            role: 'Marketing Director, GrowthCorp',
            content: 'The team created a beautiful, fast-loading website that has significantly improved our conversion rates. Highly recommended!',
            rating: 5,
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
        },
        {
            name: 'Emma Williams',
            role: 'Founder, Creative Studio',
            content: 'Professional, reliable, and incredibly skilled. They transformed our vision into a stunning digital reality.',
            rating: 5,
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80'
        },
        {
            name: 'David Brown',
            role: 'CTO, InnovateTech',
            content: 'Excellent technical skills and communication. The project was delivered on time and within budget.',
            rating: 5,
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80'
        },
        {
            name: 'Lisa Garcia',
            role: 'Operations Manager, RetailPlus',
            content: 'Our e-commerce platform has been a game-changer for our business. The user experience is fantastic.',
            rating: 5,
            image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'
        },
        {
            name: 'James Wilson',
            role: 'Director, ConsultPro',
            content: 'WebCraft Pro understood our needs perfectly and delivered a solution that drives real business results.',
            rating: 5,
            image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80'
        }
    ];

    return (
        <section id="testimonials" className="section-padding bg-white">
            <div className="container-max">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        What Our Clients Say
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Don't just take our word for it - hear from our satisfied clients
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-shadow duration-300"
                        >
                            {/* Rating */}
                            <div className="flex items-center mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <FiStar key={i} className="text-yellow-400 fill-current" size={20} />
                                ))}
                            </div>

                            {/* Content */}
                            <p className="text-gray-600 mb-6 italic">
                                "{testimonial.content}"
                            </p>

                            {/* Author */}
                            <div className="flex items-center">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    className="w-12 h-12 rounded-full mr-4 object-cover"
                                />
                                <div>
                                    <h4 className="font-semibold text-gray-900">
                                        {testimonial.name}
                                    </h4>
                                    <p className="text-sm text-gray-500">
                                        {testimonial.role}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;