import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiSearch, FiCalendar, FiClock, FiTag } from 'react-icons/fi';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useTheme } from '../contexts/ThemeContext';
import blogAPI from '../utils/blogAPI';

const BlogCard = ({ post, index }) => {
    const { isDark } = useTheme();

    return (
        <motion.article
            className={`${post.featured ? 'md:col-span-2' : ''} bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
        >
            <div className="p-6">
                {post.featured && (
                    <span className="inline-block px-3 py-1 text-xs font-semibold text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4">
                        Featured
                    </span>
                )}

                <h2 className={`${post.featured ? 'text-2xl' : 'text-xl'} font-bold text-gray-900 dark:text-gray-100 mb-3 line-clamp-2`}>
                    <Link
                        to={`/blog/${post.slug}`}
                        className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                    >
                        {post.title}
                    </Link>
                </h2>

                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                    {post.excerpt}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                        <FiCalendar size={14} />
                        <span>{new Date(post.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <FiClock size={14} />
                        <span>{post.readTime}</span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags && post.tags.slice(0, 3).map((tag) => (
                        <span
                            key={tag}
                            className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md"
                        >
                            <FiTag size={10} />
                            {tag}
                        </span>
                    ))}
                </div>

                <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200"
                >
                    Read More →
                </Link>
            </div>
        </motion.article>
    );
};

const BlogPage = () => {
    const { isDark } = useTheme();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTag, setSelectedTag] = useState('');
    const [posts, setPosts] = useState([]);
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch posts and tags on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [postsResponse, tagsData] = await Promise.all([
                    blogAPI.getPosts(),
                    blogAPI.getTags()
                ]);
                // Extract posts array from the response object
                setPosts(postsResponse.posts || []);
                setTags(tagsData || []);
            } catch (err) {
                console.error('Error fetching blog data:', err);
                setError('Failed to load blog posts. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filter posts based on search and tag
    const filteredPosts = useMemo(() => {
        return posts.filter(post => {
            const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesTag = !selectedTag || (post.tags && post.tags.includes(selectedTag));
            return matchesSearch && matchesTag;
        });
    }, [posts, searchTerm, selectedTag]);

    if (loading) {
        return (
            <div className={`min-h-screen transition-colors duration-300 ${
                isDark ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'
            }`}>
                <Header />
                <main className="pt-20">
                    <div className="flex items-center justify-center min-h-[60vh]">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                            <p className="text-gray-600 dark:text-gray-400">Loading blog posts...</p>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className={`min-h-screen transition-colors duration-300 ${
                isDark ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'
            }`}>
                <Header />
                <main className="pt-20">
                    <div className="flex items-center justify-center min-h-[60vh]">
                        <div className="text-center">
                            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className={`min-h-screen transition-colors duration-300 ${
            isDark ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'
        }`}>
            <Header />

            <main className="pt-20">
                {/* Hero Section */}
                <section className="py-20 px-6">
                    <div className="container mx-auto text-center">
                        <motion.h1
                            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            Our Blog
                        </motion.h1>
                        <motion.p
                            className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            Insights, tutorials, and thoughts on web development, design, and technology trends
                        </motion.p>
                    </div>
                </section>

                {/* Search and Filter Section */}
                <section className="px-6 mb-12">
                    <div className="container mx-auto max-w-6xl">
                        <div className="flex flex-col md:flex-row gap-4 mb-8">
                            {/* Search Bar */}
                            <div className="relative flex-1">
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search articles..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                                />
                            </div>

                            {/* Tag Filter */}
                            <select
                                value={selectedTag}
                                onChange={(e) => setSelectedTag(e.target.value)}
                                className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                            >
                                <option value="">All Topics</option>
                                {tags.map(tag => (
                                    <option key={tag.slug} value={tag.name}>{tag.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </section>

                {/* Blog Posts Grid */}
                <section className="px-6 pb-20">
                    <div className="container mx-auto max-w-6xl">
                        {filteredPosts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredPosts.map((post, index) => (
                                    <BlogCard key={post.id} post={post} index={index} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-500 dark:text-gray-400 text-lg">
                                    No articles found matching your criteria.
                                </p>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default BlogPage;
