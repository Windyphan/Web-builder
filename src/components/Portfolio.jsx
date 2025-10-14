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
            year: '2025',
            thumbnail: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
            technologies: ['React', 'Node.js', 'PostgresSQL', 'Tailwind CSS', 'Express'],
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
                    embedUrl: 'https://assets.theinnovationcurve.com/Trang-thanh-travel/TrangThanh_case_study.png'
                },
                {
                    title: 'Tours Page',
                    description: 'Advanced filtering and comprehensive tour listings',
                    embedUrl: 'https://assets.theinnovationcurve.com/Trang-thanh-travel/Tours_page_2.png'
                },
                {
                    title: 'News Section',
                    description: 'Travel news and destination highlights',
                    embedUrl: 'https://assets.theinnovationcurve.com/Trang-thanh-travel/News.png'
                },
                {
                    title: 'Featured Tours',
                    description: 'Curated tour packages on homepage',
                    embedUrl: 'https://assets.theinnovationcurve.com/Trang-thanh-travel/Home_page.png'
                },
                {
                    title: 'Booking Form',
                    description: 'Streamlined booking process',
                    embedUrl: 'https://assets.theinnovationcurve.com/Trang-thanh-travel/Booking_form.png'
                }
            ]
        },
        {
            id: 2,
            title: 'CIWUW - 3D Body Mapping Platform',
            shortDescription: 'Innovative tattoo business platform with 3D body mapping technology for demo requests and licensing.',
            description: 'CIWUW (Call It What U Wanna) is a cutting-edge tattoo business platform that enables customers to request demos of advanced 3D body mapping technology and obtain licenses. The platform bridges the gap between tattoo artists and technology, offering a seamless experience for exploring body art possibilities.',
            category: 'Tech Platform',
            client: 'CIWUW Tattoo Technology',
            year: '2025',
            thumbnail: 'https://images.unsplash.com/photo-1590246814883-57c511a3865a?auto=format&fit=crop&w=800&q=80',
            technologies: ['React', 'Three.js', 'WebGL', 'Node.js', 'Tailwind CSS'],
            features: [
                '3D body mapping visualization',
                'Demo request management system',
                'License acquisition workflow',
                'Intuitive user interface',
                'Modern, bold design aesthetic'
            ],
            images: [
                {
                    title: 'Hero Section',
                    description: 'Bold and modern homepage design with striking visuals',
                    embedUrl: 'https://assets.theinnovationcurve.com/CIWUW/Hoempage_hero_section.png'
                }
            ]
        },
        {
            id: 3,
            title: 'XCY SOUNDS - Artist Music Platform',
            shortDescription: 'Custom music streaming platform with vinyl record sales for independent artist to showcase and sell original music.',
            description: 'XCY SOUNDS is a personalized music streaming and vinyl record sales platform built for an independent artist. The platform features a hero track section highlighting her most impressive work, along with a curated collection of featured tracks. Fans can browse the complete music catalog and purchase vinyl records of their favorite songs. Built with a focus on audio quality and seamless e-commerce integration, it provides an immersive listening and shopping experience.',
            category: 'Music Platform',
            client: 'XCY SOUNDS Artist',
            year: '2025',
            thumbnail: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80',
            technologies: ['React', 'Web Audio API', 'Node.js', 'MongoDB', 'Tailwind CSS'],
            features: [
                'Hero track showcase for best songs',
                'Featured tracks section',
                'Integrated audio player',
                'Vinyl record e-commerce',
                'Browse and search music catalog',
                'Track details and purchase options',
                'Responsive music controls',
                'Artist portfolio and biography',
                'Social media integration'
            ],
            images: [
                {
                    title: 'Hero Track Section',
                    description: 'Showcase of the artist\'s most impressive track with immersive design',
                    embedUrl: 'https://assets.theinnovationcurve.com/XCY-Sounds/Homepage_hero_track.png'
                },
                {
                    title: 'Featured Tracks',
                    description: 'Curated collection of featured music tracks on homepage',
                    embedUrl: 'https://assets.theinnovationcurve.com/XCY-Sounds/Homepage_featured_track.png'
                },
                {
                    title: 'Browsing Page',
                    description: 'Complete music catalog with search and filter functionality',
                    embedUrl: 'https://assets.theinnovationcurve.com/XCY-Sounds/Browsing_page.png'
                },
                {
                    title: 'Track Details',
                    description: 'Detailed track information with vinyl record purchase options',
                    embedUrl: 'https://assets.theinnovationcurve.com/XCY-Sounds/Track_details.png'
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
                        Innovative solutions we've crafted for our clients.
                    </p>
                </motion.div>

                {/* Project Cards Grid */}
                <div className="grid md:grid-cols-2 gap-8">
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            onClick={() => setSelectedProject(project)}
                            className="group cursor-pointer overflow-hidden hover:shadow-glow-blue dark:hover:shadow-glow transition-all duration-500 hover:scale-105 border border-navy-200/20 dark:border-navy-700/20"
                        >
                            {/* Project Thumbnail - Full Card */}
                            <div className="relative overflow-hidden aspect-[16/10] w-full bg-navy-100 dark:bg-navy-800">
                                {/* Homepage Featured Image */}
                                <img
                                    src={project.images[0].embedUrl}
                                    alt={project.title}
                                    className="w-full h-full object-contain object-center"
                                />

                                {/* Hover Overlay with Name and Learn More */}
                                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/95 via-navy-900/80 to-navy-900/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center gap-6 p-8">
                                    {/* Project Name */}
                                    <motion.h3
                                        className="font-display text-2xl md:text-3xl font-black text-white text-center leading-tight"
                                        initial={{ y: 20, opacity: 0 }}
                                        whileInView={{ y: 0, opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {project.title}
                                    </motion.h3>

                                    {/* Learn More Button */}
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        whileInView={{ y: 0, opacity: 1 }}
                                        transition={{ duration: 0.3, delay: 0.1 }}
                                        className="flex items-center gap-3 bg-white dark:bg-accent-600 text-navy-900 dark:text-white px-8 py-3 rounded-full font-black text-lg hover:scale-110 transition-transform duration-300"
                                    >
                                        <span>Learn More</span>
                                        <FiExternalLink size={20} />
                                    </motion.div>
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
                            Let's bring your vision to life with a custom solution.
                        </p>
                        <motion.button
                            className="bg-gradient-accent hover:shadow-glow text-white px-8 py-4 rounded-full font-black text-lg transition-all duration-300 hover:scale-105"
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
                            className="bg-white dark:bg-navy-900 rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto my-8"
                        >
                            {/* Modal Header */}
                            <div className="sticky top-0 z-10 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-navy-800 dark:to-navy-700 p-6 lg:p-8 border-b border-navy-200 dark:border-navy-600">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="bg-accent-500 text-white px-4 py-1.5 rounded-full text-xs font-black">
                                                {selectedProject.category}
                                            </span>
                                        </div>
                                        <h2 className="font-display text-3xl md:text-4xl font-black text-navy-900 dark:text-navy-100 mb-2">
                                            {selectedProject.title}
                                        </h2>
                                    </div>
                                    <button
                                        onClick={() => setSelectedProject(null)}
                                        className="p-3 bg-white dark:bg-navy-800 text-navy-900 dark:text-navy-100 rounded-full hover:bg-navy-100 dark:hover:bg-navy-700 transition-all duration-300 hover:scale-110"
                                    >
                                        <FiX size={24} />
                                    </button>
                                </div>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6 lg:p-8">
                                {/* Description */}
                                <div className="mb-8">
                                    <p className="font-body text-lg text-navy-600 dark:text-navy-300 leading-relaxed font-medium">
                                        {selectedProject.description}
                                    </p>
                                </div>

                                {/* Technologies */}
                                <div className="mb-8">
                                    <h4 className="font-display text-xl font-black text-navy-900 dark:text-navy-100 mb-4">
                                        Technologies
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedProject.technologies.map((tech, techIndex) => (
                                            <span
                                                key={techIndex}
                                                className="bg-navy-100 dark:bg-navy-800 text-navy-700 dark:text-navy-200 px-4 py-2 rounded-full text-sm font-bold border border-navy-200 dark:border-navy-600"
                                            >
                                                {tech}
                                            </span>
                                        ))}
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
                                                className="group relative bg-navy-100 dark:bg-navy-800 overflow-hidden hover:shadow-glow-blue dark:hover:shadow-glow transition-all duration-300 cursor-pointer"
                                                onClick={() => setSelectedImage(image)}
                                            >
                                                {/* Image Frame */}
                                                <div className="relative aspect-video overflow-hidden">
                                                    <img
                                                        src={image.embedUrl}
                                                        alt={image.title}
                                                        className="w-full h-full object-cover"
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
                            className="w-full max-w-6xl bg-navy-900 overflow-hidden"
                        >
                            <div className="aspect-video">
                                <img
                                    src={selectedImage.embedUrl}
                                    alt={selectedImage.title}
                                    className="w-full h-full object-contain"
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
