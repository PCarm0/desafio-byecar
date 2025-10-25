const SaleService = require('../services/saleService');

/**
 * Controller para operações com vendas
 */
class SaleController {
  /**
   * Cria nova venda
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
   * Lista todas as vendas
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
   * Busca venda por ID
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
   * Atualiza venda
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
   * Deleta venda
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
   * Busca vendas por cliente
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