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
            linkedin: 'https://linkedin.com/in/phong-phan-30814616b/',
            github: 'https://github.com/Windyphan'
        }
    ];

    return (
        <section id="team" className="section-padding bg-gradient-to-br from-navy-50 via-white to-primary-50 dark:from-navy-900 dark:via-navy-800 dark:to-navy-950">
            <div className="container-max">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="font-display text-display-lg md:text-6xl font-extrabold bg-gradient-to-r from-navy-900 via-primary-600 to-accent-600 dark:from-navy-100 dark:via-primary-400 dark:to-accent-400 bg-clip-text text-transparent mb-6 tracking-headline">
                        Meet Our Team
                    </h2>
                    <p className="font-body text-xl md:text-2xl text-navy-600 dark:text-navy-300 max-w-3xl mx-auto leading-relaxed font-medium">
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
                            className="bg-gradient-card dark:bg-gradient-card-dark rounded-3xl shadow-premium dark:shadow-premium-dark p-8 text-center hover:shadow-glow-blue dark:hover:shadow-glow transition-all duration-300 hover:scale-105 border border-navy-200/20 dark:border-navy-700/20 group"
                        >
                            <div className="relative mb-6">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-accent-500 shadow-glow group-hover:scale-110 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 rounded-full bg-gradient-to-t from-accent-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>

                            <h3 className="font-display text-2xl font-bold text-navy-900 dark:text-navy-100 mb-2 group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors duration-300">
                                {member.name}
                            </h3>

                            <p className="font-body text-accent-600 dark:text-accent-400 font-semibold mb-4">
                                {member.role}
                            </p>

                            <p className="font-body text-navy-600 dark:text-navy-300 mb-6 leading-relaxed">
                                {member.bio}
                            </p>

                            {/* Skills */}
                            <div className="flex flex-wrap gap-2 justify-center mb-6">
                                {member.skills.map((skill, skillIndex) => (
                                    <span
                                        key={skillIndex}
                                        className="bg-navy-100 dark:bg-navy-800 text-navy-600 dark:text-navy-300 px-3 py-1 rounded-full text-xs font-medium"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>

                            {/* Contact Links */}
                            <div className="flex justify-center gap-4">
                                <a
                                    href={`mailto:${member.email}`}
                                    className="p-3 bg-gradient-accent text-white rounded-full shadow-glow hover:scale-110 transition-all duration-300"
                                    title="Email"
                                >
                                    <FiMail size={18} />
                                </a>
                                <a
                                    href={`tel:${member.phone}`}
                                    className="p-3 bg-primary-600 text-white rounded-full hover:bg-primary-700 hover:scale-110 transition-all duration-300"
                                    title="Phone"
                                >
                                    <FiPhone size={18} />
                                </a>
                                <a
                                    href={member.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 bg-navy-800 text-white rounded-full hover:bg-navy-700 hover:scale-110 transition-all duration-300"
                                    title="LinkedIn"
                                >
                                    <FiLinkedin size={18} />
                                </a>
                                <a
                                    href={member.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 bg-gray-800 text-white rounded-full hover:bg-gray-700 hover:scale-110 transition-all duration-300"
                                    title="GitHub"
                                >
                                    <FiGithub size={18} />
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