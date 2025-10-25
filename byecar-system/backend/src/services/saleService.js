const Sale = require('../models/Sale');

/**
 * Service para operações com vendas
 * @class
 */
class SaleService {
  /**
   * Cria nova venda no sistema
   * @param {Object} saleData - Dados da venda
   * @param {number} saleData.client_id - ID do cliente associado à venda
   * @param {number} saleData.amount - Valor total da venda
   * @param {string} saleData.sale_date - Data da realização da venda
   * @param {string} [saleData.description] - Descrição ou observações da venda
   * @param {number} userId - ID do usuário criador da venda
   * @returns {Promise<Object>} Venda criada
   * @throws {Error} Erro durante a criação da venda
   */
  static async createSale(saleData, userId) {
    return await Sale.create(saleData, userId);
  }

  /**
   * Lista todas as vendas cadastradas no sistema
   * @returns {Promise<Array>} Lista de vendas
   * @throws {Error} Erro ao buscar vendas
   */
  static async getAllSales() {
    return await Sale.findAll();
  }

  /**
   * Busca venda específica por ID
   * @param {number} id - ID da venda
   * @returns {Promise<Object>} Venda encontrada
   * @throws {Error} Venda não encontrada
   */
  static async getSaleById(id) {
    const sale = await Sale.findById(id);
    
    if (!sale) {
      throw new Error('Venda não encontrada');
    }
    
    return sale;
  }

  /**
   * Atualiza dados de uma venda existente
   * @param {number} id - ID da venda
   * @param {Object} updateData - Dados para atualizar
   * @param {number} [updateData.client_id] - ID do cliente
   * @param {number} [updateData.amount] - Valor da venda
   * @param {string} [updateData.sale_date] - Data da venda
   * @param {string} [updateData.description] - Descrição da venda
   * @returns {Promise<Object>} Venda atualizada
   * @throws {Error} Venda não encontrada
   */
  static async updateSale(id, updateData) {
    const sale = await Sale.update(id, updateData);
    
    if (!sale) {
      throw new Error('Venda não encontrada');
    }
    
    return sale;
  }

  /**
   * Remove venda do sistema
   * @param {number} id - ID da venda
   * @returns {Promise<boolean>} True se deletada com sucesso
   * @throws {Error} Venda não encontrada
   */
  static async deleteSale(id) {
    const success = await Sale.delete(id);
    
    if (!success) {
      throw new Error('Venda não encontrada');
    }
    
    return success;
  }

  /**
   * Busca vendas associadas a um cliente específico
   * @param {number} clientId - ID do cliente
   * @returns {Promise<Array>} Lista de vendas do cliente
   * @throws {Error} Erro ao buscar vendas do cliente
   */
  static async getSalesByClient(clientId) {
    return await Sale.findByClientId(clientId);
  }
}

module.exports = SaleService;
