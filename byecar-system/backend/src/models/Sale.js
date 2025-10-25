const { pool } = require('../config/database');

/**
 * Model para operações com vendas
 */
class Sale {
  /**
   * Cria nova venda
   * @param {Object} saleData - Dados da venda
   * @param {number} userId - ID do usuário criador
   * @returns {Promise<Object>} Venda criada
   */
  static async create(saleData, userId) {
    const { client_id, amount, sale_date, description } = saleData;
    
    const query = `
      INSERT INTO sales (client_id, amount, sale_date, description, created_by, created_at) 
      VALUES ($1, $2, $3, $4, $5, NOW()) 
      RETURNING *
    `;
    
    const result = await pool.query(query, [client_id, amount, sale_date, description, userId]);
    return result.rows[0];
  }

  /**
   * Busca venda por ID
   * @param {number} id - ID da venda
   * @returns {Promise<Object|null>} Venda encontrada ou null
   */
  static async findById(id) {
    const query = `
      SELECT s.*, c.name as client_name, u.name as created_by_name 
      FROM sales s 
      LEFT JOIN clients c ON s.client_id = c.id 
      LEFT JOIN users u ON s.created_by = u.id 
      WHERE s.id = $1 AND s.deleted_at IS NULL
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Lista todas as vendas
   * @returns {Promise<Array>} Lista de vendas
   */
  static async findAll() {
    const query = `
      SELECT s.*, c.name as client_name, u.name as created_by_name 
      FROM sales s 
      LEFT JOIN clients c ON s.client_id = c.id 
      LEFT JOIN users u ON s.created_by = u.id 
      WHERE s.deleted_at IS NULL 
      ORDER BY s.created_at DESC
    `;
    
    const result = await pool.query(query);
    return result.rows;
  }

  /**
   * Atualiza venda
   * @param {number} id - ID da venda
   * @param {Object} updateData - Dados para atualizar
   * @returns {Promise<Object>} Venda atualizada
   */
  static async update(id, updateData) {
    const { client_id, amount, sale_date, description } = updateData;
    
    const query = `
      UPDATE sales 
      SET client_id = $1, amount = $2, sale_date = $3, description = $4, updated_at = NOW() 
      WHERE id = $5 AND deleted_at IS NULL
      RETURNING *
    `;
    
    const result = await pool.query(query, [client_id, amount, sale_date, description, id]);
    return result.rows[0];
  }

  /**
   * Deleta venda (soft delete)
   * @param {number} id - ID da venda
   * @returns {Promise<boolean>} True se deletada com sucesso
   */
  static async delete(id) {
    const query = 'UPDATE sales SET deleted_at = NOW() WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rowCount > 0;
  }

  /**
   * Busca vendas por cliente
   * @param {number} clientId - ID do cliente
   * @returns {Promise<Array>} Lista de vendas
   */
  static async findByClientId(clientId) {
    const query = `
      SELECT s.*, c.name as client_name 
      FROM sales s 
      LEFT JOIN clients c ON s.client_id = c.id 
      WHERE s.client_id = $1 AND s.deleted_at IS NULL 
      ORDER BY s.created_at DESC
    `;
    
    const result = await pool.query(query, [clientId]);
    return result.rows;
  }
}

module.exports = Sale;