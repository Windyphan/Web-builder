import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

async function createAdminUser() {
  try {
    console.log('🔄 Creating admin user...');

    const adminEmail = 'info@theinnovationcurve.com';
    const adminPassword = 'TIC2025!@BlogAdmin#SecurePass789$';

    // Check if admin user already exists
    const existingUser = await sql`SELECT id FROM users WHERE email = ${adminEmail}`;

    if (existingUser.rows.length > 0) {
      console.log('ℹ️ Admin user already exists');
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create admin user
    const result = await sql`
      INSERT INTO users (email, password, role) 
      VALUES (${adminEmail}, ${hashedPassword}, 'admin')
      RETURNING id, email, role
    `;

    console.log('✅ Admin user created successfully:', result.rows[0]);
    console.log('\n📋 Admin Login Credentials:');
    console.log('   Email:', adminEmail);
    console.log('   Password:', adminPassword);
    console.log('\n🎯 You can now sign in at /admin/blog');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser();
