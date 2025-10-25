const Sale = require('../models/Sale');

/**
 * Service para operações com vendas
 */
class SaleService {
  /**
   * Cria nova venda
   * @param {Object} saleData - Dados da venda
   * @param {number} userId - ID do usuário criador
   * @returns {Promise<Object>} Venda criada
   */
  static async createSale(saleData, userId) {
    return await Sale.create(saleData, userId);
  }

  /**
   * Lista todas as vendas
   * @returns {Promise<Array>} Lista de vendas
   */
  static async getAllSales() {
    return await Sale.findAll();
  }

  /**
   * Busca venda por ID
   * @param {number} id - ID da venda
   * @returns {Promise<Object>} Venda encontrada
   * @throws {Error} Se venda não for encontrada
   */
  static async getSaleById(id) {
    const sale = await Sale.findById(id);
    
    if (!sale) {
      throw new Error('Venda não encontrada');
    }
    
    return sale;
  }

  /**
   * Atualiza venda
   * @param {number} id - ID da venda
   * @param {Object} updateData - Dados para atualizar
   * @returns {Promise<Object>} Venda atualizada
   * @throws {Error} Se venda não for encontrada
   */
  static async updateSale(id, updateData) {
    const sale = await Sale.update(id, updateData);
    
    if (!sale) {
      throw new Error('Venda não encontrada');
    }
    
    return sale;
  }

  /**
   * Deleta venda
   * @param {number} id - ID da venda
   * @returns {Promise<boolean>} True se deletada com sucesso
   * @throws {Error} Se venda não for encontrada
   */
  static async deleteSale(id) {
    const success = await Sale.delete(id);
    
    if (!success) {
      throw new Error('Venda não encontrada');
    }
    
    return success;
  }

  /**
   * Busca vendas por cliente
   * @param {number} clientId - ID do cliente
   * @returns {Promise<Array>} Lista de vendas
   */
  static async getSalesByClient(clientId) {
    return await Sale.findByClientId(clientId);
  }
}

module.exports = SaleService;