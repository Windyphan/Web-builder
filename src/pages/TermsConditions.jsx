import React from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const TermsConditions = () => {
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
                                Terms &amp; Conditions
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
                                        1. Agreement to Terms
                                    </h2>
                                    <p className="font-body leading-relaxed">
                                        By accessing and using The Innovation Curve website ("Website"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                                    </p>
                                </div>

                                {/* Use License */}
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
                                        2. Use License
                                    </h2>
                                    <p className="font-body leading-relaxed mb-4">
                                        Permission is granted to temporarily download one copy of the materials (information or software) on The Innovation Curve's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 font-body ml-4">
                                        <li>Modify or copy the materials</li>
                                        <li>Use the materials for any commercial purpose, or for any public display (commercial or non-commercial)</li>
                                        <li>Attempt to decompile or reverse engineer any software contained on The Innovation Curve's website</li>
                                        <li>Remove any copyright or other proprietary notations from the materials</li>
                                        <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
                                    </ul>
                                    <p className="font-body leading-relaxed mt-4">
                                        This license shall automatically terminate if you violate any of these restrictions and may be terminated by The Innovation Curve at any time.
                                    </p>
                                </div>

                                {/* Services */}
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
                                        3. Services
                                    </h2>
                                    <p className="font-body leading-relaxed mb-4">
                                        The Innovation Curve provides web development, design, and digital solutions services. By engaging our services, you agree to:
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 font-body ml-4">
                                        <li>Provide accurate and complete information necessary for the completion of your project</li>
                                        <li>Respond to communication requests in a timely manner</li>
                                        <li>Make payment according to the agreed-upon terms</li>
                                        <li>Provide necessary credentials and access required for project completion</li>
                                        <li>Review and provide feedback on deliverables within the specified timeframe</li>
                                    </ul>
                                </div>

                                {/* Payment Terms */}
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
                                        4. Payment Terms
                                    </h2>
                                    <p className="font-body leading-relaxed mb-4">
                                        All services provided by The Innovation Curve are subject to the following payment terms:
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 font-body ml-4">
                                        <li>Payment terms will be specified in the project proposal or contract</li>
                                        <li>A deposit may be required before work commences</li>
                                        <li>Final payment is due upon project completion unless otherwise specified</li>
                                        <li>Late payments may incur additional fees</li>
                                        <li>All prices are subject to applicable taxes</li>
                                    </ul>
                                    <p className="font-body leading-relaxed mt-4">
                                        Failure to make payment may result in suspension of services and legal action to recover outstanding amounts.
                                    </p>
                                </div>

                                {/* Intellectual Property */}
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
                                        5. Intellectual Property
                                    </h2>
                                    <p className="font-body leading-relaxed mb-4">
                                        <strong>Client-Owned Content:</strong> All content, materials, and intellectual property provided by the client remain the property of the client.
                                    </p>
                                    <p className="font-body leading-relaxed mb-4">
                                        <strong>Developed Work:</strong> Upon full payment, ownership of the final deliverables is transferred to the client. However, The Innovation Curve retains the right to:
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 font-body ml-4">
                                        <li>Display the work in our portfolio</li>
                                        <li>Use the work as a case study</li>
                                        <li>Reference the work in marketing materials</li>
                                    </ul>
                                    <p className="font-body leading-relaxed mt-4">
                                        <strong>Third-Party Materials:</strong> Any third-party materials, including fonts, images, or plugins, remain the property of their respective owners and may be subject to separate licensing agreements.
                                    </p>
                                </div>

                                {/* Project Timeline */}
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
                                        6. Project Timeline and Revisions
                                    </h2>
                                    <p className="font-body leading-relaxed mb-4">
                                        Project timelines will be specified in the project proposal. Timelines may be affected by:
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 font-body ml-4">
                                        <li>Delays in receiving client feedback or required materials</li>
                                        <li>Changes to the project scope</li>
                                        <li>Technical issues beyond our control</li>
                                        <li>Third-party service delays</li>
                                    </ul>
                                    <p className="font-body leading-relaxed mt-4">
                                        Revision rounds will be specified in the project agreement. Additional revisions beyond the agreed-upon number may incur additional charges.
                                    </p>
                                </div>

                                {/* Warranty and Disclaimer */}
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
                                        7. Warranty and Disclaimer
                                    </h2>
                                    <p className="font-body leading-relaxed mb-4">
                                        The materials on The Innovation Curve's website are provided on an 'as is' basis. The Innovation Curve makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                                    </p>
                                    <p className="font-body leading-relaxed">
                                        We warrant that services will be performed in a professional and workmanlike manner. For a period of 30 days from project completion, we will fix any bugs or errors in the delivered work at no additional charge, provided they are not caused by modifications made by the client or third parties.
                                    </p>
                                </div>

                                {/* Limitations */}
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
                                        8. Limitations of Liability
                                    </h2>
                                    <p className="font-body leading-relaxed">
                                        In no event shall The Innovation Curve or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on The Innovation Curve's website, even if The Innovation Curve or an authorized representative has been notified orally or in writing of the possibility of such damage.
                                    </p>
                                </div>

                                {/* Confidentiality */}
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
                                        9. Confidentiality
                                    </h2>
                                    <p className="font-body leading-relaxed">
                                        The Innovation Curve agrees to keep confidential all information provided by the client that is marked as confidential or would reasonably be considered confidential. This obligation continues for a period of three years after the termination of the business relationship. Both parties agree not to disclose confidential information to third parties without prior written consent.
                                    </p>
                                </div>

                                {/* Termination */}
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
                                        10. Termination
                                    </h2>
                                    <p className="font-body leading-relaxed mb-4">
                                        Either party may terminate services with written notice. Upon termination:
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 font-body ml-4">
                                        <li>The client is responsible for payment for all work completed up to the termination date</li>
                                        <li>The Innovation Curve will provide all completed work upon receipt of payment</li>
                                        <li>Any outstanding invoices become immediately due and payable</li>
                                        <li>Deposits are non-refundable unless otherwise agreed in writing</li>
                                    </ul>
                                </div>

                                {/* Governing Law */}
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
                                        11. Governing Law
                                    </h2>
                                    <p className="font-body leading-relaxed">
                                        These terms and conditions are governed by and construed in accordance with the laws of the United Kingdom. You irrevocably submit to the exclusive jurisdiction of the courts in that location.
                                    </p>
                                </div>

                                {/* Changes to Terms */}
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
                                        12. Changes to Terms
                                    </h2>
                                    <p className="font-body leading-relaxed">
                                        The Innovation Curve reserves the right to revise these terms and conditions at any time without notice. By using this website and our services, you are agreeing to be bound by the then-current version of these terms and conditions.
                                    </p>
                                </div>

                                {/* Contact Information */}
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
                                        13. Contact Information
                                    </h2>
                                    <p className="font-body leading-relaxed mb-4">
                                        If you have any questions about these Terms and Conditions, please contact us:
                                    </p>
                                    <ul className="list-none space-y-2 font-body ml-4">
                                        <li><strong>Email:</strong> info@theinnovationcurve.com</li>
                                        <li><strong>Phone:</strong> 07340764930</li>
                                        <li><strong>Address:</strong> 1F23, Frenchay Campus, Coldharbour Ln, Bristol, United Kingdom BS16 1QY</li>
                                    </ul>
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

export default TermsConditions;

