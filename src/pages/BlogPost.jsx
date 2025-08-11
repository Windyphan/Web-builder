import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiCalendar, FiClock, FiTag, FiShare2 } from 'react-icons/fi';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { useTheme } from '../contexts/ThemeContext';
import blogAPI from '../utils/blogAPI';

const BlogPost = () => {
    const { slug } = useParams();
    const { isDark } = useTheme();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch post data on component mount
    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const postData = await blogAPI.getPostBySlug(slug);
                setPost(postData);
            } catch (err) {
                console.error('Error fetching post:', err);
                setError('Post not found or failed to load.');
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchPost();
        }
    }, [slug]);

    const handleShare = async () => {
        if (!post) return;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: post.title,
                    text: post.excerpt,
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            // Fallback to copying URL to clipboard
            navigator.clipboard.writeText(window.location.href);
            // You could show a notification here
        }
    };

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
                            <p className="text-gray-600 dark:text-gray-400">Loading article...</p>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className={`min-h-screen transition-colors duration-300 ${
                isDark ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'
            }`}>
                <Header />
                <main className="pt-20">
                    <div className="flex items-center justify-center min-h-[60vh]">
                        <div className="text-center">
                            <p className="text-red-600 dark:text-red-400 mb-4">{error || 'Article not found'}</p>
                            <Link
                                to="/blog"
                                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                            >
                                Back to Blog
                            </Link>
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
                <article className="max-w-4xl mx-auto px-6 py-12">
                    {/* Back to Blog */}
                    <Link
                        to="/blog"
                        className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mb-8 transition-colors duration-200"
                    >
                        <FiArrowLeft />
                        Back to Blog
                    </Link>

                    {/* Article Header */}
                    <header className="mb-8">
                        <motion.h1
                            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            {post.title}
                        </motion.h1>

                        <motion.div
                            className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-400 mb-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <div className="flex items-center gap-2">
                                <FiCalendar size={16} />
                                <span>{new Date(post.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FiClock size={16} />
                                <span>{post.readTime}</span>
                            </div>
                            <button
                                onClick={handleShare}
                                className="flex items-center gap-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                            >
                                <FiShare2 size={16} />
                                <span>Share</span>
                            </button>
                        </motion.div>

                        <motion.div
                            className="flex flex-wrap gap-2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            {post.tags && post.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full"
                                >
                                    <FiTag size={12} />
                                    {tag}
                                </span>
                            ))}
                        </motion.div>
                    </header>

                    {/* Article Content */}
                    <motion.div
                        className="prose prose-lg max-w-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        <MarkdownRenderer content={post.content} />
                    </motion.div>

                    {/* Article Footer */}
                    <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <p className="text-gray-600 dark:text-gray-400">
                                Written by <span className="font-medium text-gray-900 dark:text-gray-100">{post.author}</span>
                            </p>
                            <button
                                onClick={handleShare}
                                className="flex items-center gap-2 px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors duration-200"
                            >
                                <FiShare2 size={16} />
                                Share Article
                            </button>
                        </div>
                    </footer>
                </article>
            </main>

            <Footer />
        </div>
    );
};

export default BlogPost;
