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

