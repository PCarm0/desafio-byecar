const express = require('express');
const SaleController = require('../controllers/saleController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Todas as rotas exigem autenticação
router.use(authMiddleware);

router.post('/', SaleController.createSale);
router.get('/', SaleController.getAllSales);
router.get('/:id', SaleController.getSaleById);
router.put('/:id', SaleController.updateSale);
router.delete('/:id', SaleController.deleteSale);
router.get('/client/:clientId', SaleController.getSalesByClient);

module.exports = router;