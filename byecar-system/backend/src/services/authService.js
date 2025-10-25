const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthService {
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