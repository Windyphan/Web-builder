import { motion } from 'framer-motion';
import { FiExternalLink, FiGithub } from 'react-icons/fi';

const Portfolio = () => {
    const projects = [
        {
            title: 'E-commerce Platform',
            description: 'Modern online store with advanced filtering, secure payments, and admin dashboard.',
            image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80',
            technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
            liveUrl: '#',
            githubUrl: '#'
        },
        {
            title: 'Corporate Website',
            description: 'Professional business website with CMS, contact forms, and SEO optimization.',
            image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
            technologies: ['Next.js', 'Tailwind CSS', 'Sanity CMS', 'Vercel'],
            liveUrl: '#',
            githubUrl: '#'
        },
        {
            title: 'Mobile Banking App',
            description: 'Secure mobile banking application with biometric authentication and real-time transactions.',
            image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80',
            technologies: ['React Native', 'Firebase', 'Redux', 'Expo'],
            liveUrl: '#',
            githubUrl: '#'
        },
        {
            title: 'Real Estate Platform',
            description: 'Property listing platform with advanced search, virtual tours, and agent management.',
            image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
            technologies: ['Vue.js', 'Laravel', 'MySQL', 'AWS'],
            liveUrl: '#',
            githubUrl: '#'
        },
        {
            title: 'Social Media Dashboard',
            description: 'Analytics dashboard for social media management with real-time data visualization.',
            image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=800&q=80',
            technologies: ['React', 'D3.js', 'Express', 'PostgreSQL'],
            liveUrl: '#',
            githubUrl: '#'
        },
        {
            title: 'Learning Management System',
            description: 'Educational platform with course management, video streaming, and progress tracking.',
            image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=800&q=80',
            technologies: ['Angular', 'Spring Boot', 'MongoDB', 'WebRTC'],
            liveUrl: '#',
            githubUrl: '#'
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
                        Our Portfolio
                    </h2>
                    <p className="font-body text-xl md:text-2xl text-navy-600 dark:text-navy-300 max-w-3xl mx-auto leading-relaxed font-bold">
                        Showcasing our recent projects and the innovative solutions we've delivered for our clients.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="group bg-gradient-card dark:bg-gradient-card-dark rounded-3xl shadow-premium dark:shadow-premium-dark overflow-hidden hover:shadow-glow-blue dark:hover:shadow-glow transition-all duration-300 hover:scale-105 border border-navy-200/20 dark:border-navy-700/20"
                        >
                            <div className="relative overflow-hidden">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                {/* Action buttons */}
                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <a
                                        href={project.liveUrl}
                                        className="p-2 bg-gradient-accent text-white rounded-full shadow-glow hover:scale-110 transition-all duration-300"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <FiExternalLink size={16} />
                                    </a>
                                    <a
                                        href={project.githubUrl}
                                        className="p-2 bg-navy-800 text-white rounded-full hover:bg-navy-700 hover:scale-110 transition-all duration-300"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <FiGithub size={16} />
                                    </a>
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="font-display text-xl font-bold text-navy-900 dark:text-navy-100 mb-3 group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors duration-300">
                                    {project.title}
                                </h3>

                                <p className="font-body text-navy-600 dark:text-navy-300 mb-4 leading-relaxed">
                                    {project.description}
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    {project.technologies.map((tech, techIndex) => (
                                        <span
                                            key={techIndex}
                                            className="bg-navy-100 dark:bg-navy-800 text-navy-600 dark:text-navy-300 px-3 py-1 rounded-full text-xs font-medium"
                                        >
                                            {tech}
                                        </span>
                                    ))}
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
                        <h3 className="font-display text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                            Ready to Start Your Project?
                        </h3>
                        <p className="font-body text-navy-200 mb-8 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
                            Let's discuss how we can bring your vision to life with a custom solution tailored to your needs.
                        </p>
                        <motion.button
                            className="bg-gradient-accent hover:shadow-glow text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 shadow-premium"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => window.location.href = '/contact'}
                        >
                            Get Started Today
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Portfolio;