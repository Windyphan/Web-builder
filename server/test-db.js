import { sql } from '@vercel/postgres';
import dotenv from 'dotenv';

dotenv.config();

async function testNeonTables() {
  try {
    console.log('🔄 Checking Neon database tables...');

    // Test basic connection
    const result = await sql`SELECT NOW() as current_time`;
    console.log('✅ Connection successful!');
    console.log('📅 Current database time:', result.rows[0].current_time);

    // Test if tables exist
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;

    console.log('📊 Existing tables:', tables.rows.map(row => row.table_name));

    // Check if blog_posts table exists
    const blogPostsExists = tables.rows.some(row => row.table_name === 'blog_posts');
    console.log('📝 Blog posts table exists:', blogPostsExists);

    if (blogPostsExists) {
      const postCount = await sql`SELECT COUNT(*) as count FROM blog_posts`;
      console.log('📄 Number of blog posts:', postCount.rows[0].count);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testNeonTables();
