import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiLogOut, FiSave, FiX, FiEyeOff, FiMaximize2, FiMinimize2, FiBold, FiItalic, FiCode, FiList, FiLink, FiImage, FiCalendar, FiTag } from 'react-icons/fi';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { useTheme } from '../contexts/ThemeContext';
import blogAPI from '../utils/blogAPI';

const BlogAdmin = () => {
    const { isDark } = useTheme();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(true);
    const [showPostModal, setShowPostModal] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [sitemapStatus, setSitemapStatus] = useState(null);
    const [submittingSitemap, setSubmittingSitemap] = useState(false);
    const [loginForm, setLoginForm] = useState({ email: '', password: '' });
    const [postForm, setPostForm] = useState({
        title: '',
        excerpt: '',
        content: '',
        author: 'The Innovation Curve Team',
        featured: false,
        published: true,
        tags: []
    });
    const [showPreview, setShowPreview] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        checkAuth();
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            fetchPosts();
        }
    }, [isAuthenticated]);

    // Add keyboard shortcut handler
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Only handle shortcuts when the content textarea is focused
            const textarea = document.querySelector('textarea[name="content"]');
            if (document.activeElement !== textarea) return;

            // Handle keyboard shortcuts
            if (e.ctrlKey || e.metaKey) {
                switch (e.key.toLowerCase()) {
                    case 'b':
                        e.preventDefault();
                        insertMarkdown('**', '**', 'bold text');
                        break;
                    case 'i':
                        e.preventDefault();
                        insertMarkdown('*', '*', 'italic text');
                        break;
                    case 'k':
                        e.preventDefault();
                        insertMarkdown('[', '](url)', 'link text');
                        break;
                    case 'e':
                        e.preventDefault();
                        insertMarkdown('`', '`', 'code');
                        break;
                    case '1':
                        e.preventDefault();
                        insertMarkdown('# ', '', 'Heading 1');
                        break;
                    case '2':
                        e.preventDefault();
                        insertMarkdown('## ', '', 'Heading 2');
                        break;
                    case '3':
                        e.preventDefault();
                        insertMarkdown('### ', '', 'Heading 3');
                        break;
                    case 'enter':
                        if (e.shiftKey) {
                            e.preventDefault();
                            insertMarkdown('```\n', '\n```', 'code block');
                        }
                        break;
                    // Note: Ctrl+Z (undo) is handled natively by the browser for textareas
                    // Note: Ctrl+Y (redo) is handled natively by the browser for textareas
                    default:
                        // Let other shortcuts (like Ctrl+Z, Ctrl+Y, Ctrl+A, etc.) work natively
                        break;
                }
            }
        };

        // Add event listener when modal is open
        if (showPostModal) {
            document.addEventListener('keydown', handleKeyDown);
        }

        // Cleanup
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [showPostModal, postForm.content]);

    const checkAuth = async () => {
        try {
            await blogAPI.verifyToken();
            setIsAuthenticated(true);
            setShowLoginModal(false);
        } catch (error) {
            setIsAuthenticated(false);
            setShowLoginModal(true);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await blogAPI.login(loginForm.email, loginForm.password);
            setIsAuthenticated(true);
            setShowLoginModal(false);
            setError(null);
        } catch (error) {
            setError('Invalid credentials. Please try again.');
        }
    };

    const handleLogout = () => {
        blogAPI.logout();
        setIsAuthenticated(false);
        setShowLoginModal(true);
        setPosts([]);
    };

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const postsData = await blogAPI.getAdminPosts();
            setPosts(postsData);
        } catch (err) {
            setError('Failed to fetch posts');
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePost = () => {
        setEditingPost(null);
        setPostForm({
            title: '',
            excerpt: '',
            content: '',
            author: 'The Innovation Curve Team',
            featured: false,
            published: true,
            tags: []
        });
        setShowPostModal(true);
    };

    const handleEditPost = (post) => {
        setEditingPost(post);
        setPostForm({
            title: post.title,
            excerpt: post.excerpt,
            content: post.content,
            author: post.author,
            featured: post.featured === 1,
            published: post.published === 1,
            tags: post.tags || []
        });
        setShowPostModal(true);
    };

    const handleSavePost = async (e) => {
        e.preventDefault();
        try {
            if (editingPost) {
                await blogAPI.updatePost(editingPost.id, postForm);
            } else {
                await blogAPI.createPost(postForm);
            }
            setShowPostModal(false);
            fetchPosts();
        } catch (error) {
            setError(`Failed to ${editingPost ? 'update' : 'create'} post`);
        }
    };

    const handleDeletePost = async (postId) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await blogAPI.deletePost(postId);
                fetchPosts();
            } catch (error) {
                setError('Failed to delete post');
            }
        }
    };

    const handleSubmitSitemap = async () => {
        setSubmittingSitemap(true);
        setSitemapStatus(null);
        try {
            await blogAPI.submitSitemap();
            setSitemapStatus('Sitemap submitted successfully!');
        } catch (error) {
            setSitemapStatus('Failed to submit sitemap.');
        } finally {
            setSubmittingSitemap(false);
        }
    };

    const insertMarkdown = (before, after = '', placeholder = 'text') => {
        const textarea = document.querySelector('textarea[name="content"]');
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = postForm.content.substring(start, end);
        const replacement = before + (selectedText || placeholder) + after;

        const newContent = postForm.content.substring(0, start) + replacement + postForm.content.substring(end);
        setPostForm({...postForm, content: newContent});

        // Set cursor position
        setTimeout(() => {
            textarea.focus();
            const newPosition = start + before.length + (selectedText || placeholder).length;
            textarea.setSelectionRange(newPosition, newPosition);
        }, 0);
    };

    const markdownButtons = [
        { icon: FiBold, action: () => insertMarkdown('**', '**', 'bold text'), title: 'Bold' },
        { icon: FiItalic, action: () => insertMarkdown('*', '*', 'italic text'), title: 'Italic' },
        { icon: FiCode, action: () => insertMarkdown('`', '`', 'code'), title: 'Inline Code' },
        { icon: FiList, action: () => insertMarkdown('- ', '', 'list item'), title: 'List' },
        { icon: FiLink, action: () => insertMarkdown('[', '](url)', 'link text'), title: 'Link' },
        { icon: FiImage, action: () => insertMarkdown('![', '](image-url)', 'alt text'), title: 'Image' },
    ];

    const insertHeading = (level) => {
        const prefix = '#'.repeat(level) + ' ';
        insertMarkdown(prefix, '', `Heading ${level}`);
    };

    if (showLoginModal) {
        return (
            <div className={`min-h-screen transition-colors duration-300 ${
                isDark ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'
            }`}>
                <Header />
                <div className="pt-20 flex items-center justify-center min-h-screen">
                    <motion.div
                        className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>
                        {error && (
                            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg">
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleLogin}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Email</label>
                                <input
                                    type="email"
                                    value={loginForm.email}
                                    onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    required
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-2">Password</label>
                                <input
                                    type="password"
                                    value={loginForm.password}
                                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors duration-200"
                            >
                                Login
                            </button>
                        </form>
                        <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm">
                            <p><strong>Default credentials:</strong></p>
                            <p>Email: info@theinnovationcurve.com</p>
                            <p>Password: admin123</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen transition-colors duration-300 ${
            isDark ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'
        }`}>
            <Header />

            <main className="pt-20 px-6 pb-20">
                <div className="container mx-auto max-w-6xl">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <motion.h1
                            className="text-3xl font-bold"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            Blog Admin
                        </motion.h1>
                        <div className="flex items-center gap-4">
                            <motion.button
                                onClick={handleCreatePost}
                                className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FiPlus />
                                New Post
                            </motion.button>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                            >
                                <FiLogOut />
                                Logout
                            </button>
                        </div>
                    </div>

                    {/* Posts List */}
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {posts.map((post) => (
                                        <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        {post.title}
                                                        {post.featured && (
                                                            <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 rounded-full">
                                                                Featured
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {post.excerpt.substring(0, 100)}...
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs rounded-full ${
                                                    post.published 
                                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' 
                                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400'
                                                }`}>
                                                    {post.published ? 'Published' : 'Draft'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(post.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                                                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                                                    >
                                                        <FiEye />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditPost(post)}
                                                        className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                                                    >
                                                        <FiEdit2 />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeletePost(post.id)}
                                                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                                                    >
                                                        <FiTrash2 />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Sitemap Submission */}
                    <div className="mt-8 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md">
                        <h2 className="text-xl font-bold mb-4">Sitemap Submission</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            Submit your sitemap to help search engines index your blog posts.
                        </p>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleSubmitSitemap}
                                className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center justify-center gap-2"
                                disabled={submittingSitemap}
                            >
                                {submittingSitemap ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <FiSave />
                                        Submit Sitemap
                                    </>
                                )}
                            </button>
                        </div>
                        {sitemapStatus && (
                            <div className={`mt-4 p-3 rounded-lg text-sm ${
                                sitemapStatus.includes('success') 
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' 
                                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                            }`}>
                                {sitemapStatus}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Post Modal */}
            {showPostModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <motion.div
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <h2 className="text-xl font-bold">
                                {editingPost ? 'Edit Post' : 'Create New Post'}
                            </h2>
                            <button
                                onClick={() => setShowPostModal(false)}
                                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            >
                                <FiX size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSavePost} className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">Title</label>
                                <input
                                    type="text"
                                    value={postForm.title}
                                    onChange={(e) => setPostForm({...postForm, title: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Excerpt</label>
                                <textarea
                                    value={postForm.excerpt}
                                    onChange={(e) => setPostForm({...postForm, excerpt: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-primary-500 h-20"
                                    required
                                />
                            </div>

                            {/* Enhanced Content Section with Preview */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium">Content (Markdown supported)</label>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowPreview(!showPreview)}
                                            className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                        >
                                            {showPreview ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                                            {showPreview ? 'Hide Preview' : 'Show Preview'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsFullscreen(!isFullscreen)}
                                            className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                        >
                                            {isFullscreen ? <FiMinimize2 size={14} /> : <FiMaximize2 size={14} />}
                                            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                                        </button>
                                    </div>
                                </div>

                                {/* Markdown Toolbar */}
                                <div className="flex flex-wrap gap-2 p-2 border border-gray-300 dark:border-gray-700 rounded-t-lg bg-gray-50 dark:bg-gray-800">
                                    <div className="flex gap-1">
                                        {[1, 2, 3].map(level => (
                                            <button
                                                key={level}
                                                type="button"
                                                onClick={() => insertHeading(level)}
                                                className="px-2 py-1 text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
                                                title={`Heading ${level}`}
                                            >
                                                H{level}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
                                    <div className="flex gap-1">
                                        {markdownButtons.map(({ icon: Icon, action, title }, index) => (
                                            <button
                                                key={index}
                                                type="button"
                                                onClick={action}
                                                className="p-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
                                                title={title}
                                            >
                                                <Icon size={14} />
                                            </button>
                                        ))}
                                    </div>
                                    <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
                                    <button
                                        type="button"
                                        onClick={() => insertMarkdown('```\n', '\n```', 'code block')}
                                        className="px-2 py-1 text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
                                        title="Code Block"
                                    >
                                        Code Block
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => insertMarkdown('> ', '', 'quote')}
                                        className="px-2 py-1 text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
                                        title="Quote"
                                    >
                                        Quote
                                    </button>
                                </div>

                                {/* Content Editor with Preview */}
                                <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white dark:bg-gray-900 p-6 flex flex-col' : ''}`}>
                                    {isFullscreen && (
                                        <div className="flex justify-between items-center mb-4 flex-shrink-0">
                                            <h3 className="text-lg font-semibold">Content Editor</h3>
                                            <button
                                                type="button"
                                                onClick={() => setIsFullscreen(false)}
                                                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
                                            >
                                                <FiX size={20} />
                                            </button>
                                        </div>
                                    )}

                                    <div className={`${showPreview ? 'grid grid-cols-2 gap-4' : ''} ${isFullscreen ? 'flex-1 min-h-0' : ''}`}>
                                        <div className="flex flex-col">
                                            {showPreview && (
                                                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex-shrink-0">
                                                    Editor
                                                </div>
                                            )}
                                            <textarea
                                                name="content"
                                                value={postForm.content}
                                                onChange={(e) => setPostForm({...postForm, content: e.target.value})}
                                                className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 ${showPreview ? 'rounded-lg' : 'rounded-b-lg'} focus:ring-2 focus:ring-primary-500 font-mono text-sm ${isFullscreen ? 'flex-1 min-h-0' : 'h-64'}`}
                                                placeholder="Write your content in Markdown format..."
                                                required
                                            />
                                        </div>

                                        {showPreview && (
                                            <div className="flex flex-col">
                                                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex-shrink-0">
                                                    Full Post Preview
                                                </div>
                                                <div className={`border border-gray-300 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800 overflow-y-auto ${isFullscreen ? 'flex-1 min-h-0' : 'h-64'}`}>
                                                    {/* Article Header */}
                                                    <header className="mb-6">
                                                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4 leading-tight">
                                                            {postForm.title || 'Your Post Title'}
                                                        </h1>

                                                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                                                            <div className="flex items-center gap-1">
                                                                <FiCalendar size={14} />
                                                                <span>{new Date().toLocaleDateString('en-US', {
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric'
                                                                })}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <FiEye size={14} />
                                                                <span>{Math.ceil(postForm.content.split(' ').length / 200)} min read</span>
                                                            </div>
                                                        </div>

                                                        {postForm.tags.length > 0 && (
                                                            <div className="flex flex-wrap gap-2 mb-4">
                                                                {postForm.tags.map((tag, index) => (
                                                                    <span
                                                                        key={index}
                                                                        className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full"
                                                                    >
                                                                        <FiTag size={10} />
                                                                        {tag}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}

                                                        {postForm.excerpt && (
                                                            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg mb-4 border-l-4 border-primary-500">
                                                                <p className="text-gray-700 dark:text-gray-300 italic">
                                                                    {postForm.excerpt}
                                                                </p>
                                                            </div>
                                                        )}

                                                        {postForm.featured && (
                                                            <div className="mb-4">
                                                                <span className="inline-flex items-center px-3 py-1 text-sm bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 rounded-full">
                                                                    ⭐ Featured Post
                                                                </span>
                                                            </div>
                                                        )}
                                                    </header>

                                                    {/* Article Content */}
                                                    <div className="prose prose-sm max-w-none">
                                                        {postForm.content ? (
                                                            <MarkdownRenderer content={postForm.content} />
                                                        ) : (
                                                            <p className="text-gray-500 dark:text-gray-400 italic">
                                                                Start writing your content to see the preview...
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Article Footer */}
                                                    <footer className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                Written by <span className="font-medium text-gray-900 dark:text-gray-100">{postForm.author}</span>
                                                            </p>
                                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                Status: {postForm.published ? 'Published' : 'Draft'}
                                                            </div>
                                                        </div>
                                                    </footer>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                                <input
                                    type="text"
                                    value={postForm.tags.join(', ')}
                                    onChange={(e) => setPostForm({...postForm, tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)})}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    placeholder="React, JavaScript, Web Development"
                                />
                            </div>

                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={postForm.featured}
                                        onChange={(e) => setPostForm({...postForm, featured: e.target.checked})}
                                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                    />
                                    Featured Post
                                </label>

                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={postForm.published}
                                        onChange={(e) => setPostForm({...postForm, published: e.target.checked})}
                                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                    />
                                    Published
                                </label>
                            </div>

                            <div className="flex items-center gap-4 pt-4">
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200"
                                >
                                    <FiSave />
                                    {editingPost ? 'Update Post' : 'Create Post'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowPostModal(false)}
                                    className="px-6 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default BlogAdmin;
