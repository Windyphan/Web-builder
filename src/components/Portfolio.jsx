import { motion, AnimatePresence } from 'framer-motion';
import { FiExternalLink, FiX } from 'react-icons/fi';
import { useState } from 'react';

const Portfolio = () => {
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    const projects = [
        {
            id: 1,
            title: 'Travel & Tourism Website',
            shortDescription: 'Comprehensive travel booking platform with tour packages and seamless booking experience.',
            description: 'A comprehensive travel booking platform featuring tour packages, news updates, and seamless booking experience. Built with modern design principles and user-centric functionality.',
            category: 'Web Application',
            client: 'Travel Agency',
            year: '2024',
            thumbnail: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
            technologies: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS', 'Express'],
            features: [
                'Interactive tour filtering system',
                'Real-time booking management',
                'Travel news and blog section',
                'Responsive design across all devices',
                'Advanced search and filter options'
            ],
            images: [
                {
                    title: 'Hero Section',
                    description: 'Stunning homepage with immersive hero section',
                    embedUrl: 'https://drive.google.com/file/d/1UQKTeJXueKudxXzUgLLpSas_32LAyJq8/preview'
                },
                {
                    title: 'Tours Page',
                    description: 'Advanced filtering and comprehensive tour listings',
                    embedUrl: 'https://drive.google.com/file/d/1bJnYyTkA0jstY4mP7UjmQwKTu2AUcF2f/preview'
                },
                {
                    title: 'News Section',
                    description: 'Travel news and destination highlights',
                    embedUrl: 'https://drive.google.com/file/d/1ZAmKsE2muC74tI4LWrSOPSgUYDVoDt9L/preview'
                },
                {
                    title: 'Featured Tours',
                    description: 'Curated tour packages on homepage',
                    embedUrl: 'https://drive.google.com/file/d/1dNp8r2Q2pCHGmxus6PkP4JpLc8p0zSm2/preview'
                },
                {
                    title: 'Booking Form',
                    description: 'Streamlined booking process',
                    embedUrl: 'https://drive.google.com/file/d/11QHSOhnImkfOoKwETlQKcqip6l4UOwba/preview'
                }
            ]
        }
    ];

    return (
        <section id="portfolio" className="section-padding bg-gradient-to-br from-white via-navy-50 to-primary-50 dark:from-navy-950 dark:via-navy-900 dark:to-navy-800">
            <div className="container-max">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="font-display text-display-lg md:text-6xl font-black bg-gradient-to-r from-navy-900 via-primary-600 to-accent-600 dark:from-navy-100 dark:via-primary-400 dark:to-accent-400 bg-clip-text text-transparent mb-6 tracking-headline">
                        Our Works
                    </h2>
                    <p className="font-body text-xl md:text-2xl text-navy-600 dark:text-navy-300 max-w-3xl mx-auto leading-relaxed font-bold">
                        Explore our latest projects and the innovative solutions we've crafted for our clients.
                    </p>
                </motion.div>

                {/* Project Cards Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            onClick={() => setSelectedProject(project)}
                            className="group cursor-pointer bg-gradient-card dark:bg-gradient-card-dark rounded-3xl shadow-premium dark:shadow-premium-dark overflow-hidden hover:shadow-glow-blue dark:hover:shadow-glow transition-all duration-300 hover:scale-105 border border-navy-200/20 dark:border-navy-700/20"
                        >
                            {/* Project Thumbnail */}
                            <div className="relative overflow-hidden h-64">
                                <img
                                    src={project.thumbnail}
                                    alt={project.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-navy-900/40 to-transparent"></div>

                                {/* Category Badge */}
                                <div className="absolute top-4 left-4">
                                    <span className="bg-accent-500 text-white px-4 py-2 rounded-full text-xs font-black shadow-lg">
                                        {project.category}
                                    </span>
                                </div>

                                {/* View Details Button */}
                                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="flex items-center gap-2 bg-white dark:bg-navy-800 text-navy-900 dark:text-navy-100 px-4 py-2 rounded-full font-black text-sm shadow-lg">
                                        <span>View Details</span>
                                        <FiExternalLink size={16} />
                                    </div>
                                </div>
                            </div>

                            {/* Project Info */}
                            <div className="p-6">
                                <h3 className="font-display text-2xl font-black text-navy-900 dark:text-navy-100 mb-3 group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors duration-300">
                                    {project.title}
                                </h3>
                                <p className="font-body text-navy-600 dark:text-navy-300 mb-4 leading-relaxed font-medium line-clamp-2">
                                    {project.shortDescription}
                                </p>

                                {/* Meta Info */}
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-navy-500 dark:text-navy-400 font-bold">
                                        {project.client}
                                    </span>
                                    <span className="text-navy-500 dark:text-navy-400 font-bold">
                                        {project.year}
                                    </span>
                                </div>

                                {/* Technologies Preview */}
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {project.technologies.slice(0, 3).map((tech, techIndex) => (
                                        <span
                                            key={techIndex}
                                            className="bg-navy-100 dark:bg-navy-800 text-navy-600 dark:text-navy-300 px-3 py-1 rounded-full text-xs font-bold"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                    {project.technologies.length > 3 && (
                                        <span className="bg-navy-100 dark:bg-navy-800 text-navy-600 dark:text-navy-300 px-3 py-1 rounded-full text-xs font-bold">
                                            +{project.technologies.length - 3}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Call to Action */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center mt-16"
                >
                    <div className="bg-gradient-navy dark:bg-gradient-card-dark rounded-3xl p-8 lg:p-12 shadow-premium dark:shadow-premium-dark">
                        <h3 className="font-display text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
                            Ready to Start Your Project?
                        </h3>
                        <p className="font-body text-navy-200 mb-8 text-lg md:text-xl max-w-2xl mx-auto font-bold leading-relaxed">
                            Let's discuss how we can bring your vision to life with a custom solution tailored to your needs.
                        </p>
                        <motion.button
                            className="bg-gradient-accent hover:shadow-glow text-white px-8 py-4 rounded-full font-black text-lg transition-all duration-300 hover:scale-105 shadow-premium"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => window.location.href = '/contact'}
                        >
                            Get Started Today
                        </motion.button>
                    </div>
                </motion.div>
            </div>

            {/* Project Detail Modal */}
            <AnimatePresence>
                {selectedProject && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 overflow-y-auto"
                        onClick={() => setSelectedProject(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-navy-900 rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl my-8"
                        >
                            {/* Modal Header */}
                            <div className="sticky top-0 z-10 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-navy-800 dark:to-navy-700 p-6 lg:p-8 border-b border-navy-200 dark:border-navy-600">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="bg-accent-500 text-white px-4 py-1.5 rounded-full text-xs font-black shadow-lg">
                                                {selectedProject.category}
                                            </span>
                                            <span className="text-navy-600 dark:text-navy-300 font-bold">
                                                {selectedProject.year}
                                            </span>
                                        </div>
                                        <h2 className="font-display text-3xl md:text-4xl font-black text-navy-900 dark:text-navy-100 mb-2">
                                            {selectedProject.title}
                                        </h2>
                                        <p className="text-lg text-navy-600 dark:text-navy-300 font-medium">
                                            Client: <span className="font-bold">{selectedProject.client}</span>
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedProject(null)}
                                        className="p-3 bg-white dark:bg-navy-800 text-navy-900 dark:text-navy-100 rounded-full hover:bg-navy-100 dark:hover:bg-navy-700 transition-all duration-300 hover:scale-110 shadow-lg"
                                    >
                                        <FiX size={24} />
                                    </button>
                                </div>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6 lg:p-8">
                                {/* Description */}
                                <div className="mb-8">
                                    <h3 className="font-display text-2xl font-black text-navy-900 dark:text-navy-100 mb-4">
                                        Project Overview
                                    </h3>
                                    <p className="font-body text-lg text-navy-600 dark:text-navy-300 leading-relaxed font-medium">
                                        {selectedProject.description}
                                    </p>
                                </div>

                                {/* Technologies & Features */}
                                <div className="grid md:grid-cols-2 gap-8 mb-8">
                                    {/* Technologies */}
                                    <div>
                                        <h4 className="font-display text-xl font-black text-navy-900 dark:text-navy-100 mb-4">
                                            Technologies Used
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedProject.technologies.map((tech, techIndex) => (
                                                <span
                                                    key={techIndex}
                                                    className="bg-navy-100 dark:bg-navy-800 text-navy-700 dark:text-navy-200 px-4 py-2 rounded-full text-sm font-bold shadow-sm border border-navy-200 dark:border-navy-600"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Key Features */}
                                    <div>
                                        <h4 className="font-display text-xl font-black text-navy-900 dark:text-navy-100 mb-4">
                                            Key Features
                                        </h4>
                                        <ul className="space-y-2">
                                            {selectedProject.features.map((feature, featureIndex) => (
                                                <li key={featureIndex} className="flex items-start gap-2">
                                                    <span className="text-accent-500 mt-1 font-bold">✓</span>
                                                    <span className="text-sm text-navy-600 dark:text-navy-300 font-medium">
                                                        {feature}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Image Gallery */}
                                <div>
                                    <h3 className="font-display text-2xl font-black text-navy-900 dark:text-navy-100 mb-6">
                                        Project Gallery
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {selectedProject.images.map((image, imageIndex) => (
                                            <motion.div
                                                key={imageIndex}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.3, delay: imageIndex * 0.1 }}
                                                className="group relative bg-navy-100 dark:bg-navy-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-glow-blue dark:hover:shadow-glow transition-all duration-300 cursor-pointer"
                                                onClick={() => setSelectedImage(image)}
                                            >
                                                {/* Image Frame */}
                                                <div className="relative aspect-video overflow-hidden">
                                                    <iframe
                                                        src={image.embedUrl}
                                                        className="w-full h-full pointer-events-none"
                                                        allow="autoplay"
                                                        title={image.title}
                                                    />

                                                    {/* Overlay on hover */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-navy-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                                                        <div className="flex items-center gap-2 bg-white/90 dark:bg-navy-800/90 text-navy-900 dark:text-navy-100 px-4 py-2 rounded-full font-bold text-sm">
                                                            <FiExternalLink size={16} />
                                                            View Fullscreen
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Image Info */}
                                                <div className="p-4">
                                                    <h5 className="font-display text-lg font-bold text-navy-900 dark:text-navy-100 mb-1">
                                                        {image.title}
                                                    </h5>
                                                    <p className="text-sm text-navy-600 dark:text-navy-400 font-medium">
                                                        {image.description}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Fullscreen Image Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4"
                        onClick={() => setSelectedImage(null)}
                    >
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-4 right-4 text-white bg-navy-800/80 hover:bg-navy-700 p-3 rounded-full transition-all duration-300 hover:scale-110 z-10"
                        >
                            <FiX size={24} />
                        </button>

                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-6xl bg-navy-900 rounded-2xl overflow-hidden shadow-2xl"
                        >
                            <div className="aspect-video">
                                <iframe
                                    src={selectedImage.embedUrl}
                                    className="w-full h-full"
                                    allow="autoplay"
                                    title={selectedImage.title}
                                />
                            </div>
                            <div className="p-6 bg-navy-800">
                                <h3 className="font-display text-2xl font-black text-white mb-2">
                                    {selectedImage.title}
                                </h3>
                                <p className="text-navy-300 font-medium">
                                    {selectedImage.description}
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default Portfolio;
