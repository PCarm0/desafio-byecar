const SaleService = require('../services/saleService');

/**
 * Controller para operações com vendas
 * @class
 */
class SaleController {
  /**
   * Cria nova venda no sistema
   * @param {Object} req - Objeto de requisição do Express
   * @param {Object} req.body - Corpo da requisição
   * @param {number} req.body.client_id - ID do cliente (obrigatório)
   * @param {number} req.body.amount - Valor da venda (obrigatório)
   * @param {string} req.body.sale_date - Data da venda (obrigatório)
   * @param {string} [req.body.description] - Descrição da venda
   * @param {Object} req.user - Usuário autenticado
   * @param {number} req.user.id - ID do usuário criador
   * @param {Object} res - Objeto de resposta do Express
   * @returns {Promise<Object>} JSON com dados da venda criada
   * @throws {Error} 400 - Campos obrigatórios faltando
   * @throws {Error} 400 - Erro na criação da venda
   */
  static async createSale(req, res) {
    try {
      const { client_id, amount, sale_date, description } = req.body;

      if (!client_id || !amount || !sale_date) {
        return res.status(400).json({
          success: false,
          message: 'client_id, amount e sale_date são obrigatórios'
        });
      }

      const sale = await SaleService.createSale(
        { client_id, amount, sale_date, description }, 
        req.user.id
      );

      res.status(201).json({
        success: true,
        message: 'Venda criada com sucesso',
        data: sale
      });

    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Lista todas as vendas cadastradas
   * @param {Object} req - Objeto de requisição do Express
   * @param {Object} res - Objeto de resposta do Express
   * @returns {Promise<Object>} JSON com array de vendas
   * @throws {Error} 500 - Erro interno do servidor
   */
  static async getAllSales(req, res) {
    try {
      const sales = await SaleService.getAllSales();
      
      res.json({
        success: true,
        data: sales
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar vendas'
      });
    }
  }

  /**
   * Busca venda específica por ID
   * @param {Object} req - Objeto de requisição do Express
   * @param {Object} req.params - Parâmetros da URL
   * @param {string} req.params.id - ID da venda
   * @param {Object} res - Objeto de resposta do Express
   * @returns {Promise<Object>} JSON com dados da venda
   * @throws {Error} 404 - Venda não encontrada
   */
  static async getSaleById(req, res) {
    try {
      const sale = await SaleService.getSaleById(parseInt(req.params.id));
      
      res.json({
        success: true,
        data: sale
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Atualiza dados de uma venda existente
   * @param {Object} req - Objeto de requisição do Express
   * @param {Object} req.params - Parâmetros da URL
   * @param {string} req.params.id - ID da venda a ser atualizada
   * @param {Object} req.body - Corpo da requisição com dados para atualização
   * @param {number} [req.body.client_id] - ID do cliente
   * @param {number} [req.body.amount] - Valor da venda
   * @param {string} [req.body.sale_date] - Data da venda
   * @param {string} [req.body.description] - Descrição da venda
   * @param {Object} res - Objeto de resposta do Express
   * @returns {Promise<Object>} JSON com dados da venda atualizada
   * @throws {Error} 404 - Venda não encontrada
   */
  static async updateSale(req, res) {
    try {
      const sale = await SaleService.updateSale(
        parseInt(req.params.id), 
        req.body
      );
      
      res.json({
        success: true,
        message: 'Venda atualizada com sucesso',
        data: sale
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Remove venda do sistema
   * @param {Object} req - Objeto de requisição do Express
   * @param {Object} req.params - Parâmetros da URL
   * @param {string} req.params.id - ID da venda a ser removida
   * @param {Object} res - Objeto de resposta do Express
   * @returns {Promise<Object>} JSON de confirmação
   * @throws {Error} 404 - Venda não encontrada
   */
  static async deleteSale(req, res) {
    try {
      await SaleService.deleteSale(parseInt(req.params.id));
      
      res.json({
        success: true,
        message: 'Venda deletada com sucesso'
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Busca vendas associadas a um cliente específico
   * @param {Object} req - Objeto de requisição do Express
   * @param {Object} req.params - Parâmetros da URL
   * @param {string} req.params.clientId - ID do cliente
   * @param {Object} res - Objeto de resposta do Express
   * @returns {Promise<Object>} JSON com array de vendas do cliente
   * @throws {Error} 500 - Erro ao buscar vendas do cliente
   */
  static async getSalesByClient(req, res) {
    try {
      const sales = await SaleService.getSalesByClient(parseInt(req.params.clientId));
      
      res.json({
        success: true,
        data: sales
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar vendas do cliente'
      });
    }
  }
}

module.exports = SaleController;
