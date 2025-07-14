import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FiMail, FiPhone, FiMapPin, FiClock, FiLoader } from 'react-icons/fi';

const Contact = ({ onNotification }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const onSubmit = async (data) => {
        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Here would normally send the data to backend
            console.log('Form submitted:', data);

            // Show success notification
            if (onNotification) {
                onNotification('success', 'Thank you for your message! We\'ll get back to you within 24 hours.');
            }

            // Reset form
            reset();

        } catch (error) {
            console.error('Error submitting form:', error);

            // Show error notification
            if (onNotification) {
                onNotification('error', 'Sorry, there was an error sending your message. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const contactInfo = [
        {
            icon: FiMail,
            title: 'Email',
            content: 'pmphong1999@gmail.com',
            link: 'mailto:pmphong1999@gmail.com'
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

    return (
        <section id="contact" className="section-padding bg-gray-50">
            <div className="container-max">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Get In Touch
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
                        <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                            Let's Start a Conversation
                        </h3>
                        <p className="text-gray-600 mb-8">
                            We'd love to hear about your project and discuss how we can help you achieve your digital goals. Get in touch with us for a free consultation.
                        </p>

                        <div className="space-y-6">
                            {contactInfo.map((info, index) => (
                                <div key={index} className="flex items-start">
                                    <div className="bg-primary-100 rounded-full p-3 mr-4">
                                        <info.icon className="text-primary-600" size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-1">
                                            {info.title}
                                        </h4>
                                        {info.link !== '#' ? (
                                            <a
                                                href={info.link}
                                                className="text-gray-600 hover:text-primary-600 transition-colors duration-200"
                                            >
                                                {info.content}
                                            </a>
                                        ) : (
                                            <span className="text-gray-600">{info.content}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Quick Contact Buttons */}
                        <div className="mt-8 space-y-4">
                            <a
                                href="mailto:pmphong1999@gmail.com"
                                className="btn-primary w-full inline-flex items-center justify-center"
                            >
                                <FiMail className="mr-2" />
                                Send Email
                            </a>
                            <a
                                href="tel:07340764930"
                                className="btn-secondary w-full inline-flex items-center justify-center"
                            >
                                <FiPhone className="mr-2" />
                                Call Now
                            </a>
                        </div>
                    </motion.div>

                    {/*/!* Contact Form *!/*/}
                    {/*<motion.div*/}
                    {/*    initial={{ opacity: 0, x: 20 }}*/}
                    {/*    whileInView={{ opacity: 1, x: 0 }}*/}
                    {/*    transition={{ duration: 0.8 }}*/}
                    {/*    viewport={{ once: true }}*/}
                    {/*    className="bg-white p-8 rounded-xl shadow-lg"*/}
                    {/*>*/}
                    {/*    <h3 className="text-2xl font-semibold text-gray-900 mb-6">*/}
                    {/*        Send Us a Message*/}
                    {/*    </h3>*/}

                    {/*    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">*/}
                    {/*        <div className="grid md:grid-cols-2 gap-6">*/}
                    {/*            <div>*/}
                    {/*                <label className="block text-sm font-medium text-gray-700 mb-2">*/}
                    {/*                    First Name **/}
                    {/*                </label>*/}
                    {/*                <input*/}
                    {/*                    type="text"*/}
                    {/*                    {...register('firstName', { required: 'First name is required' })}*/}
                    {/*                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${*/}
                    {/*                        errors.firstName ? 'border-red-300' : 'border-gray-300'*/}
                    {/*                    }`}*/}
                    {/*                    placeholder="John"*/}
                    {/*                    disabled={isSubmitting}*/}
                    {/*                />*/}
                    {/*                {errors.firstName && (*/}
                    {/*                    <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>*/}
                    {/*                )}*/}
                    {/*            </div>*/}
                    {/*            <div>*/}
                    {/*                <label className="block text-sm font-medium text-gray-700 mb-2">*/}
                    {/*                    Last Name **/}
                    {/*                </label>*/}
                    {/*                <input*/}
                    {/*                    type="text"*/}
                    {/*                    {...register('lastName', { required: 'Last name is required' })}*/}
                    {/*                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${*/}
                    {/*                        errors.lastName ? 'border-red-300' : 'border-gray-300'*/}
                    {/*                    }`}*/}
                    {/*                    placeholder="Doe"*/}
                    {/*                    disabled={isSubmitting}*/}
                    {/*                />*/}
                    {/*                {errors.lastName && (*/}
                    {/*                    <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>*/}
                    {/*                )}*/}
                    {/*            </div>*/}
                    {/*        </div>*/}

                    {/*        <div>*/}
                    {/*            <label className="block text-sm font-medium text-gray-700 mb-2">*/}
                    {/*                Email **/}
                    {/*            </label>*/}
                    {/*            <input*/}
                    {/*                type="email"*/}
                    {/*                {...register('email', {*/}
                    {/*                    required: 'Email is required',*/}
                    {/*                    pattern: {*/}
                    {/*                        value: /^\S+@\S+$/i,*/}
                    {/*                        message: 'Invalid email address'*/}
                    {/*                    }*/}
                    {/*                })}*/}
                    {/*                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${*/}
                    {/*                    errors.email ? 'border-red-300' : 'border-gray-300'*/}
                    {/*                }`}*/}
                    {/*                placeholder="john@example.com"*/}
                    {/*                disabled={isSubmitting}*/}
                    {/*            />*/}
                    {/*            {errors.email && (*/}
                    {/*                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>*/}
                    {/*            )}*/}
                    {/*        </div>*/}

                    {/*        <div>*/}
                    {/*            <label className="block text-sm font-medium text-gray-700 mb-2">*/}
                    {/*                Project Type **/}
                    {/*            </label>*/}
                    {/*            <select*/}
                    {/*                {...register('projectType', { required: 'Please select a project type' })}*/}
                    {/*                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${*/}
                    {/*                    errors.projectType ? 'border-red-300' : 'border-gray-300'*/}
                    {/*                }`}*/}
                    {/*                disabled={isSubmitting}*/}
                    {/*            >*/}
                    {/*                <option value="">Select a service</option>*/}
                    {/*                <option value="web-development">Web Development</option>*/}
                    {/*                <option value="ecommerce">E-commerce</option>*/}
                    {/*                <option value="mobile-app">Mobile App</option>*/}
                    {/*                <option value="ui-ux">UI/UX Design</option>*/}
                    {/*                <option value="maintenance">Website Maintenance</option>*/}
                    {/*                <option value="consultation">Consultation</option>*/}
                    {/*            </select>*/}
                    {/*            {errors.projectType && (*/}
                    {/*                <p className="mt-1 text-sm text-red-600">{errors.projectType.message}</p>*/}
                    {/*            )}*/}
                    {/*        </div>*/}

                    {/*        <div>*/}
                    {/*            <label className="block text-sm font-medium text-gray-700 mb-2">*/}
                    {/*                Budget Range*/}
                    {/*            </label>*/}
                    {/*            <select*/}
                    {/*                {...register('budget')}*/}
                    {/*                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"*/}
                    {/*                disabled={isSubmitting}*/}
                    {/*            >*/}
                    {/*                <option value="">Select budget range</option>*/}
                    {/*                <option value="under-2k">Under £2,000</option>*/}
                    {/*                <option value="2k-5k">£2,000 - £5,000</option>*/}
                    {/*                <option value="5k-10k">£5,000 - £10,000</option>*/}
                    {/*                <option value="10k-20k">£10,000 - £20,000</option>*/}
                    {/*                <option value="over-20k">Over £20,000</option>*/}
                    {/*            </select>*/}
                    {/*        </div>*/}

                    {/*        <div>*/}
                    {/*            <label className="block text-sm font-medium text-gray-700 mb-2">*/}
                    {/*                Message **/}
                    {/*            </label>*/}
                    {/*            <textarea*/}
                    {/*                {...register('message', { required: 'Message is required' })}*/}
                    {/*                rows="4"*/}
                    {/*                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${*/}
                    {/*                    errors.message ? 'border-red-300' : 'border-gray-300'*/}
                    {/*                }`}*/}
                    {/*                placeholder="Tell us about your project..."*/}
                    {/*                disabled={isSubmitting}*/}
                    {/*            ></textarea>*/}
                    {/*            {errors.message && (*/}
                    {/*                <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>*/}
                    {/*            )}*/}
                    {/*        </div>*/}

                    {/*        <button*/}
                    {/*            type="submit"*/}
                    {/*            disabled={isSubmitting}*/}
                    {/*            className={`w-full btn-primary inline-flex items-center justify-center ${*/}
                    {/*                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''*/}
                    {/*            }`}*/}
                    {/*        >*/}
                    {/*            {isSubmitting ? (*/}
                    {/*                <>*/}
                    {/*                    <FiLoader className="mr-2 animate-spin" />*/}
                    {/*                    Sending Message...*/}
                    {/*                </>*/}
                    {/*            ) : (*/}
                    {/*                'Send Message'*/}
                    {/*            )}*/}
                    {/*        </button>*/}
                    {/*    </form>*/}
                    {/*</motion.div>*/}
                </div>
            </div>
        </section>
    );
};

export default Contact;