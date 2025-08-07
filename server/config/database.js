import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '..', 'database', 'blog.db');

// Create database connection
export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('✅ Connected to SQLite database');
  }
});

// Initialize database schema
export async function initDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(async () => {
      // Create users table (for admin authentication)
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT DEFAULT 'admin',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create blog_posts table
      db.run(`
        CREATE TABLE IF NOT EXISTS blog_posts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          slug TEXT UNIQUE NOT NULL,
          excerpt TEXT NOT NULL,
          content TEXT NOT NULL,
          author TEXT NOT NULL,
          featured BOOLEAN DEFAULT FALSE,
          published BOOLEAN DEFAULT TRUE,
          image_url TEXT,
          meta_description TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create tags table
      db.run(`
        CREATE TABLE IF NOT EXISTS tags (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT UNIQUE NOT NULL,
          slug TEXT UNIQUE NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create blog_post_tags junction table
      db.run(`
        CREATE TABLE IF NOT EXISTS blog_post_tags (
          post_id INTEGER,
          tag_id INTEGER,
          PRIMARY KEY (post_id, tag_id),
          FOREIGN KEY (post_id) REFERENCES blog_posts (id) ON DELETE CASCADE,
          FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE
        )
      `);

      // Create admin user if it doesn't exist
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@theinnovationcurve.com';
      const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

      db.get('SELECT id FROM users WHERE email = ?', [adminEmail], async (err, row) => {
        if (err) {
          console.error('Error checking for admin user:', err);
          reject(err);
          return;
        }

        if (!row) {
          try {
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            db.run(
              'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
              [adminEmail, hashedPassword, 'admin'],
              function(err) {
                if (err) {
                  console.error('Error creating admin user:', err);
                  reject(err);
                } else {
                  console.log('✅ Admin user created');
                  insertSampleData();
                }
              }
            );
          } catch (hashError) {
            console.error('Error hashing password:', hashError);
            reject(hashError);
          }
        } else {
          console.log('✅ Admin user already exists');
          insertSampleData();
        }
      });

      // Insert sample blog data
      function insertSampleData() {
        // Check if we already have blog posts
        db.get('SELECT COUNT(*) as count FROM blog_posts', (err, row) => {
          if (err) {
            console.error('Error checking blog posts:', err);
            reject(err);
            return;
          }

          if (row.count === 0) {
            // Insert sample tags
            const tags = [
              { name: 'React', slug: 'react' },
              { name: 'Node.js', slug: 'nodejs' },
              { name: 'Web Development', slug: 'web-development' },
              { name: 'AI', slug: 'ai' },
              { name: 'Performance', slug: 'performance' },
              { name: 'SEO', slug: 'seo' }
            ];

            tags.forEach(tag => {
              db.run('INSERT OR IGNORE INTO tags (name, slug) VALUES (?, ?)', [tag.name, tag.slug]);
            });

            // Insert sample blog posts
            const samplePosts = [
              {
                title: "Building Scalable Web Applications with React and Node.js",
                slug: "building-scalable-web-applications",
                excerpt: "Learn the best practices for creating scalable web applications using modern JavaScript technologies...",
                content: `# Building Scalable Web Applications with React and Node.js

Building scalable web applications requires careful planning and the right technology choices. In this comprehensive guide, we'll explore how to create robust, maintainable applications using React for the frontend and Node.js for the backend.

## Why Choose React and Node.js?

React and Node.js form a powerful combination for several reasons:

- **JavaScript Everywhere**: Use the same language for both frontend and backend
- **Component Reusability**: Share components and utilities across your application
- **Rich Ecosystem**: Leverage thousands of npm packages
- **Performance**: Optimize for both server and client-side rendering

## Setting Up Your Development Environment

Before we dive into building our application, let's set up a proper development environment...`,
                author: "The Innovation Curve Team",
                featured: true,
                tags: ['React', 'Node.js', 'Web Development']
              },
              {
                title: "The Future of AI in Web Development",
                slug: "future-of-ai-web-development",
                excerpt: "Exploring how artificial intelligence is transforming the way we build and maintain websites...",
                content: `# The Future of AI in Web Development

Artificial Intelligence is rapidly transforming the web development landscape. From automated code generation to intelligent user interfaces, AI is changing how we build, deploy, and maintain web applications.

## Current AI Applications in Web Development

### Code Generation and Assistance

AI-powered tools are already helping developers:

- **GitHub Copilot**: Suggests code as you type
- **ChatGPT**: Helps debug and explain code
- **Tabnine**: Provides intelligent code completion...`,
                author: "The Innovation Curve Team",
                featured: false,
                tags: ['AI', 'Web Development']
              }
            ];

            samplePosts.forEach(post => {
              db.run(
                `INSERT INTO blog_posts (title, slug, excerpt, content, author, featured, published) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [post.title, post.slug, post.excerpt, post.content, post.author, post.featured, true],
                function(err) {
                  if (err) {
                    console.error('Error inserting sample post:', err);
                  } else {
                    // Link tags to the post
                    const postId = this.lastID;
                    post.tags.forEach(tagName => {
                      db.get('SELECT id FROM tags WHERE name = ?', [tagName], (err, tag) => {
                        if (!err && tag) {
                          db.run('INSERT OR IGNORE INTO blog_post_tags (post_id, tag_id) VALUES (?, ?)', [postId, tag.id]);
                        }
                      });
                    });
                  }
                }
              );
            });

            console.log('✅ Sample blog data inserted');
          }

          resolve();
        });
      }
    });
  });
}

// Helper function to run queries
export function runQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

// Helper function to get single row
export function getQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

// Helper function to get all rows
export function allQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}
