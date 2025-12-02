import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const FeaturedPortfolio = () => {
    const { isDark } = useTheme();

    const projects = [
        {
            id: 1,
            title: 'Travel & Tourism Website',
            shortDescription: 'Comprehensive travel booking platform with tour packages and seamless booking experience.',
            category: 'Web Application',
            image: 'https://assets.theinnovationcurve.com/Trang-thanh-travel/TrangThanh_case_study.png',
            tags: ['React', 'Node.js', 'PostgresSQL']
        },
        {
            id: 2,
            title: 'CIWUW - 3D Body Mapping Platform',
            shortDescription: 'Innovative tattoo business platform with 3D body mapping technology for demo requests and licensing.',
            category: 'Tech Platform',
            image: 'https://assets.theinnovationcurve.com/CIWUW/Hoempage_hero_section.png',
            tags: ['React', 'Three.js', 'WebGL']
        },
        {
            id: 3,
            title: 'XCY SOUNDS - Artist Music Platform',
            shortDescription: 'Custom music streaming platform with vinyl record sales for independent artist.',
            category: 'Music Platform',
            image: 'https://assets.theinnovationcurve.com/XCY-Sounds/Homepage_hero_track.png',
            tags: ['React', 'Web Audio API', 'MongoDB']
        }
    ];

    return (
        <section className={`py-20 transition-colors duration-300 ${
            isDark 
                ? 'bg-gradient-to-b from-navy-900 to-navy-950' 
                : 'bg-gradient-to-b from-gray-50 to-white'
        }`}>
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className={`font-display text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight ${
                        isDark
                            ? 'bg-gradient-to-r from-navy-100 via-primary-400 to-accent-400 bg-clip-text text-transparent'
                            : 'bg-gradient-to-r from-navy-900 via-primary-600 to-accent-600 bg-clip-text text-transparent'
                    }`}>
                        Featured Work
                    </h2>
                    <p className={`text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed ${
                        isDark ? 'text-navy-300' : 'text-navy-600'
                    }`}>
                        Explore some of our recent projects
                    </p>
                </motion.div>

                {/* Projects Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className={`group rounded-2xl overflow-hidden transition-all duration-500 hover:scale-105 ${
                                isDark
                                    ? 'bg-navy-800/50 border border-navy-700/50 hover:shadow-2xl hover:shadow-primary-500/20'
                                    : 'bg-white border border-gray-200 hover:shadow-2xl hover:shadow-primary-500/20'
                            }`}
                        >
                            {/* Featured Image */}
                            <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-navy-900">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                                />
                                {/* Category Badge */}
                                <div className="absolute top-4 left-4">
                                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${
                                        isDark
                                            ? 'bg-primary-500/90 text-white'
                                            : 'bg-primary-600/90 text-white'
                                    }`}>
                                        {project.category}
                                    </span>
                                </div>
                            </div>

                            {/* Project Info */}
                            <div className="p-6">
                                <h3 className={`font-display text-2xl font-bold mb-3 transition-colors ${
                                    isDark 
                                        ? 'text-navy-100 group-hover:text-primary-400' 
                                        : 'text-navy-900 group-hover:text-primary-600'
                                }`}>
                                    {project.title}
                                </h3>
                                <p className={`text-base mb-4 leading-relaxed ${
                                    isDark ? 'text-navy-300' : 'text-navy-600'
                                }`}>
                                    {project.shortDescription}
                                </p>

                                {/* Technology Tags */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {project.tags.map((tag, tagIndex) => (
                                        <span
                                            key={tagIndex}
                                            className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                                                isDark
                                                    ? 'bg-navy-700/50 text-navy-200'
                                                    : 'bg-gray-100 text-navy-700'
                                            }`}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* View All Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <Link
                        to="/portfolio"
                        className={`inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 ${
                            isDark
                                ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:shadow-lg hover:shadow-primary-500/50'
                                : 'bg-gradient-to-r from-primary-600 to-accent-600 text-white hover:shadow-lg hover:shadow-primary-600/50'
                        }`}
                    >
                        View All Projects
                        <FiArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default FeaturedPortfolio;

