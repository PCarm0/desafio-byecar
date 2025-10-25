const express = require('express');
const ClientController = require('../controllers/clientController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Todas as rotas exigem autenticação
router.use(authMiddleware);

router.post('/', ClientController.createClient);
router.get('/', ClientController.getAllClients);
router.get('/:id', ClientController.getClientById);
router.put('/:id', ClientController.updateClient);
router.delete('/:id', ClientController.deleteClient);

module.exports = router;