import { sql } from '@vercel/postgres';
import dotenv from 'dotenv';

dotenv.config();

async function setupBlogTables() {
  try {
    console.log('🔄 Setting up blog tables in Neon...');

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
    console.log('✅ blog_posts table created');

    // Create tags table
    await sql`
      CREATE TABLE IF NOT EXISTS tags (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ tags table created');

    // Create blog_post_tags junction table
    await sql`
      CREATE TABLE IF NOT EXISTS blog_post_tags (
        post_id INTEGER REFERENCES blog_posts(id) ON DELETE CASCADE,
        tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
        PRIMARY KEY (post_id, tag_id)
      )
    `;
    console.log('✅ blog_post_tags table created');

    // Insert sample blog post
    const samplePost = await sql`
      INSERT INTO blog_posts (title, slug, excerpt, content, author, featured, published)
      VALUES (
        'Welcome to The Innovation Curve Blog',
        'welcome-to-the-innovation-curve-blog',
        'Discover the latest insights, trends, and innovations in web development and digital transformation.',
        'Welcome to The Innovation Curve Blog! This is your gateway to discovering the latest insights, trends, and innovations in web development and digital transformation. Our team of experts shares valuable knowledge to help you stay ahead in the ever-evolving digital landscape.',
        'The Innovation Curve Team',
        true,
        true
      )
      ON CONFLICT (slug) DO NOTHING
      RETURNING id
    `;

    if (samplePost.rows.length > 0) {
      console.log('✅ Sample blog post created');
    } else {
      console.log('ℹ️ Sample blog post already exists');
    }

    console.log('🎉 All blog tables set up successfully!');

    // Verify tables
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('📊 All tables:', tables.rows.map(row => row.table_name));

    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up tables:', error);
    process.exit(1);
  }
}

setupBlogTables();
