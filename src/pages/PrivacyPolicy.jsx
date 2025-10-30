import React from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
    return (
        <>
            <Header />
            <div className="min-h-screen bg-white dark:bg-gray-900">
                {/* Hero Section */}
                <section className="bg-gradient-navy dark:bg-gradient-to-br dark:from-navy-950 dark:via-navy-900 dark:to-navy-800 text-white py-20">
                    <div className="container-max">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-center"
                        >
                            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                                Privacy Policy
                            </h1>
                            <p className="font-body text-lg md:text-xl text-navy-200 max-w-3xl mx-auto">
                                Last Updated: October 30, 2025
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Content Section */}
                <section className="py-16 md:py-24">
                    <div className="container-max max-w-4xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="prose prose-lg dark:prose-invert max-w-none"
                        >
                            <div className="space-y-8 text-gray-700 dark:text-gray-300">
                                {/* Introduction */}
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
                                        1. Introduction
                                    </h2>
                                    <p className="font-body leading-relaxed">
                                        Welcome to The Innovation Curve. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
                                    </p>
                                </div>

                                {/* Information We Collect */}
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
                                        2. Information We Collect
                                    </h2>
                                    <p className="font-body leading-relaxed mb-4">
                                        We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 font-body ml-4">
                                        <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                                        <li><strong>Contact Data:</strong> includes email address, telephone numbers, and physical address.</li>
                                        <li><strong>Technical Data:</strong> includes internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform.</li>
                                        <li><strong>Usage Data:</strong> includes information about how you use our website, products and services.</li>
                                        <li><strong>Marketing and Communications Data:</strong> includes your preferences in receiving marketing from us and our third parties and your communication preferences.</li>
                                    </ul>
                                </div>

                                {/* How We Use Your Information */}
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
                                        3. How We Use Your Information
                                    </h2>
                                    <p className="font-body leading-relaxed mb-4">
                                        We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 font-body ml-4">
                                        <li>To provide and maintain our services</li>
                                        <li>To notify you about changes to our services</li>
                                        <li>To provide customer support</li>
                                        <li>To gather analysis or valuable information so that we can improve our services</li>
                                        <li>To monitor the usage of our services</li>
                                        <li>To detect, prevent and address technical issues</li>
                                        <li>To provide you with news, special offers and general information about other services which we offer</li>
                                    </ul>
                                </div>

                                {/* Data Security */}
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
                                        4. Data Security
                                    </h2>
                                    <p className="font-body leading-relaxed">
                                        We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
                                    </p>
                                </div>

                                {/* Cookies */}
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
                                        5. Cookies
                                    </h2>
                                    <p className="font-body leading-relaxed mb-4">
                                        Our website uses cookies to distinguish you from other users of our website. This helps us to provide you with a good experience when you browse our website and also allows us to improve our site. A cookie is a small file of letters and numbers that we store on your browser or the hard drive of your computer.
                                    </p>
                                    <p className="font-body leading-relaxed">
                                        You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies. If you disable or refuse cookies, please note that some parts of this website may become inaccessible or not function properly.
                                    </p>
                                </div>

                                {/* Third-Party Links */}
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
                                        6. Third-Party Links
                                    </h2>
                                    <p className="font-body leading-relaxed">
                                        Our website may include links to third-party websites, plug-ins and applications. Clicking on those links or enabling those connections may allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy statements. When you leave our website, we encourage you to read the privacy policy of every website you visit.
                                    </p>
                                </div>

                                {/* Your Legal Rights */}
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
                                        7. Your Legal Rights
                                    </h2>
                                    <p className="font-body leading-relaxed mb-4">
                                        Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 font-body ml-4">
                                        <li>Request access to your personal data</li>
                                        <li>Request correction of your personal data</li>
                                        <li>Request erasure of your personal data</li>
                                        <li>Object to processing of your personal data</li>
                                        <li>Request restriction of processing your personal data</li>
                                        <li>Request transfer of your personal data</li>
                                        <li>Right to withdraw consent</li>
                                    </ul>
                                </div>

                                {/* Data Retention */}
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
                                        8. Data Retention
                                    </h2>
                                    <p className="font-body leading-relaxed">
                                        We will only retain your personal data for as long as reasonably necessary to fulfil the purposes we collected it for, including for the purposes of satisfying any legal, regulatory, tax, accounting or reporting requirements. We may retain your personal data for a longer period in the event of a complaint or if we reasonably believe there is a prospect of litigation in respect to our relationship with you.
                                    </p>
                                </div>

                                {/* Contact Us */}
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
                                        9. Contact Us
                                    </h2>
                                    <p className="font-body leading-relaxed mb-4">
                                        If you have any questions about this Privacy Policy, please contact us:
                                    </p>
                                    <ul className="list-none space-y-2 font-body ml-4">
                                        <li><strong>Email:</strong> info@theinnovationcurve.com</li>
                                        <li><strong>Phone:</strong> 07340764930</li>
                                        <li><strong>Address:</strong> 1F23, Frenchay Campus, Coldharbour Ln, Bristol, United Kingdom BS16 1QY</li>
                                    </ul>
                                </div>

                                {/* Changes to Privacy Policy */}
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
                                        10. Changes to This Privacy Policy
                                    </h2>
                                    <p className="font-body leading-relaxed">
                                        We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this Privacy Policy. You are advised to review this Privacy Policy periodically for any changes.
                                    </p>
                                </div>

                                {/* Back to Home */}
                                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                                    <Link
                                        to="/"
                                        className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold transition-colors"
                                    >
                                        ← Back to Home
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
};

export default PrivacyPolicy;

