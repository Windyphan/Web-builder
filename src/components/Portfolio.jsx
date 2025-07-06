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
        <section id="portfolio" className="section-padding bg-white">
            <div className="container-max">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Our Work
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Explore our portfolio of successful projects and see how we've helped businesses achieve their digital goals
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="relative overflow-hidden">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <div className="flex space-x-4">
                                        <a
                                            href={project.liveUrl}
                                            className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                                        >
                                            <FiExternalLink size={20} />
                                        </a>
                                        <a
                                            href={project.githubUrl}
                                            className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                                        >
                                            <FiGithub size={20} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {project.title}
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    {project.description}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {project.technologies.map((tech, techIndex) => (
                                        <span
                                            key={techIndex}
                                            className="bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-sm"
                                        >
                      {tech}
                    </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Portfolio;