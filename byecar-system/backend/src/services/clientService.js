const Client = require('../models/Client');

/**
 * Service para operações com clientes
 */
class ClientService {
  /**
   * Cria novo cliente
   * @param {Object} clientData - Dados do cliente
   * @param {number} userId - ID do usuário criador
   * @returns {Promise<Object>} Cliente criado
   */
  static async createClient(clientData, userId) {
    return await Client.create(clientData, userId);
  }

  /**
   * Lista todos os clientes
   * @returns {Promise<Array>} Lista de clientes
   */
  static async getAllClients() {
    return await Client.findAll();
  }

  /**
   * Busca cliente por ID
   * @param {number} id - ID do cliente
   * @returns {Promise<Object>} Cliente encontrado
   * @throws {Error} Se cliente não for encontrado
   */
  static async getClientById(id) {
    const client = await Client.findById(id);
    
    if (!client) {
      throw new Error('Cliente não encontrado');
    }
    
    return client;
  }

  /**
   * Atualiza cliente
   * @param {number} id - ID do cliente
   * @param {Object} updateData - Dados para atualizar
   * @returns {Promise<Object>} Cliente atualizado
   * @throws {Error} Se cliente não for encontrado
   */
  static async updateClient(id, updateData) {
    const client = await Client.update(id, updateData);
    
    if (!client) {
      throw new Error('Cliente não encontrado');
    }
    
    return client;
  }

  /**
   * Deleta cliente
   * @param {number} id - ID do cliente
   * @returns {Promise<boolean>} True se deletado com sucesso
   * @throws {Error} Se cliente não for encontrado
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