import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiSave, FiX, FiEyeOff, FiMaximize2, FiMinimize2, FiBold, FiItalic, FiCode, FiList, FiLink, FiImage, FiCalendar, FiTag } from 'react-icons/fi';
import AdminSidebar from '../components/admin/AdminSidebar';
import MarkdownRenderer from '../components/MarkdownRenderer';
import blogAPI from '../utils/blogAPI';

const BlogAdmin = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showPostModal, setShowPostModal] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [sitemapStatus, setSitemapStatus] = useState(null);
    const [submittingSitemap, setSubmittingSitemap] = useState(false);
    const [postForm, setPostForm] = useState({
        title: '',
        excerpt: '',
        content: '',
        author: 'Phong Minh Phan',
        featured: false,
        published: true,
        tags: [],
        image_url: ''
    });
    const [showPreview, setShowPreview] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, []);

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
            author: 'Phong Minh Phan',
            featured: false,
            published: true,
            tags: [],
            image_url: ''
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
            // Fix: Handle various data types for featured/published
            featured: post.featured === 1 || post.featured === true || post.featured === 'true' || post.featured === 't',
            published: post.published === 1 || post.published === true || post.published === 'true' || post.published === 't',
            tags: post.tags || [],
            image_url: post.image_url || ''
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
        { icon: FiBold,   action: () => insertMarkdown('**', '**', 'bold text'),     title: 'Bold' },
        { icon: FiItalic, action: () => insertMarkdown('*', '*', 'italic text'),     title: 'Italic' },
        { icon: FiCode,   action: () => insertMarkdown('`', '`', 'code'),            title: 'Inline Code' },
        { icon: FiList,   action: () => insertMarkdown('- ', '', 'list item'),       title: 'List' },
        { icon: FiLink,   action: () => insertMarkdown('[', '](url)', 'link text'),  title: 'Link' },
        { icon: FiImage,  action: () => insertMarkdown('![', '](image-url)', 'alt text'), title: 'Image' },
    ];

    const insertHeading = (level) => {
        const prefix = '#'.repeat(level) + ' ';
        insertMarkdown(prefix, '', `Heading ${level}`);
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
            <AdminSidebar />

            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                {/* Top bar */}
                <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                    <div className="pl-10 md:pl-0">
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Blog Management</h1>
                        <p className="text-xs text-gray-400 mt-0.5">{posts.length} post{posts.length !== 1 ? 's' : ''}</p>
                    </div>
                    <motion.button
                        onClick={handleCreatePost}
                        className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <FiPlus size={15} />
                        New Post
                    </motion.button>
                </div>

                <div className="p-4 md:p-6 space-y-5">
                    {error && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Posts List */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {posts.map((post) => (
                                            <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                            {post.title}
                                                            {(post.featured === 1 || post.featured === true) && (
                                                                <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 rounded-full">
                                                                    Featured
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                                                            {post.excerpt?.substring(0, 100)}...
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-0.5 text-xs rounded-full font-semibold ${
                                                        (post.published === 1 || post.published === true)
                                                            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                                    }`}>
                                                        {(post.published === 1 || post.published === true) ? 'Published' : 'Draft'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-xs text-gray-400 hidden md:table-cell">
                                                    {new Date(post.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                                                            className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                                                            title="View"
                                                        >
                                                            <FiEye size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleEditPost(post)}
                                                            className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                                                            title="Edit"
                                                        >
                                                            <FiEdit2 size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeletePost(post.id)}
                                                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                            title="Delete"
                                                        >
                                                            <FiTrash2 size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {posts.length === 0 && !loading && (
                                    <div className="text-center py-12 text-gray-400">
                                        <p className="text-sm">No posts yet. Create your first post!</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Sitemap Submission */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
                        <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Sitemap Submission</h2>
                        <p className="text-xs text-gray-400 mb-4">
                            Submit your sitemap to help search engines index your blog posts.
                        </p>
                        <button
                            onClick={handleSubmitSitemap}
                            className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors disabled:opacity-60"
                            disabled={submittingSitemap}
                        >
                            {submittingSitemap ? (
                                <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> Submitting...</>
                            ) : (
                                <><FiSave size={14} /> Submit Sitemap</>
                            )}
                        </button>
                        {sitemapStatus && (
                            <div className={`mt-3 p-3 rounded-xl text-sm ${
                                sitemapStatus.includes('success')
                                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                                    : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                            }`}>
                                {sitemapStatus}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Post Modal */}
            {showPostModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <motion.div
                        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                {editingPost ? 'Edit Post' : 'Create New Post'}
                            </h2>
                            <button onClick={() => setShowPostModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500">
                                <FiX size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSavePost} className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Title</label>
                                <input type="text" value={postForm.title} onChange={(e) => setPostForm({...postForm, title: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-gray-900 dark:text-white" required />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Excerpt</label>
                                <textarea value={postForm.excerpt} onChange={(e) => setPostForm({...postForm, excerpt: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none h-20 text-gray-900 dark:text-white" required />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Author</label>
                                <input type="text" value={postForm.author} onChange={(e) => setPostForm({...postForm, author: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-gray-900 dark:text-white"
                                    placeholder="Who wrote this post?" required />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Featured Image URL (optional)</label>
                                <input type="url" value={postForm.image_url || ''} onChange={(e) => setPostForm({...postForm, image_url: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-gray-900 dark:text-white"
                                    placeholder="https://example.com/image.jpg" />
                            </div>

                            {/* Content with Markdown toolbar + preview — unchanged from original */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Content (Markdown supported)</label>
                                    <div className="flex items-center gap-2">
                                        <button type="button" onClick={() => setShowPreview(!showPreview)}
                                            className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                            {showPreview ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                                            {showPreview ? 'Hide Preview' : 'Show Preview'}
                                        </button>
                                        <button type="button" onClick={() => setIsFullscreen(!isFullscreen)}
                                            className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                            {isFullscreen ? <FiMinimize2 size={14} /> : <FiMaximize2 size={14} />}
                                            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 p-2 border border-gray-300 dark:border-gray-700 rounded-t-lg bg-gray-50 dark:bg-gray-800">
                                    <div className="flex gap-1">
                                        {[1, 2, 3].map(level => (
                                            <button key={level} type="button" onClick={() => insertHeading(level)}
                                                className="px-2 py-1 text-xs bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300">
                                                H{level}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
                                    <div className="flex gap-1">
                                        {markdownButtons.map(({ icon: Icon, action, title }, index) => (
                                            <button key={index} type="button" onClick={action}
                                                className="p-1.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300" title={title}>
                                                <Icon size={14} />
                                            </button>
                                        ))}
                                    </div>
                                    <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
                                    <button type="button" onClick={() => insertMarkdown('```\n', '\n```', 'code block')}
                                        className="px-2 py-1 text-xs bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300">
                                        Code Block
                                    </button>
                                    <button type="button" onClick={() => insertMarkdown('> ', '', 'quote')}
                                        className="px-2 py-1 text-xs bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300">
                                        Quote
                                    </button>
                                </div>

                                <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white dark:bg-gray-900 p-6 flex flex-col' : ''}`}>
                                    {isFullscreen && (
                                        <div className="flex justify-between items-center mb-4 flex-shrink-0">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Content Editor</h3>
                                            <button type="button" onClick={() => setIsFullscreen(false)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg">
                                                <FiX size={20} />
                                            </button>
                                        </div>
                                    )}
                                    <div className={`${showPreview ? 'grid grid-cols-2 gap-4' : 'flex flex-col'} ${isFullscreen ? 'flex-1 min-h-0' : ''}`}>
                                        <div className={`flex flex-col ${!showPreview ? 'w-full' : ''}`}>
                                            {showPreview && <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex-shrink-0">Editor</div>}
                                            <textarea name="content" value={postForm.content} onChange={(e) => setPostForm({...postForm, content: e.target.value})}
                                                className={`w-full px-3 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${showPreview ? 'rounded-lg' : 'rounded-b-lg'} focus:ring-2 focus:ring-primary-500 outline-none font-mono text-sm resize-none ${isFullscreen ? 'flex-1 min-h-0' : 'h-64'}`}
                                                placeholder="Write your content in Markdown format..." required />
                                        </div>
                                        {showPreview && (
                                            <div className="flex flex-col min-h-0">
                                                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex-shrink-0">Full Post Preview</div>
                                                <div className={`border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 overflow-hidden ${isFullscreen ? 'flex-1 min-h-0' : 'h-64'}`}>
                                                    <div className="h-full overflow-y-auto p-6">
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
                                                                            <FiTag size={10} />{tag}
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
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Tags (comma-separated)</label>
                                <input type="text" value={postForm.tags.join(', ')}
                                    onChange={(e) => setPostForm({...postForm, tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)})}
                                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-gray-900 dark:text-white"
                                    placeholder="React, JavaScript, Web Development" />
                            </div>

                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300">
                                    <input type="checkbox" checked={postForm.featured} onChange={(e) => setPostForm({...postForm, featured: e.target.checked})}
                                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                                    Featured Post
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300">
                                    <input type="checkbox" checked={postForm.published} onChange={(e) => setPostForm({...postForm, published: e.target.checked})}
                                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                                    Published
                                </label>
                            </div>

                            <div className="flex items-center gap-4 pt-4">
                                <button type="submit" className="flex items-center gap-2 bg-primary-600 text-white px-6 py-2 rounded-xl hover:bg-primary-700 transition-colors">
                                    <FiSave size={14} />
                                    {editingPost ? 'Update Post' : 'Create Post'}
                                </button>
                                <button type="button" onClick={() => setShowPostModal(false)}
                                    className="px-6 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default BlogAdmin;
