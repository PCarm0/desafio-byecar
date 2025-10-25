const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const clientRoutes = require('./src/routes/clientRoutes');
const saleRoutes = require('./src/routes/saleRoutes');

const app = express();

// Middlewares
app.use(cors({
  origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/sales', saleRoutes);

// Health check endpoint
/**
 * @description Endpoint para verificar status da API
 * @route GET /health
 */
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Byecar API funcionando! 🚀',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API info
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Byecar API está online!',
    endpoints: {
      auth: {
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register'
      },
      users: 'GET /api/users',
      clients: 'GET/POST /api/clients', 
      sales: 'GET/POST /api/sales',
      health: 'GET /health'
    }
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint não encontrado'
  });
});

const PORT = process.env.PORT || 3000;

/**
 * Inicia o servidor após testar conexão com banco
 */

app.listen(PORT, () => {
  console.log('🚀 BYECAR BACKEND INICIADO COM SUCESSO!');
  console.log(`🎯 Servidor rodando na porta ${PORT}`);
  console.log(`📊 Health Check: http://localhost:${PORT}/health`);
  console.log(`🔐 API Info: http://localhost:${PORT}/api`);
  console.log('✅ Todas as rotas configuradas!');

});

