import { sql } from '@vercel/postgres';
import dotenv from 'dotenv';

dotenv.config();

async function testCompleteSetup() {
  try {
    console.log('🔄 Testing complete blog setup...');

    // Test database connection
    const result = await sql`SELECT NOW() as current_time`;
    console.log('✅ Database connection successful');

    // Test all tables exist
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    console.log('📊 Database tables:', tables.rows.map(row => row.table_name));

    // Test user exists for login
    const users = await sql`SELECT email, role FROM users`;
    console.log('👤 Admin users:', users.rows);

    // Test blog posts
    const posts = await sql`SELECT id, title, slug, author, published FROM blog_posts`;
    console.log('📝 Blog posts:', posts.rows);

    // Test tags
    const tags = await sql`SELECT name FROM tags`;
    console.log('🏷️ Tags:', tags.rows);

    console.log('\n🎉 Complete setup test successful! Your blog should be working now.');
    console.log('\n📋 Admin Login Credentials:');
    console.log('   Email: info@theinnovationcurve.com');
    console.log('   Password: TIC2025!@BlogAdmin#SecurePass789$');

    process.exit(0);
  } catch (error) {
    console.error('❌ Setup test failed:', error);
    process.exit(1);
  }
}

testCompleteSetup();
