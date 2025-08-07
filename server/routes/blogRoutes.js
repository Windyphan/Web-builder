import express from 'express';
import slugify from 'slugify';
import { sql } from '@vercel/postgres';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { autoSubmitSitemap } from './sitemapRoutes.js';

const router = express.Router();

// Get all published blog posts (public endpoint)
router.get('/posts', async (req, res) => {
  try {
    const { search, tag, featured, limit = 20, offset = 0 } = req.query;

    let baseQuery = `
      SELECT DISTINCT 
        p.id, p.title, p.slug, p.excerpt, p.author, p.featured, 
        p.created_at, p.updated_at, p.image_url,
        STRING_AGG(t.name, ',') as tags
      FROM blog_posts p
      LEFT JOIN blog_post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      WHERE p.published = true
    `;

    const conditions = [];
    const params = [];
    let paramIndex = 1;

    if (search) {
      conditions.push(`(p.title ILIKE $${paramIndex} OR p.excerpt ILIKE $${paramIndex + 1} OR p.content ILIKE $${paramIndex + 2})`);
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      paramIndex += 3;
    }

    if (tag) {
      conditions.push(`t.name = $${paramIndex}`);
      params.push(tag);
      paramIndex++;
    }

    if (featured === 'true') {
      conditions.push('p.featured = true');
    }

    if (conditions.length > 0) {
      baseQuery += ' AND ' + conditions.join(' AND ');
    }

    baseQuery += ` GROUP BY p.id, p.title, p.slug, p.excerpt, p.author, p.featured, p.created_at, p.updated_at, p.image_url 
                   ORDER BY p.created_at DESC 
                   LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;

    params.push(parseInt(limit), parseInt(offset));

    const result = await sql.query(baseQuery, params);
    const posts = result.rows;

    // Calculate read time for each post
    const postsWithReadTime = posts.map(post => ({
      ...post,
      tags: post.tags ? post.tags.split(',') : [],
      readTime: calculateReadTime(post.excerpt),
      created_at: new Date(post.created_at).toISOString(),
      updated_at: new Date(post.updated_at).toISOString(),
    }));

    res.json({
      posts: postsWithReadTime,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: posts.length === parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

// Get single blog post by slug (public endpoint)
router.get('/posts/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const result = await sql`
      SELECT 
        p.id, p.title, p.slug, p.excerpt, p.content, p.author, 
        p.featured, p.published, p.image_url, p.meta_description,
        p.created_at, p.updated_at,
        STRING_AGG(t.name, ',') as tags
      FROM blog_posts p
      LEFT JOIN blog_post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      WHERE p.slug = ${slug} AND p.published = true
      GROUP BY p.id, p.title, p.slug, p.excerpt, p.content, p.author, p.featured, p.published, p.image_url, p.meta_description, p.created_at, p.updated_at
    `;

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    const post = result.rows[0];
    const postWithMetadata = {
      ...post,
      tags: post.tags ? post.tags.split(',') : [],
      readTime: calculateReadTime(post.content),
      created_at: new Date(post.created_at).toISOString(),
      updated_at: new Date(post.updated_at).toISOString(),
    };

    res.json(postWithMetadata);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ error: 'Failed to fetch blog post' });
  }
});

// Get all tags (public endpoint)
router.get('/tags', async (req, res) => {
  try {
    const result = await sql`SELECT name, slug FROM tags ORDER BY name`;
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
});

// Admin endpoints (require authentication)

// Get all posts for admin (including unpublished)
router.get('/admin/posts', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await sql`
      SELECT p.*, STRING_AGG(t.name, ',') as tags
      FROM blog_posts p
      LEFT JOIN blog_post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      GROUP BY p.id, p.title, p.slug, p.excerpt, p.content, p.author, p.featured, p.published, p.image_url, p.meta_description, p.created_at, p.updated_at
      ORDER BY p.created_at DESC
    `;

    const postsWithMetadata = result.rows.map(post => ({
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
    let existingPost = await sql`SELECT id FROM blog_posts WHERE slug = ${slug}`;
    while (existingPost.rows.length > 0) {
      slug = `${baseSlug}-${counter}`;
      counter++;
      existingPost = await sql`SELECT id FROM blog_posts WHERE slug = ${slug}`;
    }

    // Insert blog post
    const result = await sql`
      INSERT INTO blog_posts (title, slug, excerpt, content, author, featured, published, image_url, meta_description)
      VALUES (${title}, ${slug}, ${excerpt}, ${content}, ${author}, ${featured}, ${published}, ${image_url}, ${meta_description})
      RETURNING id
    `;

    const postId = result.rows[0].id;

    // Handle tags
    for (const tagName of tags) {
      if (tagName.trim()) {
        const tagSlug = slugify(tagName, { lower: true, strict: true });

        // Insert tag if it doesn't exist
        await sql`
          INSERT INTO tags (name, slug) 
          VALUES (${tagName.trim()}, ${tagSlug})
          ON CONFLICT (name) DO NOTHING
        `;

        // Get tag ID and link to post
        const tagResult = await sql`SELECT id FROM tags WHERE name = ${tagName.trim()}`;
        if (tagResult.rows.length > 0) {
          await sql`
            INSERT INTO blog_post_tags (post_id, tag_id) 
            VALUES (${postId}, ${tagResult.rows[0].id})
          `;
        }
      }
    }

    res.status(201).json({ id: postId, slug, message: 'Post created successfully' });

    // Auto-submit sitemap to search engines when publishing
    if (published) {
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
    const existingPostResult = await sql`SELECT * FROM blog_posts WHERE id = ${id}`;
    if (existingPostResult.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    const existingPost = existingPostResult.rows[0];

    // Generate new slug if title changed
    let slug = existingPost.slug;
    if (title !== existingPost.title) {
      const baseSlug = slugify(title, { lower: true, strict: true });
      slug = baseSlug;
      let counter = 1;

      let duplicatePost = await sql`SELECT id FROM blog_posts WHERE slug = ${slug} AND id != ${id}`;
      while (duplicatePost.rows.length > 0) {
        slug = `${baseSlug}-${counter}`;
        counter++;
        duplicatePost = await sql`SELECT id FROM blog_posts WHERE slug = ${slug} AND id != ${id}`;
      }
    }

    // Update blog post
    await sql`
      UPDATE blog_posts 
      SET title = ${title}, slug = ${slug}, excerpt = ${excerpt}, content = ${content}, 
          author = ${author}, featured = ${featured}, published = ${published}, 
          image_url = ${image_url}, meta_description = ${meta_description}, 
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `;

    // Remove existing tag associations
    await sql`DELETE FROM blog_post_tags WHERE post_id = ${id}`;

    // Add new tag associations
    for (const tagName of tags) {
      if (tagName.trim()) {
        const tagSlug = slugify(tagName, { lower: true, strict: true });

        // Insert tag if it doesn't exist
        await sql`
          INSERT INTO tags (name, slug) 
          VALUES (${tagName.trim()}, ${tagSlug})
          ON CONFLICT (name) DO NOTHING
        `;

        // Get tag ID and link to post
        const tagResult = await sql`SELECT id FROM tags WHERE name = ${tagName.trim()}`;
        if (tagResult.rows.length > 0) {
          await sql`
            INSERT INTO blog_post_tags (post_id, tag_id) 
            VALUES (${id}, ${tagResult.rows[0].id})
          `;
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

    const result = await sql`DELETE FROM blog_posts WHERE id = ${id}`;

    if (result.rowCount === 0) {
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

    const result = await sql`
      SELECT p.*, STRING_AGG(t.name, ',') as tags
      FROM blog_posts p
      LEFT JOIN blog_post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      WHERE p.id = ${id}
      GROUP BY p.id, p.title, p.slug, p.excerpt, p.content, p.author, p.featured, p.published, p.image_url, p.meta_description, p.created_at, p.updated_at
    `;

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const post = result.rows[0];
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
