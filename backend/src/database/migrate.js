require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = require('../config/database');
const bcrypt = require('bcryptjs');

async function migrate() {
  try {
    console.log('🔄 Running database migrations...');

    const initSQL = fs.readFileSync(
      path.join(__dirname, '../../database/init.sql'),
      'utf8'
    );

    await pool.query(initSQL);

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@artisan.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await pool.query(
      `INSERT INTO users (email, password_hash, company_name, is_admin)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO UPDATE SET password_hash = $2`,
      [adminEmail, hashedPassword, 'Admin', true]
    );

    console.log('✅ Database migrations completed successfully');
    console.log(`👤 Admin user: ${adminEmail}`);
    console.log(`🔑 Admin password: ${adminPassword}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
