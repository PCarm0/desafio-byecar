const { pool } = require('../config/database');

/**
 * Model para operações com clientes
 */
class Client {
  /**
   * Cria novo cliente
   * @param {Object} clientData - Dados do cliente
   * @param {number} userId - ID do usuário criador
   * @returns {Promise<Object>} Cliente criado
   */
  static async create(clientData, userId) {
    const { name, email, phone, address } = clientData;
    
    const query = `
      INSERT INTO clients (name, email, phone, address, created_by, created_at) 
      VALUES ($1, $2, $3, $4, $5, NOW()) 
      RETURNING *
    `;
    
    const result = await pool.query(query, [name, email, phone, address, userId]);
    return result.rows[0];
  }

  /**
   * Busca cliente por ID
   * @param {number} id - ID do cliente
   * @returns {Promise<Object|null>} Cliente encontrado ou null
   */
  static async findById(id) {
    const query = `
      SELECT c.*, u.name as created_by_name 
      FROM clients c 
      LEFT JOIN users u ON c.created_by = u.id 
      WHERE c.id = $1 AND c.deleted_at IS NULL
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Lista todos os clientes
   * @returns {Promise<Array>} Lista de clientes
   */
  static async findAll() {
    const query = `
      SELECT c.*, u.name as created_by_name 
      FROM clients c 
      LEFT JOIN users u ON c.created_by = u.id 
      WHERE c.deleted_at IS NULL 
      ORDER BY c.created_at DESC
    `;
    
    const result = await pool.query(query);
    return result.rows;
  }

  /**
   * Atualiza cliente
   * @param {number} id - ID do cliente
   * @param {Object} updateData - Dados para atualizar
   * @returns {Promise<Object>} Cliente atualizado
   */
  static async update(id, updateData) {
    const { name, email, phone, address } = updateData;
    
    const query = `
      UPDATE clients 
      SET name = $1, email = $2, phone = $3, address = $4, updated_at = NOW() 
      WHERE id = $5 AND deleted_at IS NULL
      RETURNING *
    `;
    
    const result = await pool.query(query, [name, email, phone, address, id]);
    return result.rows[0];
  }

  /**
   * Deleta cliente (soft delete)
   * @param {number} id - ID do cliente
   * @returns {Promise<boolean>} True se deletado com sucesso
   */
  static async delete(id) {
    const query = 'UPDATE clients SET deleted_at = NOW() WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rowCount > 0;
  }

  /**
   * Busca clientes criados por um usuário
   * @param {number} userId - ID do usuário
   * @returns {Promise<Array>} Lista de clientes
   */
  static async findByUserId(userId) {
    const query = `
      SELECT * FROM clients 
      WHERE created_by = $1 AND deleted_at IS NULL 
      ORDER BY created_at DESC
    `;
    
    const result = await pool.query(query, [userId]);
    return result.rows;
  }
}

module.exports = Client;