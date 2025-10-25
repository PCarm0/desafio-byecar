const AuthService = require('../services/authService');

/**
 * Controller para operações de autenticação
 * @class
 */
class AuthController {
  /**
   * Realiza login do usuário
   * @param {Object} req - Objeto de requisição do Express
   * @param {Object} req.body - Corpo da requisição
   * @param {string} req.body.email - Email do usuário
   * @param {string} req.body.password - Senha do usuário
   * @param {Object} res - Objeto de resposta do Express
   * @returns {Promise<Object>} JSON com token de autenticação e dados do usuário
   * @throws {Error} 400 - Email e senha são obrigatórios
   * @throws {Error} 401 - Credenciais inválidas
   */
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email e senha são obrigatórios'
        });
      }

      const result = await AuthService.login(email, password);

      res.json({
        success: true,
        message: 'Login realizado com sucesso',
        data: result
      });

    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Registra novo usuário no sistema
   * @param {Object} req - Objeto de requisição do Express
   * @param {Object} req.body - Corpo da requisição
   * @param {string} req.body.email - Email do usuário
   * @param {string} req.body.password - Senha do usuário
   * @param {string} req.body.name - Nome do usuário
   * @param {Object} res - Objeto de resposta do Express
   * @returns {Promise<Object>} JSON com token de autenticação e dados do usuário criado
   * @throws {Error} 400 - Dados obrigatórios faltando ou senha muito curta
   * @throws {Error} 400 - Email já está em uso
   */
  static async register(req, res) {
    try {
      const { email, password, name } = req.body;

      if (!email || !password || !name) {
        return res.status(400).json({
          success: false,
          message: 'Email, senha e nome são obrigatórios'
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Senha deve ter pelo menos 6 caracteres'
        });
      }

      const result = await AuthService.register({ email, password, name });

      res.status(201).json({
        success: true,
        message: 'Usuário criado com sucesso',
        data: result
      });

    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = AuthController;
