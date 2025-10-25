const Client = require('../models/Client');

/**
 * Service para operações com clientes
 * @class
 */
class ClientService {
  /**
   * Cria novo cliente no sistema
   * @param {Object} clientData - Dados do cliente
   * @param {string} clientData.name - Nome do cliente
   * @param {string} [clientData.email] - Email do cliente
   * @param {string} [clientData.phone] - Telefone do cliente
   * @param {string} [clientData.address] - Endereço do cliente
   * @param {number} userId - ID do usuário criador
   * @returns {Promise<Object>} Cliente criado
   * @throws {Error} Erro durante a criação do cliente
   */
  static async createClient(clientData, userId) {
    return await Client.create(clientData, userId);
  }

  /**
   * Lista todos os clientes cadastrados
   * @returns {Promise<Array>} Lista de clientes
   * @throws {Error} Erro ao buscar clientes
   */
  static async getAllClients() {
    return await Client.findAll();
  }

  /**
   * Busca cliente por ID
   * @param {number} id - ID do cliente
   * @returns {Promise<Object>} Cliente encontrado
   * @throws {Error} Cliente não encontrado
   */
  static async getClientById(id) {
    const client = await Client.findById(id);
    
    if (!client) {
      throw new Error('Cliente não encontrado');
    }
    
    return client;
  }

  /**
   * Atualiza dados de um cliente existente
   * @param {number} id - ID do cliente
   * @param {Object} updateData - Dados para atualizar
   * @param {string} [updateData.name] - Nome do cliente
   * @param {string} [updateData.email] - Email do cliente
   * @param {string} [updateData.phone] - Telefone do cliente
   * @param {string} [updateData.address] - Endereço do cliente
   * @returns {Promise<Object>} Cliente atualizado
   * @throws {Error} Cliente não encontrado
   */
  static async updateClient(id, updateData) {
    const client = await Client.update(id, updateData);
    
    if (!client) {
      throw new Error('Cliente não encontrado');
    }
    
    return client;
  }

  /**
   * Remove cliente do sistema
   * @param {number} id - ID do cliente
   * @returns {Promise<boolean>} True se deletado com sucesso
   * @throws {Error} Cliente não encontrado
   */
  static async deleteClient(id) {
    const success = await Client.delete(id);
    
    if (!success) {
      throw new Error('Cliente não encontrado');
    }
    
    return success;
  }
}

module.exports = ClientService;
