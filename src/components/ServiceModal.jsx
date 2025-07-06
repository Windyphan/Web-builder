import Modal from './Modal';
import { FiCheck, FiArrowRight } from 'react-icons/fi';

const ServiceModal = ({ isOpen, onClose, service }) => {
    if (!service) return null;

    const serviceDetails = {
        'Custom Web Development': {
            description: 'We create custom websites and web applications tailored to your specific business needs. Our development process focuses on performance, scalability, and user experience.',
            benefits: [
                'Custom design and functionality',
                'Responsive and mobile-friendly',
                'SEO optimized structure',
                'Fast loading and performance',
                'Scalable architecture',
                'Modern tech stack'
            ],
            technologies: ['React', 'Vue.js', 'Angular', 'Node.js', 'Next.js', 'TypeScript'],
            timeline: '4-8 weeks',
            price: 'Starting from £2,500'
        },
        'E-commerce Solutions': {
            description: 'Complete e-commerce platforms with secure payment processing, inventory management, and user-friendly shopping experiences.',
            benefits: [
                'Secure payment processing',
                'Inventory management system',
                'User account management',
                'Order tracking and notifications',
                'Analytics and reporting',
                'Mobile-optimized checkout'
            ],
            technologies: ['Shopify', 'WooCommerce', 'Stripe', 'PayPal', 'Custom Solutions'],
            timeline: '6-12 weeks',
            price: 'Starting from £3,500'
        },
        'UI/UX Design': {
            description: 'User-centered design that converts visitors into customers. We create intuitive interfaces that users love and that drive business results.',
            benefits: [
                'User research and analysis',
                'Wireframing and prototyping',
                'Visual design and branding',
                'Usability testing',
                'Responsive design',
                'Accessibility compliance'
            ],
            technologies: ['Figma', 'Adobe XD', 'Sketch', 'InVision', 'Principle'],
            timeline: '3-6 weeks',
            price: 'Starting from £1,800'
        },
        'Website Maintenance': {
            description: 'Keep your website secure, updated, and performing at its best with our comprehensive maintenance services.',
            benefits: [
                'Security updates and monitoring',
                'Performance optimization',
                'Content updates and backups',
                'Bug fixes and improvements',
                'Analytics and reporting',
                '24/7 support available'
            ],
            technologies: ['WordPress', 'React', 'Vue.js', 'Various CMSs'],
            timeline: 'Ongoing',
            price: 'Starting from £150/month'
        },
        'Consultation Services': {
            description: 'Strategic guidance on technology choices, architecture decisions, and digital transformation initiatives.',
            benefits: [
                'Technical strategy planning',
                'Architecture recommendations',
                'Code review and audit',
                'Performance optimization',
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
                    <div className="bg-primary-100 rounded-full p-3 mr-4">
                        <service.icon className="text-primary-600" size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900">{service.title}</h3>
                        <p className="text-gray-600">{details.timeline} • {details.price}</p>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Overview</h4>
                    <p className="text-gray-600">{details.description}</p>
                </div>

                {/* Benefits */}
                <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Key Benefits</h4>
                    <div className="grid md:grid-cols-2 gap-3">
                        {details.benefits?.map((benefit, index) => (
                            <div key={index} className="flex items-start">
                                <FiCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" size={16} />
                                <span className="text-gray-600">{benefit}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Technologies */}
                <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Technologies Used</h4>
                    <div className="flex flex-wrap gap-2">
                        {details.technologies?.map((tech, index) => (
                            <span
                                key={index}
                                className="bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-sm"
                            >
                {tech}
              </span>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Ready to Get Started?</h4>
                    <p className="text-gray-600 mb-4">
                        Let's discuss your project requirements and create a custom solution for your business.
                    </p>
                    <button
                        onClick={() => {
                            onClose();
                            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="btn-primary inline-flex items-center"
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