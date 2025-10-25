const { Pool } = require('pg');
require('dotenv').config();

/**
 * Pool de conexões com PostgreSQL
 * @type {Pool}
 */

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

/**
 * Testa a conexão com o banco de dados
 * @returns {Promise<boolean>} True se conectado com sucesso
 */

const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Conectado ao PostgreSQL com sucesso!');
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar com PostgreSQL:', error.message);
    return false;
  }
};


module.exports = { pool, testConnection };
