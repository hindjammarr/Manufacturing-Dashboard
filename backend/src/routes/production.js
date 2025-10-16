const express = require('express');
const router = express.Router();
const productionController = require('../controllers/productionController');
const { auth } = require('../middlewares/auth');

router.get('/', auth, productionController.getAllProduction);
router.post('/', auth, productionController.createProduction);
router.get('/stats', auth, productionController.getProductionStats);

module.exports = router;