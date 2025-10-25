const ClientService = require('../services/clientService');

/**
 * Controller para operações com clientes
 * @class
 */
class ClientController {
  /**
   * Cria novo cliente no sistema
   * @param {Object} req - Objeto de requisição do Express
   * @param {Object} req.body - Corpo da requisição
   * @param {string} req.body.name - Nome do cliente (obrigatório)
   * @param {string} [req.body.email] - Email do cliente
   * @param {string} [req.body.phone] - Telefone do cliente
   * @param {string} [req.body.address] - Endereço do cliente
   * @param {Object} req.user - Usuário autenticado
   * @param {number} req.user.id - ID do usuário criador
   * @param {Object} res - Objeto de resposta do Express
   * @returns {Promise<Object>} JSON com dados do cliente criado
   * @throws {Error} 400 - Nome é obrigatório
   * @throws {Error} 400 - Erro na criação do cliente
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
   * Lista todos os clientes cadastrados
   * @param {Object} req - Objeto de requisição do Express
   * @param {Object} res - Objeto de resposta do Express
   * @returns {Promise<Object>} JSON com array de clientes
   * @throws {Error} 500 - Erro interno do servidor
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
   * Busca cliente específico por ID
   * @param {Object} req - Objeto de requisição do Express
   * @param {Object} req.params - Parâmetros da URL
   * @param {string} req.params.id - ID do cliente
   * @param {Object} res - Objeto de resposta do Express
   * @returns {Promise<Object>} JSON com dados do cliente
   * @throws {Error} 404 - Cliente não encontrado
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
   * Atualiza dados de um cliente existente
   * @param {Object} req - Objeto de requisição do Express
   * @param {Object} req.params - Parâmetros da URL
   * @param {string} req.params.id - ID do cliente a ser atualizado
   * @param {Object} req.body - Corpo da requisição com dados para atualização
   * @param {string} [req.body.name] - Nome do cliente
   * @param {string} [req.body.email] - Email do cliente
   * @param {string} [req.body.phone] - Telefone do cliente
   * @param {string} [req.body.address] - Endereço do cliente
   * @param {Object} res - Objeto de resposta do Express
   * @returns {Promise<Object>} JSON com dados do cliente atualizado
   * @throws {Error} 404 - Cliente não encontrado
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
   * Remove cliente do sistema
   * @param {Object} req - Objeto de requisição do Express
   * @param {Object} req.params - Parâmetros da URL
   * @param {string} req.params.id - ID do cliente a ser removido
   * @param {Object} res - Objeto de resposta do Express
   * @returns {Promise<Object>} JSON de confirmação
   * @throws {Error} 404 - Cliente não encontrado
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
