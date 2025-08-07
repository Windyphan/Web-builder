import { sql } from '@vercel/postgres';
import dotenv from 'dotenv';

dotenv.config();

async function testNeonConnection() {
  try {
    console.log('🔄 Testing Neon database connection...');

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

    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  }
}

testNeonConnection();
