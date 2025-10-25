const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Service para operações de autenticação e autorização
 * @class
 */
class AuthService {
  /**
   * Autentica usuário no sistema
   * @param {string} email - Email do usuário
   * @param {string} password - Senha do usuário
   * @returns {Promise<Object>} Objeto contendo dados do usuário e token JWT
   * @returns {Object} user - Dados do usuário autenticado
   * @returns {number} user.id - ID do usuário
   * @returns {string} user.email - Email do usuário
   * @returns {string} user.name - Nome do usuário
   * @returns {string} token - Token JWT para autenticação
   * @throws {Error} Credenciais inválidas - Quando email ou senha estão incorretos
   */
  static async login(email, password) {
    const user = await User.findByEmail(email);
    
    if (!user) {
      throw new Error('Credenciais inválidas');
    }

    const isPasswordValid = await User.checkPassword(password, user.password);
    
    if (!isPasswordValid) {
      throw new Error('Credenciais inválidas');
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return {
      user: { id: user.id, email: user.email, name: user.name },
      token
    };
  }

  /**
   * Registra novo usuário no sistema
   * @param {Object} userData - Dados do usuário para registro
   * @param {string} userData.email - Email do usuário
   * @param {string} userData.password - Senha do usuário
   * @param {string} userData.name - Nome do usuário
   * @returns {Promise<Object>} Objeto contendo dados do usuário e token JWT
   * @returns {Object} user - Dados do usuário registrado
   * @returns {number} user.id - ID do usuário
   * @returns {string} user.email - Email do usuário
   * @returns {string} user.name - Nome do usuário
   * @returns {string} token - Token JWT para autenticação
   * @throws {Error} Email já está em uso - Quando o email já está cadastrado no sistema
   */
  static async register(userData) {
    const existingUser = await User.findByEmail(userData.email);
    
    if (existingUser) {
      throw new Error('Email já está em uso');
    }

    const user = await User.create(userData);
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return {
      user: { id: user.id, email: user.email, name: user.name },
      token
    };
  }
}

module.exports = AuthService;
