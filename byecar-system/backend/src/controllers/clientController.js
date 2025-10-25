const ClientService = require('../services/clientService');

/**
 * Controller para operações com clientes
 */
class ClientController {
  /**
   * Cria novo cliente
   */
  static async createClient(req, res) {
    try {
      const { name, email, phone, address } = req.body;

      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'Nome é obrigatório'
        });
      }

      const client = await ClientService.createClient(
        { name, email, phone, address }, 
        req.user.id
      );

      res.status(201).json({
        success: true,
        message: 'Cliente criado com sucesso',
        data: client
      });

    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Lista todos os clientes
   */
  static async getAllClients(req, res) {
    try {
      const clients = await ClientService.getAllClients();
      
      res.json({
        success: true,
        data: clients
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar clientes'
      });
    }
  }

  /**
   * Busca cliente por ID
   */
  static async getClientById(req, res) {
    try {
      const client = await ClientService.getClientById(parseInt(req.params.id));
      
      res.json({
        success: true,
        data: client
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Atualiza cliente
   */
  static async updateClient(req, res) {
    try {
      const client = await ClientService.updateClient(
        parseInt(req.params.id), 
        req.body
      );
      
      res.json({
        success: true,
        message: 'Cliente atualizado com sucesso',
        data: client
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Deleta cliente
   */
  static async deleteClient(req, res) {
    try {
      await ClientService.deleteClient(parseInt(req.params.id));
      
      res.json({
        success: true,
        message: 'Cliente deletado com sucesso'
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = ClientController;