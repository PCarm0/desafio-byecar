const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create({ email, password, name }) {
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const query = `
      INSERT INTO users (email, password, name, created_at) 
      VALUES ($1, $2, $3, NOW()) 
      RETURNING id, email, name, created_at
    `;
    
    const result = await pool.query(query, [email, hashedPassword, name]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL';
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  }

  static async findById(id) {
    const query = 'SELECT id, email, name, created_at FROM users WHERE id = $1 AND deleted_at IS NULL';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async findAll() {
    const query = 'SELECT id, email, name, created_at FROM users WHERE deleted_at IS NULL ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  }

  static async checkPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;