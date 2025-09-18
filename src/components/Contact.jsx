import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiClock } from 'react-icons/fi';
import emailjs from '@emailjs/browser';
import {useState} from "react";

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

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        projectType: '',
        budget: '',
        message: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            await emailjs.send(
                'service_4lbrwu9',
                'template_sotia64',
                {
                    from_name: formData.name,
                    reply_to: formData.email,
                    phone: formData.phone,
                    project_type: formData.projectType,
                    budget: formData.budget,
                    message: formData.message,
                },
                '_KGvnP1t8dVz7HVoB'
            );
            setSubmitStatus('success');
            setFormData({
                name: '',
                email: '',
                phone: '',
                projectType: '',
                budget: '',
                message: '',
            });
        } catch (error) {
            console.error('Error sending email:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="contact" className="section-padding bg-gradient-to-br from-white via-navy-50 to-primary-50 dark:from-navy-950 dark:via-navy-900 dark:to-navy-800">
            <div className="container-max">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="font-display text-display-lg md:text-6xl font-extrabold bg-gradient-to-r from-navy-900 via-primary-600 to-accent-600 dark:from-navy-100 dark:via-primary-400 dark:to-accent-400 bg-clip-text text-transparent mb-6 tracking-headline">
                        Get In Touch
                    </h2>
                    <p className="font-body text-xl md:text-2xl text-navy-600 dark:text-navy-300 max-w-3xl mx-auto leading-relaxed font-medium">
                        Ready to start your project? Let's discuss how we can help bring your vision to life.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Information */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <div>
                            <h3 className="font-display text-3xl font-bold text-navy-900 dark:text-navy-100 mb-6">
                                Contact Information
                            </h3>
                            <p className="font-body text-navy-600 dark:text-navy-300 leading-relaxed mb-8">
                                We're here to help you succeed. Reach out to us through any of the following channels.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6">
                            {contactInfo.map((info, index) => (
                                <motion.a
                                    key={index}
                                    href={info.link}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="bg-gradient-card dark:bg-gradient-card-dark rounded-2xl p-6 shadow-premium dark:shadow-premium-dark hover:shadow-glow-blue dark:hover:shadow-glow transition-all duration-300 hover:scale-105 border border-navy-200/20 dark:border-navy-700/20 group"
                                >
                                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-accent rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <info.icon className="text-white" size={24} />
                                    </div>
                                    <h4 className="font-display text-lg font-semibold text-navy-900 dark:text-navy-100 mb-2 group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors duration-300">
                                        {info.title}
                                    </h4>
                                    <p className="font-body text-navy-600 dark:text-navy-300 text-sm">
                                        {info.content}
                                    </p>
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="bg-gradient-card dark:bg-gradient-card-dark rounded-3xl p-8 shadow-premium dark:shadow-premium-dark border border-navy-200/20 dark:border-navy-700/20"
                    >
                        <h3 className="font-display text-3xl font-bold text-navy-900 dark:text-navy-100 mb-6">
                            Send Us a Message
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="font-body block text-navy-700 dark:text-navy-300 font-medium mb-2">
                                        Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-white dark:bg-navy-800 border border-navy-300 dark:border-navy-600 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-300 font-body"
                                        placeholder="Your name"
                                    />
                                </div>
                                <div>
                                    <label className="font-body block text-navy-700 dark:text-navy-300 font-medium mb-2">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-white dark:bg-navy-800 border border-navy-300 dark:border-navy-600 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-300 font-body"
                                        placeholder="your.email@example.com"
                                    />
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="font-body block text-navy-700 dark:text-navy-300 font-medium mb-2">
                                        Phone
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white dark:bg-navy-800 border border-navy-300 dark:border-navy-600 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-300 font-body"
                                        placeholder="Your phone number"
                                    />
                                </div>
                                <div>
                                    <label className="font-body block text-navy-700 dark:text-navy-300 font-medium mb-2">
                                        Project Type
                                    </label>
                                    <select
                                        name="projectType"
                                        value={formData.projectType}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white dark:bg-navy-800 border border-navy-300 dark:border-navy-600 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-300 font-body"
                                    >
                                        <option value="">Select a project type</option>
                                        <option value="website">Website Development</option>
                                        <option value="ecommerce">E-commerce Store</option>
                                        <option value="mobile">Mobile App</option>
                                        <option value="consultation">Consultation</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="font-body block text-navy-700 dark:text-navy-300 font-medium mb-2">
                                    Budget Range
                                </label>
                                <select
                                    name="budget"
                                    value={formData.budget}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white dark:bg-navy-800 border border-navy-300 dark:border-navy-600 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-300 font-body"
                                >
                                    <option value="">Select your budget range</option>
                                    <option value="under-1k">Under £1,000</option>
                                    <option value="1k-5k">£1,000 - £5,000</option>
                                    <option value="5k-10k">£5,000 - £10,000</option>
                                    <option value="10k-plus">£10,000+</option>
                                </select>
                            </div>

                            <div>
                                <label className="font-body block text-navy-700 dark:text-navy-300 font-medium mb-2">
                                    Message *
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={6}
                                    className="w-full px-4 py-3 bg-white dark:bg-navy-800 border border-navy-300 dark:border-navy-600 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-300 font-body resize-none"
                                    placeholder="Tell us about your project..."
                                />
                            </div>

                            <motion.button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-gradient-accent hover:shadow-glow text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-premium disabled:opacity-50 disabled:cursor-not-allowed"
                                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                            >
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                            </motion.button>

                            {submitStatus === 'success' && (
                                <div className="text-green-600 dark:text-green-400 font-body text-center">
                                    Message sent successfully! We'll get back to you soon.
                                </div>
                            )}

                            {submitStatus === 'error' && (
                                <div className="text-red-600 dark:text-red-400 font-body text-center">
                                    Failed to send message. Please try again or contact us directly.
                                </div>
                            )}
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Contact;