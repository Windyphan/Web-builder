import { FiCheck, FiArrowRight } from 'react-icons/fi';
import Modal from './Modal';

const ServiceModal = ({ isOpen, onClose, service }) => {
    if (!service) return null;

    const serviceDetails = {
        'Web Development': {
            description: 'Custom websites and web applications built with modern technologies like React, Vue.js, and Node.js for optimal performance and user experience.',
            benefits: [
                'Responsive mobile-first design',
                'Fast loading speeds',
                'SEO optimization',
                'Cross-browser compatibility',
                'Modern JavaScript frameworks',
                'Secure coding practices'
            ],
            technologies: ['React', 'Vue.js', 'Node.js', 'TypeScript', 'Tailwind CSS'],
            timeline: '2-6 weeks',
            price: 'Starting from £899'
        },
        'E-commerce Solutions': {
            description: 'Complete online stores with payment integration, inventory management, and admin dashboards tailored to your business needs.',
            benefits: [
                'Secure payment processing',
                'Inventory management',
                'Order tracking system',
                'Admin dashboard',
                'Customer accounts',
                'Mobile commerce ready'
            ],
            technologies: ['Shopify', 'WooCommerce', 'Stripe', 'PayPal', 'React'],
            timeline: '4-8 weeks',
            price: 'Starting from £1,599'
        },
        'Website Maintenance': {
            description: 'Ongoing support, security updates, performance optimization, and content management services to keep your website running smoothly.',
            benefits: [
                'Regular security updates',
                'Performance monitoring',
                'Content updates',
                'Backup management',
                'Bug fixes and improvements',
                '24/7 monitoring'
            ],
            technologies: ['WordPress', 'React', 'Node.js', 'Monitoring Tools'],
            timeline: 'Ongoing',
            price: 'Starting from £99/month'
        },
        'Consultation Services': {
            description: 'Strategic guidance on technology choices, architecture decisions, and digital transformation initiatives for your business.',
            benefits: [
                'Technical strategy planning',
                'Architecture recommendations',
                'Code review and optimization',
                'Performance audits',
                'Technology stack selection',
                'Project planning and roadmap'
            ],
            technologies: ['Various technologies based on needs'],
            timeline: '1-4 weeks',
            price: 'Starting from £100/hour'
        },
        'Mobile App Development': {
            description: 'Native and cross-platform mobile applications built with React Native and Flutter for iOS and Android.',
            benefits: [
                'Cross-platform compatibility',
                'Native performance',
                'Push notifications',
                'Offline functionality',
                'App store optimization',
                'Analytics integration'
            ],
            technologies: ['React Native', 'Flutter', 'iOS', 'Android'],
            timeline: '8-16 weeks',
            price: 'Starting from £4,500'
        }
    };

    const details = serviceDetails[service.title] || {};

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={service.title} size="lg">
            <div className="space-y-6">
                {/* Service Icon */}
                <div className="flex items-center">
                    <div className="bg-primary-100 dark:bg-primary-900/30 rounded-full p-3 mr-4">
                        <service.icon className="text-primary-600 dark:text-primary-400" size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{service.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400">{details.timeline} • {details.price}</p>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Overview</h4>
                    <p className="text-gray-600 dark:text-gray-300">{details.description}</p>
                </div>

                {/* Benefits */}
                <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Key Benefits</h4>
                    <div className="grid md:grid-cols-2 gap-3">
                        {details.benefits?.map((benefit, index) => (
                            <div key={index} className="flex items-start">
                                <FiCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" size={16} />
                                <span className="text-gray-600 dark:text-gray-300">{benefit}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Technologies */}
                <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Technologies Used</h4>
                    <div className="flex flex-wrap gap-2">
                        {details.technologies?.map((tech, index) => (
                            <span
                                key={index}
                                className="bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-3 py-1 rounded-full text-sm"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Ready to Get Started?</h4>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Let's discuss your project requirements and create a custom solution for your business.
                    </p>
                    <button
                        onClick={() => {
                            onClose();
                            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 inline-flex items-center"
                    >
                        Get Free Consultation
                        <FiArrowRight className="ml-2" />
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ServiceModal;