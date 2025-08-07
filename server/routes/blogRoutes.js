import express from 'express';
import slugify from 'slugify';
import { runQuery, getQuery, allQuery } from '../config/database.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { autoSubmitSitemap } from './sitemapRoutes.js';

const router = express.Router();

// Get all published blog posts (public endpoint)
router.get('/posts', async (req, res) => {
  try {
    const { search, tag, featured, limit = 20, offset = 0 } = req.query;

    let sql = `
      SELECT DISTINCT 
        p.id, p.title, p.slug, p.excerpt, p.author, p.featured, 
        p.created_at, p.updated_at, p.image_url,
        GROUP_CONCAT(t.name) as tags
      FROM blog_posts p
      LEFT JOIN blog_post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      WHERE p.published = 1
    `;

    const params = [];

    if (search) {
      sql += ` AND (p.title LIKE ? OR p.excerpt LIKE ? OR p.content LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (tag) {
      sql += ` AND t.name = ?`;
      params.push(tag);
    }

    if (featured === 'true') {
      sql += ` AND p.featured = 1`;
    }

    sql += ` GROUP BY p.id ORDER BY p.created_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    const posts = await allQuery(sql, params);

    // Calculate read time for each post
    const postsWithReadTime = posts.map(post => ({
      ...post,
      tags: post.tags ? post.tags.split(',') : [],
      readTime: calculateReadTime(post.excerpt),
      created_at: new Date(post.created_at).toISOString(),
      updated_at: new Date(post.updated_at).toISOString()
    }));

    res.json(postsWithReadTime);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Get single blog post by slug (public endpoint)
router.get('/posts/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const post = await getQuery(`
      SELECT p.*, GROUP_CONCAT(t.name) as tags
      FROM blog_posts p
      LEFT JOIN blog_post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      WHERE p.slug = ? AND p.published = 1
      GROUP BY p.id
    `, [slug]);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const postWithMetadata = {
      ...post,
      tags: post.tags ? post.tags.split(',') : [],
      readTime: calculateReadTime(post.content),
      created_at: new Date(post.created_at).toISOString(),
      updated_at: new Date(post.updated_at).toISOString()
    };

    res.json(postWithMetadata);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// Get all tags (public endpoint)
router.get('/tags', async (req, res) => {
  try {
    const tags = await allQuery('SELECT name, slug FROM tags ORDER BY name');
    res.json(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
});

// Admin endpoints (require authentication)

// Get all posts for admin (including unpublished)
router.get('/admin/posts', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const posts = await allQuery(`
      SELECT p.*, GROUP_CONCAT(t.name) as tags
      FROM blog_posts p
      LEFT JOIN blog_post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `);

    const postsWithMetadata = posts.map(post => ({
      ...post,
      tags: post.tags ? post.tags.split(',') : [],
      created_at: new Date(post.created_at).toISOString(),
      updated_at: new Date(post.updated_at).toISOString()
    }));

    res.json(postsWithMetadata);
  } catch (error) {
    console.error('Error fetching admin posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Create new blog post
router.post('/admin/posts', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      title,
      excerpt,
      content,
      author,
      featured = false,
      published = true,
      tags = [],
      image_url = null,
      meta_description = null
    } = req.body;

    if (!title || !excerpt || !content || !author) {
      return res.status(400).json({ error: 'Title, excerpt, content, and author are required' });
    }

    // Generate slug
    const baseSlug = slugify(title, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    // Ensure unique slug
    while (await getQuery('SELECT id FROM blog_posts WHERE slug = ?', [slug])) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Insert blog post
    const result = await runQuery(`
      INSERT INTO blog_posts (title, slug, excerpt, content, author, featured, published, image_url, meta_description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [title, slug, excerpt, content, author, featured, published, image_url, meta_description]);

    const postId = result.id;

    // Handle tags
    for (const tagName of tags) {
      if (tagName.trim()) {
        const tagSlug = slugify(tagName, { lower: true, strict: true });

        // Insert tag if it doesn't exist
        await runQuery('INSERT OR IGNORE INTO tags (name, slug) VALUES (?, ?)', [tagName.trim(), tagSlug]);

        // Get tag ID and link to post
        const tag = await getQuery('SELECT id FROM tags WHERE name = ?', [tagName.trim()]);
        if (tag) {
          await runQuery('INSERT INTO blog_post_tags (post_id, tag_id) VALUES (?, ?)', [postId, tag.id]);
        }
      }
    }

    res.status(201).json({ id: postId, slug, message: 'Post created successfully' });

    // Auto-submit sitemap to search engines when publishing
    if (published) {
      // Run sitemap submission in background (don't block response)
      setImmediate(async () => {
        try {
          console.log(`🔄 Auto-submitting sitemap for new post: ${title}`);
          const success = await autoSubmitSitemap(2);
          if (success) {
            console.log(`✅ Sitemap successfully submitted for post: ${slug}`);
          } else {
            console.log(`⚠️ Sitemap submission failed for post: ${slug}`);
          }
        } catch (error) {
          console.error('Background sitemap submission error:', error);
        }
      });
    }
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Update blog post
router.put('/admin/posts/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      excerpt,
      content,
      author,
      featured = false,
      published = true,
      tags = [],
      image_url,
      meta_description
    } = req.body;

    if (!title || !excerpt || !content || !author) {
      return res.status(400).json({ error: 'Title, excerpt, content, and author are required' });
    }

    // Check if post exists
    const existingPost = await getQuery('SELECT * FROM blog_posts WHERE id = ?', [id]);
    if (!existingPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Generate new slug if title changed
    let slug = existingPost.slug;
    if (title !== existingPost.title) {
      const baseSlug = slugify(title, { lower: true, strict: true });
      slug = baseSlug;
      let counter = 1;

      while (await getQuery('SELECT id FROM blog_posts WHERE slug = ? AND id != ?', [slug, id])) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    // Update blog post
    await runQuery(`
      UPDATE blog_posts 
      SET title = ?, slug = ?, excerpt = ?, content = ?, author = ?, featured = ?, 
          published = ?, image_url = ?, meta_description = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [title, slug, excerpt, content, author, featured, published, image_url, meta_description, id]);

    // Remove existing tag associations
    await runQuery('DELETE FROM blog_post_tags WHERE post_id = ?', [id]);

    // Add new tag associations
    for (const tagName of tags) {
      if (tagName.trim()) {
        const tagSlug = slugify(tagName, { lower: true, strict: true });

        // Insert tag if it doesn't exist
        await runQuery('INSERT OR IGNORE INTO tags (name, slug) VALUES (?, ?)', [tagName.trim(), tagSlug]);

        // Get tag ID and link to post
        const tag = await getQuery('SELECT id FROM tags WHERE name = ?', [tagName.trim()]);
        if (tag) {
          await runQuery('INSERT INTO blog_post_tags (post_id, tag_id) VALUES (?, ?)', [id, tag.id]);
        }
      }
    }

    res.json({ message: 'Post updated successfully', slug });

    // Auto-submit sitemap when publishing or updating published posts
    if (published) {
      setImmediate(async () => {
        try {
          console.log(`🔄 Auto-submitting sitemap for updated post: ${title}`);
          await autoSubmitSitemap(2);
        } catch (error) {
          console.error('Background sitemap submission error:', error);
        }
      });
    }
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// Delete blog post
router.delete('/admin/posts/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await runQuery('DELETE FROM blog_posts WHERE id = ?', [id]);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json({ message: 'Post deleted successfully' });

    // Auto-submit sitemap after deleting posts
    setImmediate(async () => {
      try {
        console.log(`🔄 Auto-submitting sitemap after post deletion`);
        await autoSubmitSitemap(2);
      } catch (error) {
        console.error('Background sitemap submission error:', error);
      }
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// Get single post for admin (including unpublished)
router.get('/admin/posts/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const post = await getQuery(`
      SELECT p.*, GROUP_CONCAT(t.name) as tags
      FROM blog_posts p
      LEFT JOIN blog_post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      WHERE p.id = ?
      GROUP BY p.id
    `, [id]);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const postWithMetadata = {
      ...post,
      tags: post.tags ? post.tags.split(',') : [],
      created_at: new Date(post.created_at).toISOString(),
      updated_at: new Date(post.updated_at).toISOString()
    };

    res.json(postWithMetadata);
  } catch (error) {
    console.error('Error fetching admin post:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// Helper function to calculate reading time
function calculateReadTime(text) {
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return `${readTime} min read`;
}

export default router;
