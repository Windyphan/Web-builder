import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiLinkedin, FiGithub } from 'react-icons/fi';
import CEO_pic from '../assets/CEO_pic_Phong.jpg';

const Team = () => {
    const teamMembers = [
        {
            name: 'Phong Minh Phan',
            role: 'Founder & Lead Developer',
            image: CEO_pic,
            bio: 'Full-stack developer with 5+ years of experience in modern web technologies. Passionate about creating innovative digital solutions.',
            skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'MongoDB', 'UI/UX Design'],
            email: 'pmphong1999@gmail.com',
            phone: '07340764930',
            linkedin: 'https://linkedin.com/in/phong-phan',
            github: 'https://github.com/Windyphan'
        }
    ];

    return (
        <section id="team" className="section-padding bg-gray-50 dark:bg-gray-800">
            <div className="container-max">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        Meet Our Team
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Passionate professionals dedicated to delivering exceptional web solutions
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
                    {teamMembers.map((member, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white dark:bg-gray-700 rounded-xl shadow-lg dark:shadow-gray-900/20 p-6 text-center hover:shadow-xl dark:hover:shadow-gray-900/30 transition-shadow duration-300"
                        >
                            <div className="relative mb-6">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                                />
                                <div className="absolute inset-0 bg-primary-600 rounded-full opacity-0 hover:opacity-10 transition-opacity duration-300"></div>
                            </div>

                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                {member.name}
                            </h3>
                            <p className="text-primary-600 dark:text-primary-400 font-medium mb-3">
                                {member.role}
                            </p>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                                {member.bio}
                            </p>

                            {/* Skills */}
                            <div className="flex flex-wrap gap-2 justify-center mb-6">
                                {member.skills.map((skill, skillIndex) => (
                                    <span
                                        key={skillIndex}
                                        className="bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-3 py-1 rounded-full text-sm"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>

                            {/* Contact Information */}
                            <div className="space-y-2 mb-6">
                                <div className="flex items-center justify-center text-gray-600 dark:text-gray-300">
                                    <FiMail size={16} className="mr-2" />
                                    <span className="text-sm">{member.email}</span>
                                </div>
                                <div className="flex items-center justify-center text-gray-600 dark:text-gray-300">
                                    <FiPhone size={16} className="mr-2" />
                                    <span className="text-sm">{member.phone}</span>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="flex justify-center space-x-4">
                                <a
                                    href={member.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                >
                                    <FiLinkedin size={20} />
                                </a>
                                <a
                                    href={member.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                >
                                    <FiGithub size={20} />
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Team;