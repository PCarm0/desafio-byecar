## 🚗 Desafio Byecar

Desenvolvido com Node.js, Express e PostgreSQL.

## 📋 Funcionalidades

- ✅ Autenticação JWT
- ✅ CRUD de Usuários
- ✅ CRUD de Clientes  
- ✅ CRUD de Vendas

## 🛠️ Tecnologias

- **Backend**: Node.js, Express, PostgreSQL, JWT
- **Frontend**: HTML5, CSS3, JavaScript Vanilla
- **Ferramentas**: Git, GitHub, Docker

npm install para instalar as dependencias

### Comunicação entre frontend > backend > banco de dados;
Frontend → Backend (HTTP/REST API)
- Tecnologia: JavaScript (ES6+) com Fetch API
- Protocolo: HTTP/HTTPS
- Formato de Dados: JSON
- Frontend (Browser) → Express.js Routes → Controllers → Services → Models → PostgreSQL

### Backend → Frontend (Respostas JSON)
  → sales.js (Frontend) 
  → POST /api/sales 
  → authMiddleware (valida JWT) 
  → saleController.createSale() 
  → saleService.createSale() 
  → Sale.create() 
  → PostgreSQL INSERT
  ← Retorna venda criada
  ← Frontend atualiza interface

### Backend → Banco de Dados (PostgreSQL)  
- Tecnologia: Node.js + pg (Pool de conexões)
- Arquitetura: Model-Service-Controller

### 🔄 Fluxo de Autenticação
- Login/Registro:
Frontend → POST /api/auth/login → AuthController → AuthService → User Model → PostgreSQL

- Requisições Autenticadas:
- Frontend (com JWT) → authMiddleware → Controller → Service → Model → PostgreSQL

1. Autenticação JWT
2. Validação no Backend
- Middleware verifica token JWT
- Controllers validam dados de entrada
- Services aplicam regras de negócio

### 🛡️ Proteção de Dados:
- JWT Tokens para autenticação stateless
- Soft Delete (deleted_at) para recuperação de dados
- BCrypt para hash de senhas
- Queries parametrizadas contra SQL injection

### 📊 Resumo da Arquitetura
Esta estrutura proporciona:

- ✅ Separação de responsabilidades clara
- ✅ Segurança robusta com JWT
- ✅ Manutenibilidade com código organizado
- ✅ Escalabilidade com pool de conexões
- ✅ Consistência com respostas padronizadas
- ✅ Flexibilidade para evolução do sistema
