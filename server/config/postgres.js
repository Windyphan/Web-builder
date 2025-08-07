import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

// Connection configuration for Neon DB optimization
const connectionConfig = {
  // Neon recommends these settings for better performance
  statement_timeout: 300000, // 5 minutes
  idle_in_transaction_session_timeout: 300000
};

// Initialize database schema for PostgreSQL (optimized for Neon DB)
export async function initDatabase() {
  try {
    console.log('🔄 Initializing Neon PostgreSQL database...');

    // Verify connection first
    await testConnection();

    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create blog_posts table
    await sql`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        excerpt TEXT NOT NULL,
        content TEXT NOT NULL,
        author VARCHAR(255) NOT NULL,
        featured BOOLEAN DEFAULT FALSE,
        published BOOLEAN DEFAULT TRUE,
        image_url TEXT,
        meta_description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create tags table
    await sql`
      CREATE TABLE IF NOT EXISTS tags (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create blog_post_tags junction table
    await sql`
      CREATE TABLE IF NOT EXISTS blog_post_tags (
        post_id INTEGER REFERENCES blog_posts(id) ON DELETE CASCADE,
        tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
        PRIMARY KEY (post_id, tag_id)
      )
    `;

    // Check if admin user exists
    const adminEmail = process.env.ADMIN_EMAIL || 'info@theinnovationcurve.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'TIC2025!@BlogAdmin#SecurePass789$';

    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${adminEmail} LIMIT 1
    `;

    if (existingUser.rows.length === 0) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await sql`
        INSERT INTO users (email, password, role) 
        VALUES (${adminEmail}, ${hashedPassword}, 'admin')
      `;
      console.log('✅ Admin user created in persistent database');

      // Insert sample data only if no posts exist
      await insertSampleData();
    } else {
      console.log('✅ Admin user already exists in persistent database');

      // Check if we need sample data
      const postCount = await sql`SELECT COUNT(*) as count FROM blog_posts`;
      if (postCount.rows[0].count == 0) {
        await insertSampleData();
      }
    }

    console.log('✅ Persistent PostgreSQL database initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Error initializing persistent database:', error);
    console.error('Full error details:', error.message, error.stack);
    throw error;
  }
}

// Test database connection
async function testConnection() {
  try {
    await sql`SELECT 1`;
    console.log('✅ Database connection verified');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
}

// Insert sample blog data
async function insertSampleData() {
  try {
    console.log('🔄 Inserting sample blog data...');

    // Insert sample tags first
    const tags = [
      { name: 'React', slug: 'react' },
      { name: 'Node.js', slug: 'nodejs' },
      { name: 'Web Development', slug: 'web-development' },
      { name: 'AI', slug: 'ai' },
      { name: 'Performance', slug: 'performance' },
      { name: 'SEO', slug: 'seo' }
    ];

    for (const tag of tags) {
      await sql`
        INSERT INTO tags (name, slug) 
        VALUES (${tag.name}, ${tag.slug})
        ON CONFLICT (name) DO NOTHING
      `;
    }

    // Insert sample blog posts
    const samplePosts = [
      {
        title: "Building Scalable Web Applications with React and Node.js",
        slug: "building-scalable-web-applications",
        excerpt: "Learn the best practices for creating scalable web applications using modern JavaScript technologies. This comprehensive guide covers everything from project setup to deployment strategies.",
        content: `# Building Scalable Web Applications with React and Node.js

Building scalable web applications requires careful planning and the right technology choices. In this comprehensive guide, we'll explore how to create robust, maintainable applications using React for the frontend and Node.js for the backend.

## Why Choose React and Node.js?

React and Node.js form a powerful combination for several reasons:

- **JavaScript Everywhere**: Use the same language for both frontend and backend
- **Component Reusability**: Share components and utilities across your application
- **Rich Ecosystem**: Leverage thousands of npm packages
- **Performance**: Optimize for both server and client-side rendering

## Setting Up Your Development Environment

Before we dive into building our application, let's set up a proper development environment:

### Frontend Setup with Vite
\`\`\`bash
npm create vite@latest my-app -- --template react
cd my-app
npm install
\`\`\`

### Backend Setup with Express
\`\`\`bash
mkdir server
cd server
npm init -y
npm install express cors helmet morgan
\`\`\`

## Best Practices for Scalability

1. **Modular Architecture**: Keep your code organized and maintainable
2. **State Management**: Choose the right state management solution
3. **Performance Optimization**: Implement lazy loading and code splitting
4. **Testing**: Write comprehensive tests for your application
5. **Deployment**: Use CI/CD pipelines for reliable deployments

Your scalable application is the foundation for long-term success!`,
        author: "The Innovation Curve Team",
        featured: true,
        tags: ['React', 'Node.js', 'Web Development']
      },
      {
        title: "The Future of AI in Web Development",
        slug: "future-of-ai-web-development",
        excerpt: "Exploring how artificial intelligence is transforming the way we build and maintain websites. Discover the latest AI tools and their impact on the development workflow.",
        content: `# The Future of AI in Web Development

Artificial Intelligence is rapidly transforming the web development landscape. From automated code generation to intelligent user interfaces, AI is changing how we build, deploy, and maintain web applications.

## Current AI Applications in Web Development

### Code Generation and Assistance
AI-powered tools are already helping developers:

- **GitHub Copilot**: Suggests code as you type
- **ChatGPT**: Helps debug and explain code
- **Tabnine**: Provides intelligent code completion

### Design and UX
- **Figma AI**: Generates design variations  
- **Midjourney**: Creates unique visual assets
- **Adobe Sensei**: Automates design tasks

## The Road Ahead

The future promises even more exciting developments:

### Automated Testing
AI will revolutionize how we test applications by generating comprehensive test cases automatically.

### Intelligent Performance Optimization  
AI systems will automatically optimize:
- Bundle sizes
- Loading strategies
- Caching mechanisms
- Database queries

## Preparing for the AI-Driven Future

As developers, we should:

1. **Embrace AI Tools**: Learn to work alongside AI assistants
2. **Focus on Architecture**: AI can write code, but humans design systems
3. **Develop Soft Skills**: Communication becomes more valuable
4. **Stay Curious**: The field evolves rapidly

The future of web development is AI-augmented, not AI-replaced!`,
        author: "The Innovation Curve Team",
        featured: false,
        tags: ['AI', 'Web Development']
      },
      {
        title: "Performance Optimization Guide for Modern Websites",
        slug: "performance-optimization-guide",
        excerpt: "A comprehensive guide to optimizing website performance. Learn techniques to improve loading times, user experience, and search engine rankings.",
        content: `# Performance Optimization Guide for Modern Websites

Website performance directly impacts user experience, SEO rankings, and conversion rates. In this guide, we'll explore proven strategies to make your website lightning-fast.

## Why Performance Matters

- **User Experience**: Users expect pages to load in under 3 seconds
- **SEO Impact**: Google uses page speed as a ranking factor
- **Conversion Rates**: Every 100ms delay can reduce conversions by 1%
- **Mobile Users**: Performance is critical on slower connections

## Core Web Vitals

Google's Core Web Vitals focus on three key metrics:

1. **Largest Contentful Paint (LCP)**: Loading performance
2. **First Input Delay (FID)**: Interactivity  
3. **Cumulative Layout Shift (CLS)**: Visual stability

## Optimization Techniques

### Image Optimization
- Use modern formats (WebP, AVIF)
- Implement lazy loading
- Provide responsive images
- Compress images appropriately

### Code Optimization
- Minify CSS and JavaScript
- Remove unused code
- Implement code splitting
- Use tree shaking

### Network Optimization
- Enable compression (Gzip/Brotli)
- Use HTTP/2 or HTTP/3
- Implement proper caching headers
- Minimize HTTP requests

## Tools for Performance Testing

- **Lighthouse**: Built into Chrome DevTools
- **WebPageTest**: Detailed performance analysis
- **GTmetrix**: Comprehensive reports
- **PageSpeed Insights**: Google's recommendations

Start optimizing today for better user experience and business results!`,
        author: "The Innovation Curve Team",
        featured: false,
        tags: ['Performance', 'Web Development', 'SEO']
      }
    ];

    for (const post of samplePosts) {
      // Insert blog post
      const result = await sql`
        INSERT INTO blog_posts (title, slug, excerpt, content, author, featured, published)
        VALUES (${post.title}, ${post.slug}, ${post.excerpt}, ${post.content}, ${post.author}, ${post.featured}, true)
        RETURNING id
      `;

      const postId = result.rows[0].id;

      // Link tags to the post
      for (const tagName of post.tags) {
        const tagResult = await sql`SELECT id FROM tags WHERE name = ${tagName} LIMIT 1`;
        if (tagResult.rows.length > 0) {
          const tagId = tagResult.rows[0].id;
          await sql`
            INSERT INTO blog_post_tags (post_id, tag_id) 
            VALUES (${postId}, ${tagId})
            ON CONFLICT DO NOTHING
          `;
        }
      }
    }

    console.log('✅ Sample blog data inserted into persistent database');
  } catch (error) {
    console.error('❌ Error inserting sample data:', error);
    throw error;
  }
}

// Helper functions for PostgreSQL queries
export async function runQuery(queryText, params = []) {
  try {
    const result = await sql.query(queryText, params);
    return {
      id: result.rows[0]?.id || null,
      changes: result.rowCount
    };
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  }
}

export async function getQuery(queryText, params = []) {
  try {
    const result = await sql.query(queryText, params);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  }
}

export async function allQuery(queryText, params = []) {
  try {
    const result = await sql.query(queryText, params);
    return result.rows;
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  }
}

// Export sql for direct use
export { sql };
